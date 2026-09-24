import React, { useState } from 'react';
import { ShieldAlert, Key, Check, AlertCircle, Eye, EyeOff, Lock, Sparkles } from 'lucide-react';

interface SetPasswordModalProps {
  isOpen: boolean;
  onSavePassword: (newPassword: string) => void;
}

export const SetPasswordModal: React.FC<SetPasswordModalProps> = ({ isOpen, onSavePassword }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError('لطفاً رمز عبور جدید را وارد کنید.');
      return;
    }

    if (newPassword.length < 4) {
      setError('رمز عبور باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    if (newPassword === 'admin') {
      setError('لطفاً رمزی غیر از admin پیش‌فرض انتخاب کنید تا امنیت پنل حفظ شود.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('تکرار رمز عبور با رمز جدید همخوانی ندارد!');
      return;
    }

    setError('');
    onSavePassword(newPassword);
  };

  const isMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-slate-100">
        
        {/* Glow accent */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">
            تعیین رمز عبور اصلی پنل
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            شما با رمز پیش‌فرض وارد شده‌اید. لطفاً رمز عبور اصلی و دائمی پنل را دوبار وارد کنید تا از این پس فقط با این رمز بتوانید وارد شوید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              رمز عبور جدید پنل:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                placeholder="رمز عبور دلخواه خود را بنویسید..."
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-xl pr-10 pl-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>تکرار رمز عبور جدید:</span>
              {isMatch && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" />
                  رمزها مطابقت دارند
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="رمز عبور را مجدداً وارد کنید..."
                className={`w-full bg-slate-950/80 border rounded-xl pr-10 pl-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 font-mono ${
                  confirmPassword && !isMatch
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>نکات امنیتی:</span>
            </div>
            <p>• این رمز در حافظه مرورگر شما ذخیره شده و برای دفعات بعدی استفاده خواهد شد.</p>
            <p>• می‌توانید در هر زمان از بخش تنظیمات بالای صفحه این رمز را مجدداً تغییر دهید.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
          >
            <Check className="w-4 h-4" />
            <span>تأیید و ذخیره رمز جدید</span>
          </button>
        </form>
      </div>
    </div>
  );
};
