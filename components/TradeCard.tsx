import React, { useState } from 'react';
import { MarketAnalysis } from '../types';
import { Target, ShieldAlert, TrendingUp, AlertTriangle, Copy, Check, Briefcase, ListChecks } from 'lucide-react';

interface TradeCardProps {
  data: MarketAnalysis;
}

export const TradeCard: React.FC<TradeCardProps> = ({ data }) => {
  const { setup, session } = data;
  const isBuy = setup.type === 'BUY';
  const isNeutral = setup.type === 'NEUTRAL';
  const [copied, setCopied] = useState(false);
  
  const mainColor = isNeutral ? 'gray' : isBuy ? 'emerald' : 'rose';

  // Calculations for Visual Bar
  const totalRange = Math.abs(setup.tp2 - setup.stopLoss);
  const slPercentage = (Math.abs(setup.entry - setup.stopLoss) / totalRange) * 100;
  const tp1Percentage = (Math.abs(setup.tp1 - setup.entry) / totalRange) * 100;
  // Ensure percentages don't break layout if math is weird from AI
  const safeSlPct = Math.min(Math.max(slPercentage, 10), 40); 
  const safeTp1Pct = Math.min(Math.max(tp1Percentage, 10), 40);

  const handleCopy = () => {
    const text = `
⚡ توصية تداول (${data.pair})
🎯 النوع: ${isBuy ? 'شراء (BUY)' : 'بيع (SELL)'}
📥 الدخول: ${setup.entry}
🛑 وقف الخسارة: ${setup.stopLoss}
✅ هدف 1: ${setup.tp1} (1:1 R:R)
✅ هدف 2: ${setup.tp2}
✅ هدف 3: ${setup.tp3}
⚖️ المخاطرة: ${setup.riskRewardRatio}
💡 إدارة: ${setup.managementTips?.[0] || 'تأمين الصفقة عند الهدف الأول'}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (isNeutral) {
    return (
      <div className="bg-slate-800 border-l-4 border-gray-500 rounded-xl p-6 shadow-xl mb-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-yellow-500 w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold text-white">السوق حيادي / غير واضح</h2>
            <p className="text-gray-400">يفضل الانتظار خارج السوق حالياً. ({session})</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 border-t-4 border-${mainColor}-500 rounded-xl shadow-2xl overflow-hidden mb-8 transform transition-all hover:shadow-${mainColor}-500/10`}>
      {/* Header */}
      <div className={`bg-${mainColor}-500/10 p-4 border-b border-slate-700 flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className={`bg-${mainColor}-500 p-2 rounded-lg`}>
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold text-${mainColor}-400`}>
              {isBuy ? 'صفقة شراء' : 'صفقة بيع'} (Long/Short)
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <span>{data.pair} @ {data.currentPrice}</span>
               <span className="text-slate-600">•</span>
               <span className="text-xs border border-slate-600 px-2 py-0.5 rounded text-slate-300">{session}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
              onClick={handleCopy}
              className="hidden md:flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'تم النسخ' : 'نسخ الصفقة'}
            </button>
            
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">نسبة الثقة</div>
              <div className="flex items-center justify-center relative w-12 h-12">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="4"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={isBuy ? "#10b981" : "#f43f5e"}
                      strokeWidth="4"
                      strokeDasharray={`${setup.confidence}, 100`}
                    />
                </svg>
                <span className="absolute text-xs font-bold text-white">{setup.confidence}%</span>
              </div>
            </div>
        </div>
      </div>

      {/* Main Numbers */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {/* Entry */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 group hover:border-blue-500/50 transition-colors order-2 md:order-1">
          <span className="text-gray-400 text-sm block mb-1">نقطة الدخول (Entry)</span>
          <span className="text-2xl font-bold text-blue-400 font-mono tracking-wider">{setup.entry}</span>
        </div>

        {/* Stop Loss */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-rose-500/50 transition-colors order-1 md:order-2">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <div className="flex items-center justify-center gap-2 mb-1">
             <ShieldAlert className="w-4 h-4 text-rose-500" />
             <span className="text-gray-400 text-sm">وقف الخسارة (SL)</span>
          </div>
          <span className="text-2xl font-bold text-rose-400 font-mono tracking-wider">{setup.stopLoss}</span>
        </div>

        {/* TP1 */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-emerald-500/50 transition-colors order-3 md:order-3">
          <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex items-center justify-center gap-2 mb-1">
             <Target className="w-4 h-4 text-emerald-500" />
             <span className="text-gray-400 text-sm">هدف أول (TP1)</span>
          </div>
          <span className="text-2xl font-bold text-emerald-400 font-mono tracking-wider">{setup.tp1}</span>
          <span className="block text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded mt-1 inline-block border border-emerald-500/20">
            1:1 Risk/Reward
          </span>
        </div>
      </div>

      {/* Visual Trade Simulator */}
      <div className="px-6 pb-4">
        <h4 className="text-xs text-gray-500 mb-2 font-bold uppercase">محاكاة مسار الصفقة (Trade Visualizer)</h4>
        <div className="h-6 w-full bg-slate-700 rounded-full flex overflow-hidden relative">
           {/* Stop Loss Zone */}
           <div 
             className="h-full bg-rose-500/80 flex items-center justify-center text-[10px] text-white font-bold"
             style={{ width: `${safeSlPct}%`, order: isBuy ? 1 : 3 }}
           >
             RISK
           </div>
           
           {/* Entry Line Indicator */}
           <div 
              className="w-1 h-full bg-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
              style={{ order: 2 }}
           ></div>

           {/* TP1 Zone */}
           <div 
             className="h-full bg-emerald-500/60 flex items-center justify-center text-[10px] text-white font-bold border-r border-emerald-600/50"
             style={{ width: `${safeTp1Pct}%`, order: isBuy ? 3 : 1 }}
           >
             TP1
           </div>
           
           {/* Remaining Profit Zone */}
           <div 
              className="h-full bg-emerald-500/30 flex-1 flex items-center justify-center text-[10px] text-emerald-100"
              style={{ order: isBuy ? 4 : 0 }}
           >
             TP2 & TP3 &rarr;
           </div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
           <span>{isBuy ? setup.stopLoss : setup.tp2}</span>
           <span>Entry: {setup.entry}</span>
           <span>{isBuy ? setup.tp2 : setup.stopLoss}</span>
        </div>
      </div>

      {/* Extended Targets */}
      <div className="px-6 pb-6">
        <div className="bg-slate-700/30 rounded-lg p-4 flex flex-wrap justify-around items-center border border-slate-600/50">
           <div className="text-center">
             <span className="block text-xs text-gray-500">الهدف الثاني (TP2)</span>
             <span className="font-bold text-emerald-300 font-mono">{setup.tp2}</span>
           </div>
           <div className="w-px h-8 bg-slate-600"></div>
           <div className="text-center">
             <span className="block text-xs text-gray-500">الهدف الثالث (TP3)</span>
             <span className="font-bold text-emerald-300 font-mono">{setup.tp3}</span>
           </div>
           <div className="w-px h-8 bg-slate-600"></div>
           <div className="text-center">
             <span className="block text-xs text-gray-500">العائد الكلي</span>
             <span className="font-bold text-white">{setup.riskRewardRatio}</span>
           </div>
        </div>
      </div>

      {/* Trade Management & Logic */}
      <div className="bg-slate-900 p-6 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Management Tips */}
         <div>
            <div className="flex items-center gap-2 mb-3 text-amber-400">
               <ListChecks className="w-4 h-4" />
               <h4 className="text-sm font-bold">خطة إدارة الصفقة (Smart Management)</h4>
            </div>
            <ul className="space-y-2">
               {setup.managementTips && setup.managementTips.length > 0 ? (
                  setup.managementTips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2 bg-slate-800/50 p-2 rounded">
                       <span className="text-amber-500 mt-0.5">•</span>
                       {tip}
                    </li>
                  ))
               ) : (
                 <li className="text-sm text-gray-400">لا توجد نصائح محددة. التزم بإدارة المخاطر.</li>
               )}
               {/* Static Pro Tips if list is short */}
               <li className="text-xs text-gray-500 italic pt-2 border-t border-slate-800 mt-2">
                 * نصيحة عامة: قم بتحريك وقف الخسارة إلى نقطة الدخول (Breakeven) فور تحقيق الهدف الأول.
               </li>
            </ul>
         </div>

         {/* Reasoning */}
         <div>
            <div className="flex items-center gap-2 mb-3 text-blue-400">
               <Briefcase className="w-4 h-4" />
               <h4 className="text-sm font-bold">منطق الصفقة (Reasoning)</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {setup.reasoning.map((reason, idx) => (
                <span key={idx} className="text-xs bg-slate-800 text-gray-300 px-3 py-1 rounded-full border border-slate-700 hover:border-blue-500/30 transition-colors cursor-default">
                  {reason}
                </span>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};