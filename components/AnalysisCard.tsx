import React from 'react';
import { MarketAnalysis } from '../types';
import { TrendingUp, TrendingDown, Minus, Activity, Newspaper, Link2, Landmark } from 'lucide-react';

interface AnalysisCardProps {
  data: MarketAnalysis;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ data }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="text-emerald-500 w-6 h-6" />;
      case 'DOWN': return <TrendingDown className="text-rose-500 w-6 h-6" />;
      default: return <Minus className="text-gray-400 w-6 h-6" />;
    }
  };

  const getSignalColor = (signal: string) => {
    if (signal === 'BUY') return 'text-emerald-400';
    if (signal === 'SELL') return 'text-rose-400';
    return 'text-gray-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Fundamental Analysis */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="text-blue-400 w-5 h-5" />
          <h3 className="text-xl font-bold text-white">التحليل الأساسي</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed text-sm lg:text-base border-l-2 border-blue-500/30 pl-3">
            {data.fundamentals.summary}
          </p>
          
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">أهم المؤثرات والأخبار:</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.fundamentals.newsPoints.map((point, i) => (
                <li key={i} className="text-gray-300 text-sm">{point}</li>
              ))}
            </ul>
          </div>
          
          {data.fundamentals.upcomingEvents && data.fundamentals.upcomingEvents.length > 0 && (
             <div className="bg-orange-900/10 p-3 rounded-lg border border-orange-500/20">
               <h4 className="text-sm font-semibold text-orange-400 mb-2">أحداث اقتصادية مرتقبة:</h4>
               <ul className="space-y-1">
                 {data.fundamentals.upcomingEvents.map((event, i) => (
                   <li key={i} className="text-orange-200/80 text-xs flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                     {event}
                   </li>
                 ))}
               </ul>
             </div>
          )}

          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-gray-400">قوة التأثير:</span>
            <span className={`font-bold px-2 py-1 rounded ${
              data.fundamentals.impactLevel === 'HIGH' ? 'bg-rose-500/20 text-rose-400' :
              data.fundamentals.impactLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {data.fundamentals.impactLevel === 'HIGH' ? 'عالي جداً' : 
               data.fundamentals.impactLevel === 'MEDIUM' ? 'متوسط' : 'منخفض'}
            </span>
          </div>
        </div>

        {/* Correlations */}
        {data.correlations && data.correlations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="text-indigo-400 w-4 h-4" />
              <h4 className="text-sm font-bold text-indigo-100">ارتباطات السوق (Correlations)</h4>
            </div>
            <div className="space-y-2">
              {data.correlations.map((corr, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs bg-indigo-900/10 p-2 rounded border border-indigo-500/10">
                   <div className="font-bold text-indigo-300 shrink-0">{corr.asset}:</div>
                   <div className="text-gray-300">{corr.details} <span className="text-indigo-400/70">({corr.correlation})</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Technical Analysis */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-purple-400 w-5 h-5" />
          <h3 className="text-xl font-bold text-white">التحليل الفني</h3>
        </div>

        <div className="flex items-center justify-between mb-6 bg-slate-900 p-3 rounded-lg">
          <span className="text-gray-400">الاتجاه العام:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">
              {data.trend === 'UP' ? 'صاعد (Bullish)' : data.trend === 'DOWN' ? 'هابط (Bearish)' : 'جانبي (Ranging)'}
            </span>
            {getTrendIcon(data.trend)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {data.technicals.indicators.map((ind, i) => (
            <div key={i} className="bg-slate-900/50 p-2 rounded text-center">
              <div className="text-xs text-gray-500 mb-1">{ind.name}</div>
              <div className={`font-bold text-sm ${getSignalColor(ind.signal)}`}>
                {ind.signal === 'BUY' ? 'شراء' : ind.signal === 'SELL' ? 'بيع' : 'حيادي'}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-700 pb-2">
            <span className="text-gray-400">RSI (14):</span>
            <span className={`font-mono ${data.technicals.rsi > 70 || data.technicals.rsi < 30 ? 'text-yellow-400' : 'text-white'}`}>
              {data.technicals.rsi}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700 pb-2">
            <span className="text-gray-400">MACD:</span>
            <span className="text-white text-right w-1/2">{data.technicals.macd}</span>
          </div>
          
          <div className="pt-2">
             <div className="flex items-center gap-2 mb-1 text-purple-300">
               <Landmark className="w-3 h-3" />
               <span className="text-xs font-bold">التمركز المؤسسي (SMC Bias):</span>
             </div>
             <p className="text-xs text-gray-300 leading-relaxed bg-purple-900/10 p-2 rounded border border-purple-500/10">
               {data.technicals.institutionalBias || "لا يوجد بيانات مؤسسية واضحة."}
             </p>
          </div>

          <div className="flex justify-between pt-2">
            <span className="text-gray-400">الأنماط الفنية:</span>
            <span className="text-white text-left text-xs bg-slate-700 px-2 py-0.5 rounded">
              {data.technicals.patterns.join(' - ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};