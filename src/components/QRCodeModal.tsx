import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, ExternalLink, QrCode } from 'lucide-react';
import { ProxyConfig } from '../types/config';

interface QRCodeModalProps {
  config: ProxyConfig | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ config, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!config || !canvasRef.current) return;
    QRCode.toCanvas(
      canvasRef.current,
      config.uri,
      {
        width: 260,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [config]);

  if (!config) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(config.uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${config.name.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative text-slate-100 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
          <QrCode className="w-5 h-5" />
        </div>

        <h3 className="text-base font-bold text-white text-center">{config.name}</h3>
        <div className="flex items-center gap-2 mt-1 mb-4">
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {config.protocol}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            پورت {config.port}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        <p className="text-[11px] text-slate-400 mt-3 text-center">
          این بارکد را با برنامه v2rayNG, Streisand, Nekoray یا Sing-box اسکن کنید
        </p>

        {/* Action buttons */}
        <div className="w-full mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>کپی لینک کانفیگ</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>دانلود عکس QR</span>
          </button>
        </div>

        <div className="w-full mt-3">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 truncate dir-ltr text-left">
            {config.uri}
          </div>
        </div>
      </div>
    </div>
  );
};
