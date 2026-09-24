export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentColor = 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';

export interface ThemeSettings {
  mode: ThemeMode;
  accent: AccentColor;
  glassmorphism: boolean;
  gridBackground: boolean;
  compactMode: boolean;
}

export const ACCENT_COLORS: {
  id: AccentColor;
  name: string;
  primary: string;
  ring: string;
  gradient: string;
  bgLight: string;
  text: string;
}[] = [
  {
    id: 'cyan',
    name: 'فیروزه‌ای نئون',
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
    ring: 'ring-cyan-500/40 border-cyan-500 text-cyan-400',
    gradient: 'from-cyan-500 to-blue-600',
    bgLight: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/25',
    text: 'text-cyan-400',
  },
  {
    id: 'blue',
    name: 'آبی کلودفلر',
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    ring: 'ring-blue-500/40 border-blue-500 text-blue-400',
    gradient: 'from-blue-600 to-indigo-600',
    bgLight: 'bg-blue-500/10 text-blue-500 border-blue-500/25',
    text: 'text-blue-400',
  },
  {
    id: 'purple',
    name: 'بنفش سایبرپانک',
    primary: 'bg-purple-600 hover:bg-purple-500 text-white',
    ring: 'ring-purple-500/40 border-purple-500 text-purple-400',
    gradient: 'from-purple-600 to-pink-600',
    bgLight: 'bg-purple-500/10 text-purple-500 border-purple-500/25',
    text: 'text-purple-400',
  },
  {
    id: 'emerald',
    name: 'سبز زمردی',
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    ring: 'ring-emerald-500/40 border-emerald-500 text-emerald-400',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
    text: 'text-emerald-400',
  },
  {
    id: 'amber',
    name: 'طلایی آفتابی',
    primary: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    ring: 'ring-amber-500/40 border-amber-500 text-amber-400',
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    text: 'text-amber-400',
  },
  {
    id: 'rose',
    name: 'سرخابی نئون',
    primary: 'bg-rose-500 hover:bg-rose-400 text-white',
    ring: 'ring-rose-500/40 border-rose-500 text-rose-400',
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-500/10 text-rose-500 border-rose-500/25',
    text: 'text-rose-400',
  },
];
