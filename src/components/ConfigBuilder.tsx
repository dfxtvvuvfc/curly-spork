import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Wand2,
  Copy,
  Check,
  QrCode,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Server,
  Layers,
  Radio,
  Sliders,
  CheckCircle2,
  Zap,
  Globe,
  Share2,
  Cpu,
  Wifi,
  Terminal,
} from 'lucide-react';
import { ProxyConfig, ProtocolType, TransportType, SecurityType, OperatorType } from '../types/config';
import { generateUUID, generateProxyUri } from '../utils/configGenerators';

interface ConfigBuilderProps {
  onSaveConfig: (config: ProxyConfig) => void;
  onSaveBatchConfigs: (configs: ProxyConfig[]) => void;
  onOpenQR: (config: ProxyConfig) => void;
}

export const ConfigBuilder: React.FC<ConfigBuilderProps> = ({
  onSaveConfig,
  onSaveBatchConfigs,
  onOpenQR,
}) => {
  // Core Worker Parameters (Exact settings from Cloudflare Worker config generator)
  const [uuid, setUuid] = useState(generateUUID());
  const [host, setHost] = useState(() => localStorage.getItem('kfg_default_host') || '');
  const [proxyIp, setProxyIp] = useState(() => localStorage.getItem('kfg_default_proxy_ip') || 'cdn.jsdelivr.net');

  // Operator Clean IPs / Domains (Exact operator inputs)
  const [mciIp, setMciIp] = useState('104.16.148.86');
  const [mtnIp, setMtnIp] = useState('104.24.111.208');
  const [rightelIp, setRightelIp] = useState('104.16.208.10');
  const [telecomIp, setTelecomIp] = useState('104.21.35.105');

  // Network & Port Settings
  const [protocol, setProtocol] = useState<ProtocolType>('vless');
  const [port, setPort] = useState<number>(() => Number(localStorage.getItem('kfg_default_port')) || 443);
  const [security, setSecurity] = useState<SecurityType>('tls');
  const [transport, setTransport] = useState<TransportType>('ws');
  const [path, setPath] = useState('/?ed=2048');
  const [enableEarlyData, setEnableEarlyData] = useState(() => localStorage.getItem('kfg_auto_early_data') !== 'false');
  const [fp, setFp] = useState(() => localStorage.getItem('kfg_utls_fp') || 'chrome');

  // Fragment Settings (Anti-Filtering)
  const [enableFragment, setEnableFragment] = useState(() => localStorage.getItem('kfg_fragment_enabled') === 'true');
  const [fragmentPackets, setFragmentPackets] = useState(() => localStorage.getItem('kfg_frag_packets') || 'tlshello');
  const [fragmentLength, setFragmentLength] = useState(() => localStorage.getItem('kfg_frag_length') || '100-200');
  const [fragmentInterval, setFragmentInterval] = useState(() => localStorage.getItem('kfg_frag_interval') || '10-20');

  // Single Custom Config Name
  const [customName, setCustomName] = useState('کانفیگ ورکر کلودفلر');

  // UI state
  const [copied, setCopied] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync Early Data with path
  useEffect(() => {
    if (enableEarlyData) {
      if (!path.includes('ed=')) {
        setPath(path === '/' ? '/?ed=2048' : `${path}${path.includes('?') ? '&' : '?'}ed=2048`);
      }
    } else {
      setPath(path.replace(/(\?|&)ed=2048/, ''));
    }
  }, [enableEarlyData]);

  // Compute live active single config (previewing MCI or main)
  const liveConfig: Omit<ProxyConfig, 'id' | 'createdAt'> = {
    name: customName.trim() || 'Worker-Node',
    protocol,
    server: mciIp.trim() || '104.16.148.86',
    port: Number(port) || 443,
    uuid: uuid.trim() || generateUUID(),
    transport,
    path: path.trim() || '/',
    host: host.trim() || 'worker.example.workers.dev',
    sni: host.trim() || 'worker.example.workers.dev',
    security,
    operator: 'mci',
    proxyIp: proxyIp.trim() || undefined,
    earlyData: enableEarlyData,
    fp,
    fragment: enableFragment
      ? {
          enabled: true,
          packets: fragmentPackets,
          length: fragmentLength,
          interval: fragmentInterval,
        }
      : undefined,
    uri: '',
  };

  const currentUri = generateProxyUri(liveConfig);

  // Generate live QR Code
  useEffect(() => {
    if (!previewCanvasRef.current || !currentUri) return;
    QRCode.toCanvas(
      previewCanvasRef.current,
      currentUri,
      {
        width: 170,
        margin: 1.5,
        color: {
          dark: '#020617',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [currentUri]);

  // One-click batch config generator for all operators with these exact parameters
  const handleGenerateAllOperatorConfigs = () => {
    const domain = host.trim() || 'worker.example.workers.dev';
    const cleanPath = path.trim() || '/?ed=2048';

    const operatorsList: { op: OperatorType; name: string; ip: string }[] = [
      { op: 'mci', name: '🚀 همراه اول | MCI Low-Ping', ip: mciIp.trim() || '104.16.148.86' },
      { op: 'irancell', name: '⚡ ایرانسل | MTN Ultra Fast', ip: mtnIp.trim() || '104.24.111.208' },
      { op: 'rightel', name: '🌐 رایتل | Rightel Clean', ip: rightelIp.trim() || '104.16.208.10' },
      { op: 'telecom', name: '📶 مخابرات و ثابت | Telecom', ip: telecomIp.trim() || '104.21.35.105' },
    ];

    const generatedBatch: ProxyConfig[] = operatorsList.map((item, idx) => {
      const cfg: Omit<ProxyConfig, 'id' | 'createdAt' | 'uri'> = {
        name: item.name,
        protocol: 'vless',
        server: item.ip,
        port: Number(port) || 443,
        uuid: uuid.trim() || generateUUID(),
        transport: 'ws',
        path: cleanPath,
        host: domain,
        sni: domain,
        security: security,
        operator: item.op,
        proxyIp: proxyIp.trim() || undefined,
        earlyData: enableEarlyData,
        fp: fp,
        fragment: enableFragment
          ? {
              enabled: true,
              packets: fragmentPackets,
              length: fragmentLength,
              interval: fragmentInterval,
            }
          : undefined,
      };

      return {
        ...cfg,
        id: 'cfg-' + Date.now() + '-' + idx,
        createdAt: Date.now() + idx,
        uri: generateProxyUri(cfg),
      };
    });

    onSaveBatchConfigs(generatedBatch);
    setBatchSuccess(true);
    setTimeout(() => setBatchSuccess(false), 2500);
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(currentUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSingle = () => {
    const single: ProxyConfig = {
      ...liveConfig,
      id: 'cfg-' + Date.now(),
      createdAt: Date.now(),
      uri: currentUri,
    };
    onSaveConfig(single);
    setBatchSuccess(true);
    setTimeout(() => setBatchSuccess(false), 2000);
  };

  const subscriptionUrl = host.trim()
    ? `https://${host.trim().replace(/^https?:\/\//, '')}/sub`
    : 'https://your-worker.workers.dev/sub';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Wand2 className="w-5 h-5 text-cyan-400" />
            <span>تنظیمات ساخت کانفیگ ورکر کلودفلر</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            پیکربندی پارامترهای User ID، دامنه ورکر، Proxy IP، پورت‌ها، Early Data و فرگمنت
          </p>
        </div>

        {/* 1-Click Generate All Operators Button */}
        <button
          type="button"
          onClick={handleGenerateAllOperatorConfigs}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Zap className="w-4 h-4" />
          <span>تولید خودکار تمام اپراتورها (۴ کانفیگ)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Core Worker Credentials Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80 text-xs font-bold text-cyan-400">
              <Terminal className="w-4 h-4" />
              <span>مشخصات ورکر و کاربر (Worker Credentials)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>شناسه کاربر (User ID / UUID):</span>
                  <button
                    type="button"
                    onClick={() => setUuid(generateUUID())}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>تولید رندوم</span>
                  </button>
                </label>
                <input
                  type="text"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  دامنه ورکر کلودفلر (Host / SNI):
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="my-worker.example.workers.dev"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  پروکسی آی‌پی (Proxy IP):
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={proxyIp}
                    onChange={(e) => setProxyIp(e.target.value)}
                    placeholder="cdn.jsdelivr.net یا IP..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono dir-ltr text-left"
                  />
                  <select
                    onChange={(e) => setProxyIp(e.target.value)}
                    value={proxyIp}
                    className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-2 cursor-pointer focus:outline-none"
                  >
                    <option value="cdn.jsdelivr.net">jsDelivr</option>
                    <option value="cloudflare.com">Cloudflare</option>
                    <option value="icook.hk">icook.hk</option>
                    <option value="104.16.148.86">Clean IP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Operator Clean IPs Settings Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80 text-xs font-bold text-emerald-400">
              <Wifi className="w-4 h-4" />
              <span>آی‌پی یا دامنه تمیز اپراتورها (Clean IPs)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  همراه اول (MCI):
                </label>
                <input
                  type="text"
                  value={mciIp}
                  onChange={(e) => setMciIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ایرانسل (MTN):
                </label>
                <input
                  type="text"
                  value={mtnIp}
                  onChange={(e) => setMtnIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  رایتل (Rightel):
                </label>
                <input
                  type="text"
                  value={rightelIp}
                  onChange={(e) => setRightelIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  مخابرات و وای‌فای (Telecom/ADSL):
                </label>
                <input
                  type="text"
                  value={telecomIp}
                  onChange={(e) => setTelecomIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono dir-ltr text-left"
                />
              </div>
            </div>
          </div>

          {/* 3. Port, Transport & Early Data Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80 text-xs font-bold text-amber-400">
              <Cpu className="w-4 h-4" />
              <span>پورت، وب‌سوکت و Early Data</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">پورت سرور (Port):</label>
                  <span className="text-[11px] text-slate-400">
                    {security === 'tls' ? 'پورت‌های امن TLS' : 'پورت‌های غیر TLS'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono dir-ltr text-left"
                  />
                  <div className="flex-1 flex flex-wrap gap-1">
                    {(security === 'tls'
                      ? [443, 8443, 2053, 2083, 2087, 2096]
                      : [80, 8080, 8880, 2052, 2082, 2086]
                    ).map((pVal) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => setPort(pVal)}
                        className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          port === pVal
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pVal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    امنیت ارتباط (Security):
                  </label>
                  <select
                    value={security}
                    onChange={(e) => {
                      const sec = e.target.value as SecurityType;
                      setSecurity(sec);
                      if (sec === 'none' && port === 443) setPort(80);
                      if (sec === 'tls' && port === 80) setPort(443);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    <option value="tls">TLS (توصیه شده)</option>
                    <option value="none">None (پورت‌های غیر TLS مانند 80)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    نوع انتقال (Transport):
                  </label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value as TransportType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    <option value="ws">WebSocket (استاندارد ورکر)</option>
                    <option value="grpc">gRPC</option>
                  </select>
                </div>
              </div>

              {/* Path & Early Data */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    مسیر وب‌سوکت (Path):
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableEarlyData}
                      onChange={(e) => setEnableEarlyData(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                    />
                    <span className="text-[11px] text-amber-400 font-bold">
                      Early Data (?ed=2048) پینگ پایین
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono dir-ltr text-left"
                />
              </div>
            </div>
          </div>

          {/* 4. Fragment Settings Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>تنظیمات فرگمنت TLS (ضد فیلترینگ SNI)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableFragment}
                  onChange={(e) => setEnableFragment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {enableFragment && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Packets:</label>
                  <select
                    value={fragmentPackets}
                    onChange={(e) => setFragmentPackets(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="tlshello">tlshello</option>
                    <option value="1-1">1-1</option>
                    <option value="1-2">1-2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Length:</label>
                  <input
                    type="text"
                    value={fragmentLength}
                    onChange={(e) => setFragmentLength(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Interval (ms):</label>
                  <input
                    type="text"
                    value={fragmentInterval}
                    onChange={(e) => setFragmentInterval(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-mono text-center"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Output & QR Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 backdrop-blur-md flex flex-col items-center shadow-xl">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>پیش‌نمایش زنده QR و کانفیگ</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {protocol}
              </span>
            </div>

            {/* QR Canvas */}
            <div className="my-4 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
              <canvas ref={previewCanvasRef} className="rounded-lg" />
            </div>

            <div className="w-full text-center">
              <div className="text-xs font-bold text-white truncate px-2">{customName}</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {mciIp}:{port} • {enableEarlyData ? 'EarlyData: On' : 'EarlyData: Off'}
              </div>
            </div>

            {/* Direct URI Preview */}
            <div className="w-full mt-4">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                <span>لینک خام (URI):</span>
                <span className="text-[10px] text-slate-500">آماده کپی و اسکن</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px] font-mono text-cyan-200/90 break-all dir-ltr text-left max-h-[90px] overflow-y-auto">
                {currentUri}
              </div>
            </div>

            {/* Direct Subscription URL */}
            <div className="w-full mt-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs">
              <div className="text-[10px] text-slate-400 mb-1">آدرس لینک اشتراک خودکار (ساب):</div>
              <div className="font-mono text-amber-300 truncate dir-ltr text-left">{subscriptionUrl}</div>
            </div>

            {/* Actions */}
            <div className="w-full mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyUri}
                className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
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
                type="button"
                onClick={handleSaveSingle}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تک کانفیگ</span>
              </button>
            </div>

            <div className="w-full mt-2">
              <button
                type="button"
                onClick={handleGenerateAllOperatorConfigs}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Zap className="w-4 h-4" />
                <span>ثبت ۴ کانفیگ اپراتورها در پنل</span>
              </button>
            </div>

            {batchSuccess && (
              <div className="w-full mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>کانفیگ‌ها با موفقیت در لیست پنل ثبت شدند!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
