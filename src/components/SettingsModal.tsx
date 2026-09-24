import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  Sun,
  Moon,
  Check,
  AlertCircle,
  RotateCcw,
  Download,
  Upload,
  Sliders,
  Shield,
  Trash2,
  Sparkles,
  Save,
  Cpu,
  Globe,
  Share2,
  Terminal,
  ShieldCheck,
  Server,
  Layers,
  Zap,
  Palette,
  Eye,
} from 'lucide-react';
import { ProxyConfig } from '../types/config';
import { AccentColor, ACCENT_COLORS, ThemeMode } from '../types/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  onUpdatePassword: (newPass: string) => void;
  onResetToDefault: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (newTheme: 'dark' | 'light') => void;
  accentColor: AccentColor;
  onSelectAccentColor: (accent: AccentColor) => void;
  glassEffect: boolean;
  onToggleGlassEffect: (enabled: boolean) => void;
  gridBackground: boolean;
  onToggleGridBackground: (enabled: boolean) => void;
  configs: ProxyConfig[];
  onImportConfigs: (configs: ProxyConfig[]) => void;
  onClearAllConfigs: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentPassword,
  onUpdatePassword,
  onResetToDefault,
  theme,
  onToggleTheme,
  accentColor,
  onSelectAccentColor,
  glassEffect,
  onToggleGlassEffect,
  gridBackground,
  onToggleGridBackground,
  configs,
  onImportConfigs,
  onClearAllConfigs,
}) => {
  const [activeTab, setActiveTab] = useState<
    'theme' | 'password' | 'worker' | 'fragment' | 'dns' | 'backup'
  >('theme');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Worker & Network defaults
  const [defaultHost, setDefaultHost] = useState(
    () => localStorage.getItem('kfg_default_host') || ''
  );
  const [defaultProxyIp, setDefaultProxyIp] = useState(
    () => localStorage.getItem('kfg_default_proxy_ip') || 'cdn.jsdelivr.net'
  );
  const [defaultPort, setDefaultPort] = useState(
    () => Number(localStorage.getItem('kfg_default_port')) || 443
  );
  const [autoEarlyData, setAutoEarlyData] = useState(
    () => localStorage.getItem('kfg_auto_early_data') !== 'false'
  );

  // Fragment & Anti-Filtering defaults
  const [enableFragmentDefault, setEnableFragmentDefault] = useState(
    () => localStorage.getItem('kfg_fragment_enabled') === 'true'
  );
  const [fragPackets, setFragPackets] = useState(
    () => localStorage.getItem('kfg_frag_packets') || 'tlshello'
  );
  const [fragLength, setFragLength] = useState(
    () => localStorage.getItem('kfg_frag_length') || '100-200'
  );
  const [fragInterval, setFragInterval] = useState(
    () => localStorage.getItem('kfg_frag_interval') || '10-20'
  );
  const [fakeSni, setFakeSni] = useState(
    () => localStorage.getItem('kfg_fake_sni') || ''
  );
  const [utlsFp, setUtlsFp] = useState(
    () => localStorage.getItem('kfg_utls_fp') || 'chrome'
  );

  // DNS & Routing Rules
  const [dohServer, setDohServer] = useState(
    () => localStorage.getItem('kfg_doh_server') || 'https://1.1.1.1/dns-query'
  );
  const [directIran, setDirectIran] = useState(
    () => localStorage.getItem('kfg_direct_iran') !== 'false'
  );
  const [blockAds, setBlockAds] = useState(
    () => localStorage.getItem('kfg_block_ads') !== 'false'
  );
  const [blockAdult, setBlockAdult] = useState(
    () => localStorage.getItem('kfg_block_adult') === 'true'
  );
  const [bypassLan, setBypassLan] = useState(
    () => localStorage.getItem('kfg_bypass_lan') !== 'false'
  );

  // Subscription Preferences
  const [subPrefix, setSubPrefix] = useState(
    () => localStorage.getItem('kfg_sub_prefix') || 'CF-Node'
  );
  const [subUpdateInterval, setSubUpdateInterval] = useState(
    () => localStorage.getItem('kfg_sub_update') || '24'
  );

  // Feedback states
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const currentAccent = ACCENT_COLORS.find((a) => a.id === accentColor) || ACCENT_COLORS[0];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (oldPassword !== currentPassword) {
      setPwdError('رمز عبور فعلی نادرست است!');
      return;
    }

    if (newPassword.length < 4) {
      setPwdError('رمز عبور جدید باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('تکرار رمز عبور با رمز جدید مطابقت ندارد.');
      return;
    }

    setPwdError('');
    onUpdatePassword(newPassword);
    setPwdSuccess('رمز عبور با موفقیت به‌روزرسانی شد.');
    setTimeout(() => {
      setPwdSuccess('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleResetPassword = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید رمز پنل به admin برگردانده شود؟')) {
      onResetToDefault();
      setPwdSuccess('رمز عبور با موفقیت به admin ریست شد.');
      setTimeout(() => setPwdSuccess(''), 1500);
    }
  };

  // Save all technical settings to localStorage
  const handleSaveAllPreferences = () => {
    localStorage.setItem('kfg_default_host', defaultHost);
    localStorage.setItem('kfg_default_proxy_ip', defaultProxyIp);
    localStorage.setItem('kfg_default_port', defaultPort.toString());
    localStorage.setItem('kfg_auto_early_data', autoEarlyData.toString());

    localStorage.setItem('kfg_fragment_enabled', enableFragmentDefault.toString());
    localStorage.setItem('kfg_frag_packets', fragPackets);
    localStorage.setItem('kfg_frag_length', fragLength);
    localStorage.setItem('kfg_frag_interval', fragInterval);
    localStorage.setItem('kfg_fake_sni', fakeSni);
    localStorage.setItem('kfg_utls_fp', utlsFp);

    localStorage.setItem('kfg_doh_server', dohServer);
    localStorage.setItem('kfg_direct_iran', directIran.toString());
    localStorage.setItem('kfg_block_ads', blockAds.toString());
    localStorage.setItem('kfg_block_adult', blockAdult.toString());
    localStorage.setItem('kfg_bypass_lan', bypassLan.toString());

    localStorage.setItem('kfg_sub_prefix', subPrefix);
    localStorage.setItem('kfg_sub_update', subUpdateInterval);

    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2000);
  };

  // Reset all technical preferences to defaults
  const handleResetAllPreferences = () => {
    if (window.confirm('آیا مایل به بازگردانی تمام تنظیمات به مقادیر پیش‌فرض هستید؟')) {
      setDefaultHost('');
      setDefaultProxyIp('cdn.jsdelivr.net');
      setDefaultPort(443);
      setAutoEarlyData(true);
      setEnableFragmentDefault(false);
      setFragPackets('tlshello');
      setFragLength('100-200');
      setFragInterval('10-20');
      setFakeSni('');
      setUtlsFp('chrome');
      setDohServer('https://1.1.1.1/dns-query');
      setDirectIran(true);
      setBlockAds(true);
      setBlockAdult(false);
      setBypassLan(true);
      setSubPrefix('CF-Node');
      setSubUpdateInterval('24');

      setSaveSettingsSuccess(true);
      setTimeout(() => setSaveSettingsSuccess(false), 2000);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      preferences: {
        theme,
        accentColor,
        glassEffect,
        gridBackground,
        defaultHost,
        defaultProxyIp,
        defaultPort,
        autoEarlyData,
        enableFragmentDefault,
        fragPackets,
        fragLength,
        fragInterval,
        fakeSni,
        utlsFp,
        dohServer,
        directIran,
        blockAds,
        blockAdult,
        bypassLan,
        subPrefix,
        subUpdateInterval,
      },
      configs: configs,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudflare-panel-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.configs && Array.isArray(parsed.configs)) {
          onImportConfigs(parsed.configs);
        } else if (Array.isArray(parsed)) {
          onImportConfigs(parsed);
        }

        if (parsed.preferences) {
          const p = parsed.preferences;
          if (p.theme) onToggleTheme(p.theme);
          if (p.accentColor) onSelectAccentColor(p.accentColor);
          if (p.defaultHost) setDefaultHost(p.defaultHost);
          if (p.defaultProxyIp) setDefaultProxyIp(p.defaultProxyIp);
          if (p.defaultPort) setDefaultPort(Number(p.defaultPort));
          if (p.dohServer) setDohServer(p.dohServer);
          if (p.fakeSni) setFakeSni(p.fakeSni);
        }

        setImportStatus('اطلاعات و تنظیمات با موفقیت بازیابی شدند.');
      } catch (err) {
        setImportStatus('خطا در خواندن فایل JSON.');
      }
      setTimeout(() => setImportStatus(''), 2500);
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'theme', label: 'ظاهر و دکمه‌ها', icon: Palette },
    { id: 'password', label: 'رمز عبور', icon: Key },
    { id: 'worker', label: 'تنظیمات ورکر', icon: Terminal },
    { id: 'fragment', label: 'فرگمنت و SNI', icon: ShieldCheck },
    { id: 'dns', label: 'مسیریابی و DNS', icon: Globe },
    { id: 'backup', label: 'پشتیبان‌گیری', icon: Download },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl relative transition-all max-h-[92vh] flex flex-col ${
          isDark
            ? 'bg-slate-900/95 border border-slate-700/80 text-slate-100'
            : 'bg-white/95 border border-slate-200 text-slate-800'
        } ${glassEffect ? 'backdrop-blur-xl' : ''}`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${currentAccent.bgLight}`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                تنظیمات جامع پنل
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                پوسته، استایل دکمه‌ها، پارامترهای ورکر، فرگمنت و سیستم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector bar */}
        <div
          className={`flex items-center gap-1.5 mt-3.5 p-1.5 rounded-2xl border overflow-x-auto ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? `${currentAccent.primary} shadow-md`
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Content Container */}
        <div className="my-4 flex-1 overflow-y-auto pr-1">
          {/* Tab: Appearance & Button Settings (تنظیمات ظاهری و دکمه‌ها) */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* 1. Theme Mode: Dark vs Light */}
              <div>
                <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ۱. پوسته اصلی پنل (Theme Mode):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Dark Theme */}
                  <button
                    type="button"
                    onClick={() => onToggleTheme('dark')}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                      theme === 'dark'
                        ? `bg-slate-950 ring-2 ${currentAccent.ring} text-white`
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Moon className="w-4 h-4" />
                      </div>
                      {theme === 'dark' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">تم تاریک (شب)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        پس‌زمینه تیره، ملایم برای چشم و صرفه‌جویی باتری
                      </div>
                    </div>
                  </button>

                  {/* Light Theme */}
                  <button
                    type="button"
                    onClick={() => onToggleTheme('light')}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                      theme === 'light'
                        ? `bg-slate-50 ring-2 ${currentAccent.ring} text-slate-900`
                        : isDark
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                      {theme === 'light' && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">تم روشن (سفید)</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        کنتراست بالا، خوانایی حداکثری و شفاف
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Accent Color Palette for Buttons & Active Elements */}
              <div>
                <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ۲. رنگ تأکیدی دکمه‌ها و المان‌ها (Button & Accent Color):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ACCENT_COLORS.map((col) => {
                    const isSelected = accentColor === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => onSelectAccentColor(col.id)}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 text-right cursor-pointer ${
                          isSelected
                            ? `ring-2 ${col.ring} ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`
                            : isDark
                            ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full bg-gradient-to-tr ${col.gradient} shadow-sm shrink-0`} />
                          <span className="text-xs font-bold">{col.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Visual Effects: Glassmorphism & Background Grid */}
              <div>
                <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ۳. جلوه‌های گرافیکی و بصری (Visual Effects):
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold">جلوه شیشه‌ای بلور (Glassmorphism Effect)</span>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        مات‌کردن پس‌زمینه کارت‌ها و پنجره‌ها با افکت شیشه‌ای
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={glassEffect}
                      onChange={(e) => onToggleGlassEffect(e.target.checked)}
                      className="rounded text-cyan-500"
                    />
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold">پترن مشبک پس‌زمینه (Background Grid Glow)</span>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        نمایش شبکه نوری مدرن در پس‌زمینه پنل
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={gridBackground}
                      onChange={(e) => onToggleGridBackground(e.target.checked)}
                      className="rounded text-cyan-500"
                    />
                  </label>
                </div>
              </div>

              {/* 4. Live Button Style Preview */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-3 text-xs font-bold">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>پیش‌نمایش استایل دکمه‌ها با تم فعلی:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${currentAccent.primary}`}
                  >
                    دکمه اصلی (Primary Action)
                  </button>
                  <button
                    type="button"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${currentAccent.bgLight}`}
                  >
                    دکمه کپی لینک (Secondary)
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                  >
                    دکمه خنثی (Neutral)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Password Form */}
          {activeTab === 'password' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {pwdSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{pwdSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      رمز عبور فعلی:
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="رمز عبور فعلی..."
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                        isDark
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      رمز عبور جدید:
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="حداقل ۴ کاراکتر..."
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                        isDark
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      تکرار رمز عبور جدید:
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="تکرار رمز جدید..."
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                        isDark
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  {pwdError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{pwdError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className={`px-3 py-2 text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="ریست به رمز پیش‌فرض admin"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ریست به admin</span>
                    </button>

                    <button
                      type="submit"
                      className={`px-5 py-2.5 text-xs font-bold rounded-xl ${currentAccent.primary} flex items-center gap-1.5 shadow-md cursor-pointer`}
                    >
                      <Check className="w-4 h-4" />
                      <span>ذخیره رمز جدید</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Tab: Worker & Network Defaults */}
          {activeTab === 'worker' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    دامنه پیش‌فرض ورکر (Host / SNI):
                  </label>
                  <input
                    type="text"
                    value={defaultHost}
                    onChange={(e) => setDefaultHost(e.target.value)}
                    placeholder="my-worker.workers.dev"
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono dir-ltr text-left focus:outline-none focus:border-cyan-500 ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    پیش‌فرض Proxy IP (رفع ارور ۱۰۰۰):
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={defaultProxyIp}
                      onChange={(e) => setDefaultProxyIp(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono dir-ltr text-left focus:outline-none focus:border-cyan-500 ${
                        isDark
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                    <select
                      onChange={(e) => setDefaultProxyIp(e.target.value)}
                      value={defaultProxyIp}
                      className={`rounded-xl px-2 text-xs border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                    >
                      <option value="cdn.jsdelivr.net">jsDelivr</option>
                      <option value="cloudflare.com">Cloudflare</option>
                      <option value="icook.hk">icook.hk</option>
                      <option value="104.16.148.86">Clean IP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    پورت پیش‌فرض ورکر:
                  </label>
                  <select
                    value={defaultPort}
                    onChange={(e) => setDefaultPort(Number(e.target.value))}
                    className={`w-full rounded-xl px-3 py-2 text-xs ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value={443}>443 (TLS استاندارد)</option>
                    <option value={8443}>8443 (TLS)</option>
                    <option value={2053}>2053 (TLS)</option>
                    <option value={2083}>2083 (TLS)</option>
                    <option value={2087}>2087 (TLS)</option>
                    <option value={2096}>2096 (TLS)</option>
                    <option value={80}>80 (HTTP غیر TLS)</option>
                    <option value={8080}>8080 (HTTP)</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    پیشوند نام کانفیگ‌ها در ساب:
                  </label>
                  <input
                    type="text"
                    value={subPrefix}
                    onChange={(e) => setSubPrefix(e.target.value)}
                    placeholder="CF-Node"
                    className={`w-full rounded-xl px-3 py-2 text-xs ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <label
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold">فعال‌سازی خودکار Early Data (?ed=2048)</span>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    کاهش محسوس پینگ اولیه در تمامی کانفیگ‌ها
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoEarlyData}
                  onChange={(e) => setAutoEarlyData(e.target.checked)}
                  className="rounded text-cyan-500"
                />
              </label>
            </div>
          )}

          {/* Tab: Fragment & Anti-Filtering */}
          {activeTab === 'fragment' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <label
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold">فعال بودن فرگمنت به طور پیش‌فرض</span>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    تکه‌تکه کردن بسته‌های TLS برای دور زدن فیلترینگ شدید
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableFragmentDefault}
                  onChange={(e) => setEnableFragmentDefault(e.target.checked)}
                  className="rounded text-cyan-500"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    نوع بسته (Packets):
                  </label>
                  <select
                    value={fragPackets}
                    onChange={(e) => setFragPackets(e.target.value)}
                    className={`w-full rounded-xl px-2.5 py-2 text-xs ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="tlshello">tlshello (توصیه شده)</option>
                    <option value="1-1">1-1</option>
                    <option value="1-2">1-2</option>
                    <option value="1-3">1-3</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    طول قطعه (Length):
                  </label>
                  <input
                    type="text"
                    value={fragLength}
                    onChange={(e) => setFragLength(e.target.value)}
                    placeholder="100-200"
                    className={`w-full rounded-xl px-2.5 py-2 text-xs font-mono text-center ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-cyan-300'
                        : 'bg-slate-50 border border-slate-300 text-cyan-600'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    فاصله (Interval ms):
                  </label>
                  <input
                    type="text"
                    value={fragInterval}
                    onChange={(e) => setFragInterval(e.target.value)}
                    placeholder="10-20"
                    className={`w-full rounded-xl px-2.5 py-2 text-xs font-mono text-center ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-cyan-300'
                        : 'bg-slate-50 border border-slate-300 text-cyan-600'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    دامنه جعلی / Fake SNI (Domain Fronting):
                  </label>
                  <input
                    type="text"
                    value={fakeSni}
                    onChange={(e) => setFakeSni(e.target.value)}
                    placeholder="مثال: speedtest.net یا zoom.us"
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono dir-ltr text-left ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    اثر انگشت uTLS (Fingerprint):
                  </label>
                  <select
                    value={utlsFp}
                    onChange={(e) => setUtlsFp(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-white'
                        : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="chrome">Chrome</option>
                    <option value="firefox">Firefox</option>
                    <option value="safari">Safari (iOS)</option>
                    <option value="edge">Edge</option>
                    <option value="random">Randomized</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab: DNS & Routing Rules */}
          {activeTab === 'dns' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  سرور DoH DNS امن:
                </label>
                <select
                  value={dohServer}
                  onChange={(e) => setDohServer(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-white'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="https://1.1.1.1/dns-query">Cloudflare DoH (1.1.1.1)</option>
                  <option value="https://dns.google/dns-query">Google DoH (8.8.8.8)</option>
                  <option value="https://dns.quad9.net/dns-query">Quad9 DoH (9.9.9.9)</option>
                  <option value="https://dns.adguard-dns.com/dns-query">
                    AdGuard DNS (مسدودسازی تبلیغات)
                  </option>
                  <option value="https://shecan.ir/dns-query">شکن (تحریم‌شکن داخلی)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span>عبور مستقیم سایت‌های ایرانی بدون فیلترشکن (Direct IR)</span>
                  <input
                    type="checkbox"
                    checked={directIran}
                    onChange={(e) => setDirectIran(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                </label>

                <label
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span>مسدودسازی تبلیغات اینترنتی و پاپ‌آپ‌ها (Block Ads)</span>
                  <input
                    type="checkbox"
                    checked={blockAds}
                    onChange={(e) => setBlockAds(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                </label>

                <label
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span>مسدودسازی سایت‌های نامناسب و بدافزارها (Family Protection)</span>
                  <input
                    type="checkbox"
                    checked={blockAdult}
                    onChange={(e) => setBlockAdult(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                </label>

                <label
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span>مسیریابی مستقیم آدرس‌های شبکه محلی (Bypass LAN / Private IPs)</span>
                  <input
                    type="checkbox"
                    checked={bypassLan}
                    onChange={(e) => setBypassLan(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Tab: Backup & System */}
          {activeTab === 'backup' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Download className={`w-4 h-4 ${currentAccent.text}`} />
                    <div className="text-right">
                      <div className="text-xs font-bold">دانلود فایل پشتیبان کامل (Backup JSON)</div>
                      <div className="text-[10px] text-slate-400">
                        شامل کلیه کانفیگ‌ها، تنظیمات فرگمنت، ورکر، تم و DNS
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${currentAccent.text}`}>
                    {configs.length} کانفیگ
                  </span>
                </button>

                <label
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 hover:border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <div className="text-right">
                      <div className="text-xs font-bold">بازیابی از فایل پشتیبان (Restore JSON)</div>
                      <div className="text-[10px] text-slate-400">بازگردانی کانفیگ‌ها، تم و ترجیحات</div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                  <span className="text-xs font-bold text-indigo-400">انتخاب فایل</span>
                </label>

                <button
                  type="button"
                  onClick={onClearAllConfigs}
                  className="w-full p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف تمامی کانفیگ‌های ذخیره‌شده در پنل</span>
                </button>
              </div>

              {importStatus && (
                <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${currentAccent.bgLight}`}>
                  <Check className="w-4 h-4" />
                  <span>{importStatus}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`pt-3 border-t flex items-center justify-between gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          {activeTab !== 'password' && activeTab !== 'backup' && activeTab !== 'theme' && (
            <div className="flex items-center gap-2 w-full justify-between">
              <button
                type="button"
                onClick={handleResetAllPreferences}
                className={`px-3 py-2 text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ریست این بخش</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAllPreferences}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl ${currentAccent.primary} flex items-center gap-1.5 shadow-md cursor-pointer`}
              >
                {saveSettingsSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ذخیره شد!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>ذخیره تنظیمات</span>
                  </>
                )}
              </button>
            </div>
          )}

          {(activeTab === 'password' || activeTab === 'backup' || activeTab === 'theme') && (
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>تنظیمات شما به صورت امن و آنی در مرورگر ذخیره می‌شوند.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
