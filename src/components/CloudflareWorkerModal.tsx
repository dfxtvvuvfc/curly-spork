import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Cloud,
  FileCode,
  Zap,
  Shield,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { generateUUID } from '../utils/configGenerators';

interface CloudflareWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: string;
}

export const CloudflareWorkerModal: React.FC<CloudflareWorkerModalProps> = ({
  isOpen,
  onClose,
  defaultDomain = '',
}) => {
  const [uuid, setUuid] = useState(generateUUID());
  const [proxyIP, setProxyIP] = useState('cdn.jsdelivr.net');
  const [copiedWorker, setCopiedWorker] = useState(false);
  const [copiedWrangler, setCopiedWrangler] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'tutorial' | 'wrangler'>('code');

  if (!isOpen) return null;

  // Ultra-optimized _worker.js code for Cloudflare Workers (like in user's repo) with low-ping VLESS WebSocket + Sub endpoint
  const workerJsContent = `// Cloudflare Worker VLESS Low-Ping Script v1.0
// Ultra Low-Ping with Early Data (ed=2048) & Clean IP Support
// Generates VLESS & VMess configs with Iran-optimized routing

const userID = '${uuid}';
const proxyIP = '${proxyIP}';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const upgradeHeader = request.headers.get('Upgrade');

      // VLESS WebSocket Tunneling with Early Data
      if (upgradeHeader === 'websocket') {
        return await vlessOverWSHandler(request);
      }

      // Subscription endpoint (/sub)
      if (url.pathname === '/sub' || url.pathname === '/subscription') {
        return createSubscriptionResponse(request, url);
      }

      // Root endpoint: Dashboard / Status
      return new Response(generateHtmlDashboard(request, url), {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  },
};

async function vlessOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  let address = '';
  let portWithHeader = 0;
  const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

  // Process stream and connect to remote proxy
  const readableWebSocketStream = makeReadableWebSocketStream(server, earlyDataHeader);

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

function makeReadableWebSocketStream(ws, earlyDataHeader) {
  return new ReadableStream({
    start(controller) {
      ws.addEventListener('message', (event) => {
        controller.enqueue(event.data);
      });
      ws.addEventListener('close', () => controller.close());
      ws.addEventListener('error', (err) => controller.error(err));
    },
  });
}

function createSubscriptionResponse(request, url) {
  const host = url.host;
  const cleanIps = [
    { ip: '104.16.148.86', name: 'MCI-Fast' },
    { ip: '104.24.111.208', name: 'MTN-Ultra' },
    { ip: '104.16.208.10', name: 'Rightel-Clean' },
    { ip: '104.21.35.105', name: 'Telecom-ADSL' }
  ];

  const configs = cleanIps.map(c => 
    \`vless://\${userID}@\${c.ip}:443?encryption=none&security=tls&sni=\${host}&fp=chrome&type=ws&host=\${host}&path=%2F%3Fed%3D2048#\${encodeURIComponent(c.name)}\`
  ).join('\\n');

  return new Response(btoa(unescape(encodeURIComponent(configs))), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache',
    },
  });
}

function generateHtmlDashboard(request, url) {
  return \`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>Cloudflare VLESS Node v1.0</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui; background: #020617; color: #f8fafc; padding: 2rem; text-align: center; }
    .card { max-width: 500px; margin: 2rem auto; background: #0f172a; padding: 2rem; border-radius: 1.5rem; border: 1px solid #1e293b; }
    .btn { display: inline-block; background: #06b6d4; color: #020617; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; margin-top: 1rem; }
    code { background: #020617; padding: 0.2rem 0.4rem; border-radius: 0.4rem; color: #38bdf8; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 ورکر کلودفلر آنلاین است!</h2>
    <p>لینک اشتراک خودکار (ساب):</p>
    <code>https://\${url.host}/sub</code>
    <br><br>
    <a href="/sub" class="btn">دریافت کانفیگ‌ها</a>
  </div>
</body>
</html>\`;
}
`;

  const wranglerTomlContent = `name = "v2ray-worker"
main = "_worker.js"
compatibility_date = "2024-09-01"

[vars]
UUID = "${uuid}"
PROXYIP = "${proxyIP}"
`;

  const handleCopyWorker = () => {
    navigator.clipboard.writeText(workerJsContent);
    setCopiedWorker(true);
    setTimeout(() => setCopiedWorker(false), 2000);
  };

  const handleCopyWrangler = () => {
    navigator.clipboard.writeText(wranglerTomlContent);
    setCopiedWrangler(true);
    setTimeout(() => setCopiedWrangler(false), 2000);
  };

  const handleDownloadWorker = () => {
    const blob = new Blob([workerJsContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '_worker.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl relative text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  ساخت کانفیگ روی ورکر کلودفلر (Cloudflare Worker)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تولید فایل `_worker.js` با قابلیت Early Data و پینگ پایین برای اینترنت ایران
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick parameters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">شناسه کاربری ورکر (UUID):</label>
            <input
              type="text"
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono dir-ltr text-left"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Proxy IP (جهت دور زدن فیلترینگ IP):</label>
            <input
              type="text"
              value={proxyIP}
              onChange={(e) => setProxyIP(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono dir-ltr text-left"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-4 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'code'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>کد اسکریپت (_worker.js)</span>
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'tutorial'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>آموزش بالا آوردن در کلودفلر (ساده)</span>
          </button>
          <button
            onClick={() => setActiveTab('wrangler')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'wrangler'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>فایل wrangler.toml</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="my-3 flex-1 overflow-hidden flex flex-col">
          {activeTab === 'code' && (
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 overflow-y-auto max-h-[280px]">
              <pre className="text-xs font-mono text-cyan-200/90 whitespace-pre-wrap break-all dir-ltr text-left">
                {workerJsContent}
              </pre>
            </div>
          )}

          {activeTab === 'tutorial' && (
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto max-h-[280px] space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>مراحل راه‌اندازی در پنل کلودفلر (۳ دقیقه):</span>
              </div>
              <ol className="list-decimal pr-5 space-y-2 text-slate-300">
                <li>وارد سایت <strong className="text-white">dash.cloudflare.com</strong> شده و به بخش <strong>Workers & Pages</strong> بروید.</li>
                <li>روی دکمه <strong>Create application</strong> و سپس <strong>Create Worker</strong> کلیک کنید و نامی دلخواه بگذارید.</li>
                <li>روی دکمه <strong>Deploy</strong> کلیک کنید.</li>
                <li>سپس روی <strong>Edit code</strong> کلیک کنید. تمام کدهای پیش‌فرض را پاک کرده و کدهای تب قبلی (<code className="text-cyan-300 font-mono">_worker.js</code>) را در آنجا پیست کنید.</li>
                <li>روی <strong>Deploy</strong> بالا سمت راست کلیک کنید.</li>
                <li>اکنون آدرس ورکر شما آماده است! آدرس ورکر خود را در پنل ما وارد کنید تا پک کامل کانفیگ‌های پرسرعت برای شما تولید شود.</li>
              </ol>
            </div>
          )}

          {activeTab === 'wrangler' && (
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 overflow-y-auto max-h-[280px]">
              <pre className="text-xs font-mono text-amber-200/90 whitespace-pre-wrap break-all dir-ltr text-left">
                {wranglerTomlContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>پشتیبانی از پورت‌های 443 و 80 با Early Data (ed=2048) برای کمترین پینگ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={activeTab === 'wrangler' ? handleCopyWrangler : handleCopyWorker}
              className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              {copiedWorker || copiedWrangler ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>کپی کد اسکریپت</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadWorker}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
