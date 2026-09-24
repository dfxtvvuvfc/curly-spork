import React, { useState, useEffect } from 'react';
import { ProxyConfig, OperatorType } from './types/config';
import { AccentColor } from './types/theme';
import { generateUUID, generateProxyUri } from './utils/configGenerators';
import { LoginScreen } from './components/LoginScreen';
import { SetPasswordModal } from './components/SetPasswordModal';
import { SettingsModal } from './components/SettingsModal';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ConfigBuilder } from './components/ConfigBuilder';
import { ConfigList } from './components/ConfigList';
import { QRCodeModal } from './components/QRCodeModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { CloudflareWorkerModal } from './components/CloudflareWorkerModal';

const DEFAULT_PASSWORD = 'admin';

export default function App() {
  // Authentication & Password state
  const [panelPassword, setPanelPassword] = useState<string>(() => {
    return localStorage.getItem('kfg_panel_password') || DEFAULT_PASSWORD;
  });

  const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(() => {
    return localStorage.getItem('kfg_is_password_changed') === 'true';
  });

  // Theme & Appearance states
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('kfg_panel_theme') as 'dark' | 'light') || 'dark';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem('kfg_accent_color') as AccentColor) || 'cyan';
  });

  const [glassEffect, setGlassEffect] = useState<boolean>(() => {
    return localStorage.getItem('kfg_glass_effect') !== 'false';
  });

  const [gridBackground, setGridBackground] = useState<boolean>(() => {
    return localStorage.getItem('kfg_grid_background') !== 'false';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-black';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-900 antialiased selection:bg-cyan-500 selection:text-black';
    }
  }, [theme]);

  const handleSelectAccentColor = (newAccent: AccentColor) => {
    setAccentColor(newAccent);
    localStorage.setItem('kfg_accent_color', newAccent);
  };

  const handleToggleGlassEffect = (enabled: boolean) => {
    setGlassEffect(enabled);
    localStorage.setItem('kfg_glass_effect', enabled.toString());
  };

  const handleToggleGridBackground = (enabled: boolean) => {
    setGridBackground(enabled);
    localStorage.setItem('kfg_grid_background', enabled.toString());
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showWorkerModal, setShowWorkerModal] = useState<boolean>(false);

  // App Tabs
  const [activeTab, setActiveTab] = useState<string>('builder');

  // Configs state with low ping early data presets
  const [configs, setConfigs] = useState<ProxyConfig[]>(() => {
    const saved = localStorage.getItem('kfg_saved_configs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse configs from localStorage', e);
      }
    }

    // Default starter configs if fresh panel with low-ping clean IPs & early data
    const initialUuid = generateUUID();
    const defaults: ProxyConfig[] = [
      {
        id: 'cfg-def-1',
        name: '🚀 همراه اول | MCI Low-Ping VLESS',
        protocol: 'vless',
        server: '104.16.148.86',
        port: 443,
        uuid: initialUuid,
        transport: 'ws',
        path: '/?ed=2048',
        host: 'worker.cloudflare.workers.dev',
        sni: 'worker.cloudflare.workers.dev',
        security: 'tls',
        operator: 'mci',
        createdAt: Date.now() - 3600000,
        uri: '',
      },
      {
        id: 'cfg-def-2',
        name: '⚡ ایرانسل | MTN Ultra Fast VLESS',
        protocol: 'vless',
        server: '104.24.111.208',
        port: 443,
        uuid: initialUuid,
        transport: 'ws',
        path: '/?ed=2048',
        host: 'worker.cloudflare.workers.dev',
        sni: 'worker.cloudflare.workers.dev',
        security: 'tls',
        operator: 'irancell',
        createdAt: Date.now() - 1800000,
        uri: '',
      },
      {
        id: 'cfg-def-3',
        name: '🌐 رایتل | Rightel Clean VLESS',
        protocol: 'vless',
        server: '104.16.208.10',
        port: 443,
        uuid: initialUuid,
        transport: 'ws',
        path: '/?ed=2048',
        host: 'worker.cloudflare.workers.dev',
        sni: 'worker.cloudflare.workers.dev',
        security: 'tls',
        operator: 'rightel',
        createdAt: Date.now() - 900000,
        uri: '',
      },
      {
        id: 'cfg-def-4',
        name: '📶 مخابرات و شاتل | Fixed Telecom VLESS',
        protocol: 'vless',
        server: '104.21.35.105',
        port: 443,
        uuid: initialUuid,
        transport: 'ws',
        path: '/?ed=2048',
        host: 'worker.cloudflare.workers.dev',
        sni: 'worker.cloudflare.workers.dev',
        security: 'tls',
        operator: 'telecom',
        createdAt: Date.now() - 300000,
        uri: '',
      },
    ];

    return defaults.map((d) => ({
      ...d,
      uri: generateProxyUri(d),
    }));
  });

  // Save configs to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('kfg_saved_configs', JSON.stringify(configs));
  }, [configs]);

  // Modal states
  const [selectedQrConfig, setSelectedQrConfig] = useState<ProxyConfig | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  // Toggle theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('kfg_panel_theme', nextTheme);
  };

  const handleSetTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('kfg_panel_theme', newTheme);
  };

  // Handle Login flow
  const handleLoginSuccess = (isDefault: boolean) => {
    if (isDefault && !isPasswordChanged) {
      setShowSetPasswordModal(true);
    } else {
      setIsAuthenticated(true);
    }
  };

  // Handle saving new permanent password
  const handleSaveInitialPassword = (newPass: string) => {
    setPanelPassword(newPass);
    setIsPasswordChanged(true);
    localStorage.setItem('kfg_panel_password', newPass);
    localStorage.setItem('kfg_is_password_changed', 'true');
    setShowSetPasswordModal(false);
    setIsAuthenticated(true);
  };

  // Handle updating password later
  const handleUpdatePassword = (newPass: string) => {
    setPanelPassword(newPass);
    setIsPasswordChanged(true);
    localStorage.setItem('kfg_panel_password', newPass);
    localStorage.setItem('kfg_is_password_changed', 'true');
  };

  // Reset to default admin
  const handleResetToDefaultPassword = () => {
    setPanelPassword(DEFAULT_PASSWORD);
    setIsPasswordChanged(false);
    localStorage.setItem('kfg_panel_password', DEFAULT_PASSWORD);
    localStorage.setItem('kfg_is_password_changed', 'false');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Config actions
  const handleAddConfigs = (newConfigs: ProxyConfig[]) => {
    setConfigs((prev) => [...newConfigs, ...prev]);
  };

  const handleSaveSingleConfig = (newConfig: ProxyConfig) => {
    setConfigs((prev) => [newConfig, ...prev]);
  };

  const handleDeleteConfig = (id: string) => {
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllConfigs = () => {
    if (window.confirm('آیا از حذف تمام کانفیگ‌های ذخیره شده در پنل اطمینان دارید؟')) {
      setConfigs([]);
    }
  };

  const handleImportConfigs = (imported: ProxyConfig[]) => {
    setConfigs((prev) => [...imported, ...prev]);
  };

  // If not authenticated, render smooth Login Screen
  if (!isAuthenticated && !showSetPasswordModal) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        savedPassword={panelPassword}
        onResetPassword={handleResetToDefaultPassword}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-black pb-16 md:pb-0 transition-colors relative ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } ${
        gridBackground
          ? isDark
            ? 'bg-grid-pattern-dark'
            : 'bg-grid-pattern-light'
          : ''
      }`}
    >
      {/* Set Master Password Modal for First Turn with admin */}
      <SetPasswordModal
        isOpen={showSetPasswordModal}
        onSavePassword={handleSaveInitialPassword}
      />

      {/* Settings Modal (Password, Appearance, Palette, Backup/Restore) */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentPassword={panelPassword}
        onUpdatePassword={handleUpdatePassword}
        onResetToDefault={handleResetToDefaultPassword}
        theme={theme}
        onToggleTheme={handleSetTheme}
        accentColor={accentColor}
        onSelectAccentColor={handleSelectAccentColor}
        glassEffect={glassEffect}
        onToggleGlassEffect={handleToggleGlassEffect}
        gridBackground={gridBackground}
        onToggleGridBackground={handleToggleGridBackground}
        configs={configs}
        onImportConfigs={handleImportConfigs}
        onClearAllConfigs={handleClearAllConfigs}
      />

      {/* Cloudflare Worker Modal */}
      <CloudflareWorkerModal
        isOpen={showWorkerModal}
        onClose={() => setShowWorkerModal(false)}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        config={selectedQrConfig}
        onClose={() => setSelectedQrConfig(null)}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        configs={configs}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        configCount={configs.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        accentColor={accentColor}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenSubscription={() => setShowSubscriptionModal(true)}
        onOpenWorkerModal={() => setShowWorkerModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7">
        {activeTab === 'builder' && (
          <ConfigBuilder
            onSaveConfig={handleSaveSingleConfig}
            onSaveBatchConfigs={handleAddConfigs}
            onOpenQR={(cfg) => setSelectedQrConfig(cfg)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            configs={configs}
            onAddConfigs={handleAddConfigs}
            onOpenQR={(cfg) => setSelectedQrConfig(cfg)}
            onOpenSubscription={() => setShowSubscriptionModal(true)}
            onOpenWorkerModal={() => setShowWorkerModal(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'list' && (
          <ConfigList
            configs={configs}
            onDeleteConfig={handleDeleteConfig}
            onClearAll={handleClearAllConfigs}
            onOpenQR={(cfg) => setSelectedQrConfig(cfg)}
            onOpenSubscription={() => setShowSubscriptionModal(true)}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer
        className={`border-t py-4 text-center text-xs transition-colors ${
          isDark
            ? 'border-slate-900 bg-slate-950 text-slate-500'
            : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>پنل ساخت کانفیگ کلودفلر • نسخه ۱.۰ (پینگ پایین)</span>
          <span className="font-mono">بهینه شده برای موبایل و ویندوز • تم {isDark ? 'تاریک' : 'روشن'}</span>
        </div>
      </footer>
    </div>
  );
}
