import React from 'react';
import { AnalysisResponse, ActionType } from '../types';

interface Props {
  data: AnalysisResponse;
}

const AnalysisDisplay: React.FC<Props> = ({ data }) => {
  const isBuy = data.action === ActionType.BUY;
  const isSell = data.action === ActionType.SELL;
  
  const cardColor = isBuy 
    ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
    : isSell 
      ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
      : 'border-slate-600';

  const actionBg = isBuy ? 'bg-emerald-500' : isSell ? 'bg-rose-500' : 'bg-slate-500';
  const actionText = isBuy ? 'text-emerald-400' : isSell ? 'text-rose-400' : 'text-slate-400';

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. Trade Card */}
      <div className={`bg-slate-900 rounded-2xl border-2 ${cardColor} p-6 overflow-hidden relative`}>
        {/* Background Gradient Mesh */}
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full ${isBuy ? 'bg-emerald-600' : isSell ? 'bg-rose-600' : 'bg-slate-600'} pointer-events-none`}></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              توصية التداول
              <span className={`text-sm px-3 py-1 rounded-md text-white font-bold ${actionBg}`}>
                {data.action === 'BUY' ? 'شراء ↗' : data.action === 'SELL' ? 'بيع ↘' : 'حيادي ↔'}
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">المخاطرة مقابل العائد: {data.riskRewardRatio}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
             <div className="text-right">
                <span className="block text-xs text-slate-400">نسبة الثقة</span>
                <span className="text-xl font-bold text-white">{data.confidence}%</span>
             </div>
             {/* Simple Ring Chart for Confidence */}
             <div className="relative w-12 h-12">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className={isBuy ? 'text-emerald-500' : isSell ? 'text-rose-500' : 'text-slate-400'} strokeDasharray={`${data.confidence}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
             </div>
          </div>
        </div>

        {/* Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 relative z-10 text-center md:text-right">
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="block text-xs text-slate-400 mb-1">منطقة الدخول</span>
            <span className="text-lg font-bold text-blue-400 font-mono" dir="ltr">{data.entry}</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="block text-xs text-rose-300/70 mb-1">وقف الخسارة</span>
            <span className="text-lg font-bold text-rose-400 font-mono" dir="ltr">{data.stopLoss}</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="block text-xs text-emerald-300/70 mb-1">الهدف الأول (1:1)</span>
            <span className="text-lg font-bold text-emerald-400 font-mono" dir="ltr">{data.takeProfit1}</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 opacity-80">
            <span className="block text-xs text-emerald-300/50 mb-1">الهدف الثاني</span>
            <span className="text-lg font-bold text-emerald-500/80 font-mono" dir="ltr">{data.takeProfit2}</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 opacity-60">
            <span className="block text-xs text-emerald-300/30 mb-1">الهدف الثالث</span>
            <span className="text-lg font-bold text-emerald-600/60 font-mono" dir="ltr">{data.takeProfit3}</span>
          </div>
        </div>

        {/* Management Plan */}
        <div className="bg-slate-800/50 rounded-lg p-4 border-r-4 border-blue-500 relative z-10">
          <h3 className="text-sm font-bold text-blue-200 mb-1">💡 خطة الإدارة</h3>
          <p className="text-sm text-slate-300">
             عند الوصول للهدف الأول ({data.takeProfit1})، قم بنقل وقف الخسارة إلى منطقة الدخول ({data.entry}) فوراً لحماية الأرباح.
          </p>
        </div>
      </div>

      {/* 2. Analysis & Context Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fundamental Analysis */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <span className="text-yellow-500">📊</span> التحليل الأساسي والارتباطات
           </h3>
           <div className="space-y-4">
             <div>
               <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">الأخبار والاقتصاد</h4>
               <p className="text-slate-300 text-sm leading-relaxed border-r-2 border-slate-700 pr-3">
                 {data.fundamentalAnalysis}
               </p>
             </div>
             <div>
               <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">الارتباطات (Correlations)</h4>
               <p className="text-slate-300 text-sm border-r-2 border-slate-700 pr-3">
                 {data.correlationNote}
               </p>
             </div>
           </div>
        </div>

        {/* Technical SMC & Levels */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <span className="text-blue-500">📈</span> التحليل الفني (SMC)
           </h3>
           <p className="text-slate-300 text-sm leading-relaxed mb-6 border-r-2 border-blue-500/30 pr-3">
             {data.smcContext}
           </p>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <h4 className="text-xs text-rose-400 font-bold mb-2">مقاومات (Sell Zones)</h4>
               <ul className="text-sm text-slate-300 space-y-1 font-mono" dir="ltr">
                 {data.supportResistance.resistances.slice(0,3).map((r, i) => (
                   <li key={i} className="bg-rose-500/10 px-2 py-1 rounded text-center">{r}</li>
                 ))}
               </ul>
             </div>
             <div>
               <h4 className="text-xs text-emerald-400 font-bold mb-2">دعوم (Buy Zones)</h4>
               <ul className="text-sm text-slate-300 space-y-1 font-mono" dir="ltr">
                 {data.supportResistance.supports.slice(0,3).map((s, i) => (
                   <li key={i} className="bg-emerald-500/10 px-2 py-1 rounded text-center">{s}</li>
                 ))}
               </ul>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;