import React, { useState } from 'react';
import {
  Search,
  Filter,
  Copy,
  Check,
  QrCode,
  Trash2,
  Share2,
  Server,
  PlusCircle,
  ExternalLink,
  Layers,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';
import { ProxyConfig, ProtocolType, OperatorType } from '../types/config';

interface ConfigListProps {
  configs: ProxyConfig[];
  onDeleteConfig: (id: string) => void;
  onClearAll: () => void;
  onOpenQR: (config: ProxyConfig) => void;
  onOpenSubscription: () => void;
  setActiveTab: (tab: string) => void;
}

export const ConfigList: React.FC<ConfigListProps> = ({
  configs,
  onDeleteConfig,
  onClearAll,
  onOpenQR,
  onOpenSubscription,
  setActiveTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Filtering
  const filteredConfigs = configs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.port.toString().includes(searchTerm);

    const matchesProtocol = selectedProtocol === 'all' || c.protocol === selectedProtocol;
    const matchesOperator = selectedOperator === 'all' || c.operator === selectedOperator;

    return matchesSearch && matchesProtocol && matchesOperator;
  });

  const handleCopySingle = (id: string, uri: string) => {
    navigator.clipboard.writeText(uri);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyAll = () => {
    const allText = filteredConfigs.map((c) => c.uri).join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getOperatorLabel = (op: OperatorType) => {
    switch (op) {
      case 'mci':
        return { label: 'همراه اول', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' };
      case 'irancell':
        return { label: 'ایرانسل', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' };
      case 'rightel':
        return { label: 'رایتل', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' };
      case 'telecom':
        return { label: 'مخابرات / ثابت', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' };
      default:
        return { label: 'عمومی', color: 'border-slate-500/30 text-slate-400 bg-slate-500/10' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Batch Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>لیست کانفیگ‌های ذخیره شده</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
              {filteredConfigs.length} از {configs.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            مشاهده، کپی تکی، کپی گروهی و اسکن QR تمام کانفیگ‌های ساخته شده
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {configs.length > 0 && (
            <>
              <button
                onClick={handleCopyAll}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>همه کپی شدند!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی همه ({filteredConfigs.length})</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenSubscription}
                className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>خروجی ساب‌اسکریپشن</span>
              </button>

              <button
                onClick={onClearAll}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="پاکسازی تمام کانفیگ‌ها"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف همه</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('builder')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>ساخت کانفیگ جدید</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام، پورت، آی‌پی..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Protocol filter */}
        <div className="flex items-center gap-1">
          <select
            value={selectedProtocol}
            onChange={(e) => setSelectedProtocol(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">همه پروتکل‌ها</option>
            <option value="vless">فقط VLESS</option>
            <option value="vmess">فقط VMess</option>
            <option value="trojan">فقط Trojan</option>
            <option value="shadowsocks">فقط Shadowsocks</option>
          </select>
        </div>

        {/* Operator filter */}
        <div className="flex items-center gap-1">
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">همه اپراتورها</option>
            <option value="mci">همراه اول (MCI)</option>
            <option value="irancell">ایرانسل (MTN)</option>
            <option value="rightel">رایتل (Rightel)</option>
            <option value="telecom">مخابرات و شاتل</option>
          </select>
        </div>
      </div>

      {/* Config Cards Grid */}
      {filteredConfigs.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <Server className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-300">کانفیگی یافت نشد!</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            هیچ کانفیگی مطابق فیلترهای انتخابی شما در پنل وجود ندارد یا هنوز کانفیگی نساخته‌اید.
          </p>
          <button
            onClick={() => setActiveTab('builder')}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ساخت کانفیگ جدید</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConfigs.map((cfg) => {
            const opInfo = getOperatorLabel(cfg.operator);
            const isCopied = copiedId === cfg.id;

            return (
              <div
                key={cfg.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 backdrop-blur-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {cfg.protocol}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${opInfo.color}`}
                      >
                        {opInfo.label}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      پورت {cfg.port} • {cfg.transport.toUpperCase()}
                    </div>
                  </div>

                  {/* Name & Details */}
                  <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <span>{cfg.name}</span>
                  </h4>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1 dir-ltr text-left">
                    <div className="truncate">
                      <span className="text-slate-600">server: </span>
                      <span className="text-slate-200">{cfg.server}</span>
                    </div>
                    {cfg.sni && (
                      <div className="truncate">
                        <span className="text-slate-600">sni: </span>
                        <span className="text-cyan-400">{cfg.sni}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopySingle(cfg.id, cfg.uri)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/10'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>کپی لینک</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenQR(cfg)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="نمایش کد QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteConfig(cfg.id)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="حذف کانفیگ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
