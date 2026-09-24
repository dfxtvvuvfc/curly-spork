import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  Download,
  Layers,
  FileJson,
  FileCode,
  CheckCircle2,
  Share2,
  QrCode,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { ProxyConfig } from '../types/config';
import { safeBtoa, generateSingboxConfig, generateClashYaml } from '../utils/configGenerators';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  configs: ProxyConfig[];
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, configs }) => {
  const [activeTab, setActiveTab] = useState<'sub' | 'qr' | 'singbox' | 'clash'>('sub');
  const [copied, setCopied] = useState(false);
  const subQrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Raw URIs & Base64
  const rawSubContent = configs.map((c) => c.uri).join('\n');
  const base64SubContent = safeBtoa(rawSubContent);

  const singboxJson = generateSingboxConfig(configs);
  const clashYaml = generateClashYaml(configs);

  const currentContent =
    activeTab === 'sub' ? base64SubContent : activeTab === 'singbox' ? singboxJson : clashYaml;

  useEffect(() => {
    if (activeTab === 'qr' && subQrCanvasRef.current && base64SubContent) {
      QRCode.toCanvas(
        subQrCanvasRef.current,
        // If there's a primary config or sub string
        configs[0]?.uri || base64SubContent,
        {
          width: 200,
          margin: 1.5,
          color: {
            dark: '#020617',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [activeTab, base64SubContent, configs]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'subscription.txt';
    let mime = 'text/plain';

    if (activeTab === 'singbox') {
      filename = 'singbox.json';
      mime = 'application/json';
    } else if (activeTab === 'clash') {
      filename = 'clash.yaml';
      mime = 'text/yaml';
    }

    const blob = new Blob([currentContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  خروجی و لینک اشتراک (Subscription)
                </h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  نسخه ۱.۰
                </span>
              </div>
              <p className="text-xs text-slate-400">
                خروجی مستقیم برای کلاینت‌های گوشی و ویندوز (v2rayNG, Streisand, Sing-box, Clash)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 mt-3 sm:mt-4 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sub')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sub'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>متن ساب (Base64)</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>اسکن با گوشی</span>
          </button>

          <button
            onClick={() => setActiveTab('singbox')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'singbox'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>فایل Sing-box</span>
          </button>

          <button
            onClick={() => setActiveTab('clash')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'clash'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>فایل Clash</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="my-3 flex-1 overflow-hidden flex flex-col">
          {activeTab === 'qr' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="bg-white p-2.5 rounded-2xl shadow-xl">
                <canvas ref={subQrCanvasRef} className="rounded-lg" />
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                دوربین یا اسکنر برنامه v2rayNG / Streisand گوشی را باز کنید و این بارکد را اسکن کنید.
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                <span>
                  {activeTab === 'sub'
                    ? `شامل ${configs.length} کانفیگ کدگذاری شده (Base64) با پینگ بهینه`
                    : activeTab === 'singbox'
                    ? 'تنظیمات آماده با قوانین دور زدن فیلترینگ و مسدودسازی تبلیغات'
                    : 'پراکسی گروپ‌های خودکار و دستی آماده برای کلش ورج و متا'}
                </span>
              </div>
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 overflow-y-auto max-h-[260px]">
                <pre className="text-xs font-mono text-cyan-200/90 whitespace-pre-wrap break-all dir-ltr text-left">
                  {currentContent}
                </pre>
              </div>
            </>
          )}
        </div>

        {/* Quick client import buttons */}
        <div className="mb-3 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>ایمپورت سریع با یک کلیک در برنامه‌ها:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                const subUrl = window.location.origin + '/sub';
                window.location.href = `v2rayng://install-config?url=${encodeURIComponent(subUrl)}`;
              }}
              className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>v2rayNG</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                const subUrl = window.location.origin + '/sub';
                window.location.href = `streisand://import/${encodeURIComponent(subUrl)}`;
              }}
              className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Streisand</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                const subUrl = window.location.origin + '/sub';
                window.location.href = `sing-box://import-remote-profile?url=${encodeURIComponent(subUrl)}#Cloudflare`;
              }}
              className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Sing-box</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                const subUrl = window.location.origin + '/sub';
                window.location.href = `clash://install-config?url=${encodeURIComponent(subUrl)}&name=Cloudflare`;
              }}
              className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Clash Meta</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>بهینه‌سازی شده برای گوشی‌های موبایل (Android, iOS) و ویندوز</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>کپی محتوا</span>
                </>
              )}
            </button>

            {activeTab !== 'qr' && (
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>دانلود فایل</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
