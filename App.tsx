
import React, { useState } from 'react';
import { analyzeMarket } from './services/geminiService';
import { MarketAnalysis, Timeframe, StrategyStyle } from './types';
import { Spinner } from './components/Spinner';
import { AnalysisCard } from './components/AnalysisCard';
import { TradeCard } from './components/TradeCard';
import { LevelsSection } from './components/LevelsSection';
import { TradingViewWidget } from './components/TradingViewWidget';
import { ForexHeatmap } from './components/ForexHeatmap';
import { GoldTechnical } from './components/GoldTechnical';
import { TickerTape } from './components/TickerTape';
import { Footer } from './components/Footer';
import { Search, Info, Globe, SlidersHorizontal, BarChart2 } from 'lucide-react';

const COMMON_PAIRS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'ETHUSD', 'US30'];

function App() {
  const [pair, setPair] = useState<string>('XAUUSD');
  const [customPair, setCustomPair] = useState('');
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.INTRADAY);
  const [strategy, setStrategy] = useState<StrategyStyle>(StrategyStyle.CONSERVATIVE);
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarketAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const targetPair = customPair.trim() ? customPair.toUpperCase() : pair;
    if (!targetPair) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await analyzeMarket(targetPair, timeframe, strategy);
      setData(result);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التحليل. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const getTargetPair = () => customPair.trim() ? customPair.toUpperCase() : pair;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-cairo flex flex-col">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20"> {/* Increased height slightly for logo */}
            {/* Logo Section - Right Side in RTL */}
            <div className="flex items-center shrink-0">
              <img 
                src="/logo.png" 
                alt="FX DECOD" 
                className="h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  // Fallback if image fails
                  const fallback = document.getElementById('logo-fallback');
                  if(fallback) fallback.classList.remove('hidden');
                }}
              />
              <div id="logo-fallback" className="hidden text-xl font-bold text-white tracking-widest border-2 border-white/20 p-2 rounded">
                FX DECOD
              </div>
            </div>

            {/* Status Badge - Left Side in RTL */}
            <div className="text-xs text-gray-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Connected
            </div>
          </div>
        </div>
      </nav>

      {/* Ticker Tape (Liquidity Flow) */}
      <TickerTape />

      <main className="max-w-5xl mx-auto px-4 pt-4 flex-grow w-full">
        
        {/* Controls Section */}
        <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-xl mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-400">
             <SlidersHorizontal className="w-4 h-4" />
             <h3 className="text-sm font-bold uppercase tracking-wider">إعدادات التحليل</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Pair Selection */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium mr-1">الأصل (Asset)</label>
              <div className="relative">
                <select 
                  value={pair} 
                  onChange={(e) => {
                    setPair(e.target.value);
                    if(e.target.value !== 'CUSTOM') setCustomPair('');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none text-sm font-mono"
                >
                  {COMMON_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="CUSTOM">أصل آخر...</option>
                </select>
              </div>
              {pair === 'CUSTOM' && (
                <input 
                  type="text" 
                  placeholder="مثال: GBPJPY" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white mt-2 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-mono"
                  value={customPair}
                  onChange={(e) => setCustomPair(e.target.value)}
                />
              )}
            </div>

            {/* Timeframe Selection */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium mr-1">الإطار الزمني</label>
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as Timeframe)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                {Object.values(Timeframe).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Strategy Selection */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium mr-1">أسلوب التداول</label>
              <select 
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as StrategyStyle)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              >
                {Object.values(StrategyStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Action Button */}
            <div className="flex items-end">
              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full p-2.5 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 ${
                  loading 
                    ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 border border-blue-500/50'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    تحليل...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    ابداً التحليل الذكي
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Live Chart Section */}
        {!loading && (
          <div className="mb-6 space-y-8">
             {/* Chart */}
             <div>
               <div className="flex items-center gap-2 mb-2 px-2">
                  <BarChart2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase">شارت مباشر (مع الفوليوم)</h3>
               </div>
               <TradingViewWidget pair={getTargetPair()} />
             </div>

             {/* Liquidity Tools Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GoldTechnical />
                <ForexHeatmap />
             </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-200 p-4 rounded-xl mb-6 flex items-center gap-3 animate-shake">
             <Info className="w-6 h-6 shrink-0" />
             <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
           <div className="text-center py-12 animate-pulse bg-slate-900/30 rounded-2xl border border-slate-800/50">
              <Spinner />
              <h3 className="mt-6 text-xl font-bold text-white">جاري مسح الأسواق...</h3>
              <div className="space-y-2 mt-3">
                 <p className="text-sm text-gray-400">🔍 فحص الارتباطات (DXY, Yields)</p>
                 <p className="text-sm text-gray-400">🌍 تحديد السيولة حسب الجلسة الحالية</p>
                 <p className="text-sm text-gray-400">📊 حساب مستويات الدخول المثلى</p>
              </div>
           </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="animate-fade-in-up space-y-6">
            <div className="flex justify-between items-end px-2">
               <div>
                 <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                   {data.pair} 
                   <span className={`px-2 py-0.5 rounded text-sm font-normal border ${
                     data.trend === 'UP' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                     data.trend === 'DOWN' ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' :
                     'border-gray-500/30 bg-gray-500/10 text-gray-400'
                   }`}>
                     {data.trend === 'UP' ? 'صاعد' : data.trend === 'DOWN' ? 'هابط' : 'جانبي'}
                   </span>
                 </h2>
                 <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                   <span>{timeframe}</span>
                   <span>•</span>
                   <span>{strategy}</span>
                 </p>
               </div>
               <div className="text-right">
                 <div className="text-xs text-gray-500">آخر تحديث</div>
                 <div className="font-mono text-emerald-400">{new Date(data.timestamp).toLocaleTimeString('ar-EG')}</div>
               </div>
            </div>

            <TradeCard data={data} />
            <AnalysisCard data={data} />
            <LevelsSection data={data} />

            {/* Disclaimer */}
            <div className="mt-12 bg-slate-950 p-6 rounded-xl border border-slate-800">
              <div className="flex items-start gap-3 mb-4">
                 <Info className="text-gray-500 w-5 h-5 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-bold text-gray-400">إخلاء مسؤولية هام</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      التحليلات والتوصيات المقدمة في هذا التطبيق تعتمد على الذكاء الاصطناعي (Google Gemini) وتخضع لاحتمالية الخطأ.
                      سوق الفوركس ينطوي على مخاطر عالية وقد تفقد كل رأس مالك. 
                      هذه الأداة للمساعدة في اتخاذ القرار وليست نصيحة مالية ملزمة. تأكد دائماً من إدارة المخاطر.
                    </p>
                 </div>
              </div>
              
              <div className="border-t border-slate-800 pt-4 flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> المصادر:
                </span>
                {data.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-500/60 hover:text-blue-400 transition-colors truncate max-w-[150px]"
                  >
                    {source.title || new URL(source.uri).hostname}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
