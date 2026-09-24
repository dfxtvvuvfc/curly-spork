import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Activity,
  Server,
  ArrowUpRight,
  PlusCircle,
  Share2,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Wifi,
  Globe,
  Radio,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  Cloud,
} from 'lucide-react';
import { ProxyConfig, CleanIpItem } from '../types/config';
import { generateUUID, generateProxyUri } from '../utils/configGenerators';
import { INITIAL_CLEAN_IPS, testSingleIpLatency } from '../utils/cleanIps';
import { NetworkChart } from './NetworkChart';

interface DashboardProps {
  configs: ProxyConfig[];
  onAddConfigs: (newConfigs: ProxyConfig[]) => void;
  onOpenQR: (config: ProxyConfig) => void;
  onOpenSubscription: () => void;
  onOpenWorkerModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  configs,
  onAddConfigs,
  onOpenQR,
  onOpenSubscription,
  onOpenWorkerModal,
  setActiveTab,
}) => {
  const [quickDomain, setQuickDomain] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingPack, setIsGeneratingPack] = useState(false);
  const [packSuccess, setPackSuccess] = useState(false);

  // Quick 1-click batch generator for all operators with ultra-low ping clean IPs & early data
  const handleGenerateFullPack = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = quickDomain.trim() || 'worker-sub.cloudflare.workers.dev';
    setIsGeneratingPack(true);

    setTimeout(() => {
      const generatedUUID = generateUUID();
      const newConfigs: ProxyConfig[] = [
        {
          id: 'cfg-' + Date.now() + '-1',
          name: '🚀 همراه اول | MCI Low-Ping VLESS',
          protocol: 'vless',
          server: '104.16.148.86',
          port: 443,
          uuid: generatedUUID,
          transport: 'ws',
          path: '/?ed=2048',
          host: domain,
          sni: domain,
          security: 'tls',
          operator: 'mci',
          createdAt: Date.now(),
          uri: '',
        },
        {
          id: 'cfg-' + Date.now() + '-2',
          name: '⚡ ایرانسل | MTN Ultra Low-Ping VLESS',
          protocol: 'vless',
          server: '104.24.111.208',
          port: 443,
          uuid: generatedUUID,
          transport: 'ws',
          path: '/?ed=2048',
          host: domain,
          sni: domain,
          security: 'tls',
          operator: 'irancell',
          createdAt: Date.now() + 1,
          uri: '',
        },
        {
          id: 'cfg-' + Date.now() + '-3',
          name: '🌐 رایتل | Rightel Fast VLESS',
          protocol: 'vless',
          server: '104.16.208.10',
          port: 443,
          uuid: generatedUUID,
          transport: 'ws',
          path: '/?ed=2048',
          host: domain,
          sni: domain,
          security: 'tls',
          operator: 'rightel',
          createdAt: Date.now() + 2,
          uri: '',
        },
        {
          id: 'cfg-' + Date.now() + '-4',
          name: '📶 مخابرات و شاتل | Fixed Telecom VLESS',
          protocol: 'vless',
          server: '104.21.35.105',
          port: 443,
          uuid: generatedUUID,
          transport: 'ws',
          path: '/?ed=2048',
          host: domain,
          sni: domain,
          security: 'tls',
          operator: 'telecom',
          createdAt: Date.now() + 3,
          uri: '',
        },
        {
          id: 'cfg-' + Date.now() + '-5',
          name: '🛡️ همراه اول | VMess Low-Ping CDN',
          protocol: 'vmess',
          server: '172.67.182.203',
          port: 443,
          uuid: generatedUUID,
          transport: 'ws',
          path: '/vmess-ws?ed=2048',
          host: domain,
          sni: domain,
          security: 'tls',
          operator: 'mci',
          createdAt: Date.now() + 4,
          uri: '',
        },
        {
          id: 'cfg-' + Date.now() + '-6',
          name: '🔥 ایرانسل | Trojan Secure Fast',
          protocol: 'trojan',
          server: '162.159.193.10',
          port: 443,
          uuid: generatedUUID,
          transport: 'ws',
          path: '/trojan-ws',
          host: domain,
          sni: domain,
          security: 'tls',
          operator: 'irancell',
          createdAt: Date.now() + 5,
          uri: '',
        },
      ];

      // Calculate URIs
      const calculated = newConfigs.map((c) => ({
        ...c,
        uri: generateProxyUri(c),
      }));

      onAddConfigs(calculated);
      setIsGeneratingPack(false);
      setPackSuccess(true);
      setTimeout(() => setPackSuccess(false), 3000);
    }, 250);
  };

  const handleCopyUri = (id: string, uri: string) => {
    navigator.clipboard.writeText(uri);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">کانفیگ‌های فعال</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">{configs.length}</div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1 font-medium">
            <span>آماده اتصال با Early Data</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">ورکر کلودفلر</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">VLESS WS</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span>پشتیبانی از _worker.js</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">آی‌پی‌های تمیز کلودفلر</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">15 سرور</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>پینگ بهینه ایران</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 backdrop-blur-md relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">وضعیت پینگ شبکه</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">~115ms</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>کمترین تأخیر با Early Data</span>
          </div>
        </div>
      </div>

      {/* 1-Click Multi-Config Generator Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-cyan-500/30 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 flex-wrap">
                  <span>تولید هوشمند پک کانفیگ کامل ورکر کلودفلر</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black">
                    پینگ پایین
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  با وارد کردن دامنه یا ورکر، ۶ کانفیگ اختصاصی با Early Data و آی‌پی تمیز کلودفلر بسازید.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={onOpenWorkerModal}
                className="text-xs px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
              >
                <Cloud className="w-4 h-4" />
                <span>کد ورکر کلودفلر (_worker.js)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>ساخت دستی</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleGenerateFullPack} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                دامنه اختصاصی یا آدرس کلودفلر ورکر (SNI / Host):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={quickDomain}
                  onChange={(e) => setQuickDomain(e.target.value)}
                  placeholder="مثال: my-worker.example.workers.dev یا sub.domain.com"
                  className="flex-1 bg-slate-950/90 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono dir-ltr text-left"
                />
                <button
                  type="submit"
                  disabled={isGeneratingPack}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingPack ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>تولید پک ۶ کانفیگ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {packSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  ۶ کانفیگ اختصاصی با موفقیت ساخته شد و با پینگ بهینه به لیست کانفیگ‌ها اضافه گردید!
                </span>
              </div>
            )}
          </form>

          {/* Quick specs pill */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="text-slate-500">ویژگی‌ها:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300">
              VLESS همراه اول (104.16.148.86)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300">
              VLESS ایرانسل (104.24.111.208)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300">
              VLESS رایتل (104.16.208.10)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300">
              VLESS مخابرات (104.21.35.105)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-amber-300">
              پشتیبانی از Early Data (?ed=2048)
            </span>
          </div>
        </div>
      </div>

      {/* LIVE USAGE CHART RIGHT IN THE CENTER (Explicit user request) */}
      <div className="w-full">
        <NetworkChart />
      </div>

      {/* Operators Health & Clean IPs Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Operators Status */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">وضعیت اپراتورهای شبکه</h3>
            </div>
            <button
              onClick={() => setActiveTab('builder')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              تنظیمات کانفیگ
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'همراه اول (MCI)', ip: '104.16.148.86', ping: '132ms', status: 'عالی', color: 'emerald' },
              { name: 'ایرانسل (MTN)', ip: '104.24.111.208', ping: '124ms', status: 'عالی', color: 'emerald' },
              { name: 'رایتل (Rightel)', ip: '104.16.208.10', ping: '145ms', status: 'خوب', color: 'cyan' },
              { name: 'مخابرات / شاتل', ip: '104.21.35.105', ping: '110ms', status: 'عالی', color: 'emerald' },
            ].map((op, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{op.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{op.ip}</div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-emerald-400 font-mono">{op.ping}</div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {op.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Configs & Actions */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">کانفیگ‌های اخیر پنل</h3>
              <span className="text-xs text-slate-400 font-mono">({configs.length})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSubscription}
                className="text-xs px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>لینک ساب</span>
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                مشاهده همه
              </button>
            </div>
          </div>

          {configs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
              <Server className="w-10 h-10 text-slate-600 mb-2" />
              <div className="text-sm font-bold text-slate-300">هنوز کانفیگی ثبت نشده است!</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                از بخش بالا دکمه «تولید پک ۶ کانفیگ» را بزنید یا به تب «ساخت کانفیگ جدید» بروید.
              </p>
              <button
                onClick={() => setActiveTab('builder')}
                className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ساخت اولین کانفیگ</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[290px] pr-1">
              {configs.slice(0, 5).map((cfg) => {
                const isCopied = copiedId === cfg.id;
                return (
                  <div
                    key={cfg.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 uppercase font-mono text-xs font-black">
                        {cfg.protocol.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{cfg.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate flex items-center gap-1.5 mt-0.5">
                          <span>{cfg.server}</span>
                          <span>:</span>
                          <span>{cfg.port}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-cyan-400 uppercase">{cfg.transport}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyUri(cfg.id, cfg.uri)}
                        className={`p-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                        title="کپی لینک مستقیم کانفیگ"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isCopied ? 'کپی شد' : 'کپی'}</span>
                      </button>

                      <button
                        onClick={() => onOpenQR(cfg)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        title="مشاهده بارکد QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
