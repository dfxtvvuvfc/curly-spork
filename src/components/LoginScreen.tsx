import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Lock,
  Info,
  CheckCircle2,
  Cloud,
  Zap,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (isDefaultPassword: boolean) => void;
  savedPassword: string;
  onResetPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  savedPassword,
  onResetPassword,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedHint, setCopiedHint] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('لطفاً رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);
    setError('');

    // Smooth verification without artificial blocking/lag
    setTimeout(() => {
      setLoading(false);
      if (password === savedPassword) {
        onLoginSuccess(password === 'admin');
      } else {
        setError('رمز عبور وارد شده اشتباه است!');
      }
    }, 180);
  };

  const handleAutoFill = () => {
    setPassword(savedPassword);
    setError('');
    setCopiedHint(true);
    setTimeout(() => setCopiedHint(false), 2000);
  };

  const handleResetToAdmin = () => {
    onResetPassword();
    setPassword('admin');
    setError('');
    setShowForgotNotice(false);
    setCopiedHint(true);
    setTimeout(() => setCopiedHint(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Default / Current Password Notice Card */}
        <div className="mb-4 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-md shadow-lg shadow-cyan-950/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">رمز فعال فعلی پنل شما:</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5 flex items-center gap-1.5">
                  <code className="px-2.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 font-mono text-sm tracking-wider">
                    {savedPassword}
                  </code>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 transition-colors flex items-center gap-1 shrink-0 font-medium cursor-pointer"
            >
              {copiedHint ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>جاگذاری شد!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>جاگذاری خودکار</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 pr-10 leading-relaxed">
            {savedPassword === 'admin'
              ? 'رمز اولیه admin است. روی «جاگذاری خودکار» کلیک کنید و وارد شوید.'
              : `رمز تعیین‌شده شما هم‌اکنون «${savedPassword}» است. می‌توانید با دکمه جاگذاری خودکار آن را وارد کنید.`}
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 mb-3.5">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ورود به پنل ساخت کانفیگ
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              مدیریت و تولید کانفیگ‌های VLESS, VMess و ورکر کلودفلر
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">رمز عبور پنل</label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  رمز را فراموش کرده‌اید؟
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="رمز عبور را وارد کنید..."
                  autoFocus
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pr-10 pl-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Accordion */}
            {showForgotNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-amber-400">
                  <span>بازیابی رمز عبور:</span>
                  <span className="font-mono bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 text-amber-300">
                    {savedPassword}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  رمز فعلی شما در بالا نمایش داده شده است. همچنین با دکمه زیر می‌توانید آن را مستقیماً به
                  <strong className="text-white"> admin </strong> بازگردانید.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetToAdmin}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ریست رمز به admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>جاگذاری خودکار</span>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-indigo-600 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-cyan-500/25 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به داشبورد</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>پینگ پایین و رمزنگاری امن</span>
            </div>
            <span className="font-bold text-cyan-400">نسخه ۱.۰</span>
          </div>
        </div>
      </div>
    </div>
  );
};
