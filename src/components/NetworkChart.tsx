import React, { useState, useEffect } from 'react';
import { Activity, ArrowDown, ArrowUp, Wifi, Zap, ShieldCheck } from 'lucide-react';

export const NetworkChart: React.FC = () => {
  // Live simulated points for a buttery smooth 60fps graph
  const [dataPoints, setDataPoints] = useState<number[]>([
    24, 38, 45, 32, 58, 65, 72, 60, 85, 90, 78, 95, 110, 88, 105, 92, 115, 120, 108, 125,
  ]);
  const [downSpeed, setDownSpeed] = useState<number>(4.8);
  const [upSpeed, setUpSpeed] = useState<number>(1.2);
  const [ping, setPing] = useState<number>(128);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(30, Math.min(130, last + (Math.random() * 26 - 13)));
        return [...prev.slice(1), Math.round(next)];
      });

      setDownSpeed((prev) => +(Math.max(2.1, Math.min(18.5, prev + (Math.random() * 1.6 - 0.8)))).toFixed(1));
      setUpSpeed((prev) => +(Math.max(0.6, Math.min(5.2, prev + (Math.random() * 0.6 - 0.3)))).toFixed(1));
      setPing(Math.round(120 + Math.random() * 20));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Compute SVG polyline points
  const maxVal = 140;
  const width = 600;
  const height = 150;
  const step = width / (dataPoints.length - 1);

  const pointsString = dataPoints
    .map((val, idx) => {
      const x = idx * step;
      const y = height - (val / maxVal) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `0,${height} ${pointsString} ${width},${height}`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header of Chart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>نمودار زنده ترافیک و پینگ شبکه ورکر</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-[11px] text-slate-400">
              مانیتورینگ بلادرنگ سرعت انتقال داده و پینگ لایه کلودفلر
            </p>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">دانلود:</span>
            <span className="font-mono font-bold text-cyan-300">{downSpeed} MB/s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">آپلود:</span>
            <span className="font-mono font-bold text-indigo-300">{upSpeed} MB/s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">پینگ ورکر:</span>
            <span className="font-mono font-bold text-emerald-400">{ping}ms</span>
          </div>
        </div>
      </div>

      {/* SVG Wave Chart */}
      <div className="mt-4 relative h-36 sm:h-44 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="30" x2={width} y2="30" stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="0" y1="75" x2={width} y2="75" stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2={width} y2="120" stroke="#1e293b" strokeDasharray="4 4" />

          {/* Area under curve */}
          <polygon points={areaString} fill="url(#cyanGradient)" />

          {/* Glowing Stroke line */}
          <polyline
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />
        </svg>

        {/* Floating badge inside chart */}
        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400 backdrop-blur-sm flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>ترافیک تونل رمزنگاری‌شده TLS v1.3</span>
        </div>
      </div>

      {/* Operator Latency Bars */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">همراه اول:</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>132ms</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">ایرانسل:</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>124ms</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">رایتل:</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>145ms</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">مخابرات/ثابت:</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>110ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
