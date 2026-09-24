import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  ListFilter,
  Share2,
  Sliders,
  LogOut,
  Radio,
  Cloud,
  Sun,
  Moon,
} from 'lucide-react';
import { AccentColor, ACCENT_COLORS } from '../types/theme';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  configCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  accentColor?: AccentColor;
  onOpenSettings: () => void;
  onOpenSubscription: () => void;
  onOpenWorkerModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  configCount,
  theme,
  onToggleTheme,
  accentColor = 'cyan',
  onOpenSettings,
  onOpenSubscription,
  onOpenWorkerModal,
  onLogout,
}) => {
  const isDark = theme === 'dark';
  const currentAccent = ACCENT_COLORS.find((a) => a.id === accentColor) || ACCENT_COLORS[0];

  const navItems = [
    { id: 'builder', label: 'ساخت کانفیگ', icon: PlusCircle },
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'list', label: 'کانفیگ‌های ساخته‌شده', icon: ListFilter, badge: configCount },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white/90 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className={`font-extrabold text-sm sm:text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    پنل ساخت کانفیگ کلودفلر
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
                    نسخه ۱.۰
                  </span>
                </div>
                <p className={`text-[11px] hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  تنظیمات ساخت کانفیگ VLESS و ورکر کلودفلر
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border ${isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? `${currentAccent.primary} shadow-md`
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-black/20 text-white'
                            : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Theme Toggle (روشن / تاریک) */}
              <button
                type="button"
                onClick={onToggleTheme}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  isDark
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-800 border-slate-800'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                }`}
                title={isDark ? 'تغییر به تم روشن (سفید)' : 'تغییر به تم تاریک (شب)'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Worker Modal button */}
              <button
                onClick={onOpenWorkerModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                title="اسکریپت _worker.js"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">کد ورکر</span>
                <span className="sm:hidden">ورکر</span>
              </button>

              {/* Subscription button */}
              <button
                onClick={onOpenSubscription}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold transition-colors cursor-pointer"
                title="خروجی لینک ساب‌اسکریپشن"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>لینک ساب</span>
              </button>

              {/* Settings button (Password, theme, backup) */}
              <button
                onClick={onOpenSettings}
                className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                }`}
                title="تنظیمات پنل (رمز عبور و تم)"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                title="خروج از پنل"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-3 py-2 flex items-center justify-around shadow-2xl transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800'
            : 'bg-white/95 border-slate-200'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-500 font-bold'
                  : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 text-[9px] px-1 rounded-full bg-cyan-500 text-slate-950 font-bold font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenSettings}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl cursor-pointer ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] font-bold">تنظیمات</span>
        </button>

        <button
          onClick={onOpenSubscription}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-indigo-400 cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">لینک ساب</span>
        </button>
      </div>
    </>
  );
};
