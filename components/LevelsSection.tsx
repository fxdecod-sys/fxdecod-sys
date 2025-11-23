import React from 'react';
import { MarketAnalysis } from '../types';

interface LevelsSectionProps {
  data: MarketAnalysis;
}

export const LevelsSection: React.FC<LevelsSectionProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg mb-8">
      <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">مستويات الدعم والمقاومة</h3>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Resistance */}
        <div className="flex-1 space-y-2">
          <h4 className="text-rose-400 text-sm font-semibold mb-2 text-center">المقاومات (Resistance)</h4>
          {data.levels.resistance.slice().reverse().map((level, i) => (
             <div key={i} className="flex justify-between items-center bg-rose-900/10 p-2 rounded border border-rose-500/20">
               <span className="text-xs text-rose-300">R{3-i}</span>
               <span className="font-mono text-rose-200 font-bold">{level}</span>
             </div>
          ))}
        </div>

        {/* Current Price Indicator */}
        <div className="flex items-center justify-center flex-col py-4">
           <div className="text-xs text-gray-500 mb-1">السعر الحالي</div>
           <div className="text-xl font-bold text-blue-400 font-mono animate-pulse">{data.currentPrice}</div>
        </div>

        {/* Support */}
        <div className="flex-1 space-y-2">
          <h4 className="text-emerald-400 text-sm font-semibold mb-2 text-center">الدعوم (Support)</h4>
          {data.levels.support.map((level, i) => (
             <div key={i} className="flex justify-between items-center bg-emerald-900/10 p-2 rounded border border-emerald-500/20">
               <span className="text-xs text-emerald-300">S{i+1}</span>
               <span className="font-mono text-emerald-200 font-bold">{level}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};