import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnalysisDisplay from './components/AnalysisDisplay';
import { TickerTape, AdvancedChart, TechnicalGauge, ForexHeatmap, EconomicCalendar } from './components/TradingViewWidgets';
import { analyzeMarket } from './services/geminiService';
import { PAIRS, STRATEGIES, TIMEFRAMES, AnalysisResponse } from './types';

function App() {
  // State for Form
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[1]); // Default 15m
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[0]);
  
  // State for Analysis
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeMarket({
        pair: selectedPair,
        timeframe: selectedTimeframe,
        strategy: selectedStrategy
      });
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError("حدث خطأ أثناء الاتصال بالخادم. يرجى التأكد من مفتاح API والمحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-slate-950 text-slate-200">
      
      <TickerTape />
      
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-12">
        
        {/* --- Control Panel --- */}
        <section className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              
              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-semibold">الأصل المالي</label>
                <select 
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  dir="ltr"
                >
                  {PAIRS.map(pair => <option key={pair} value={pair}>{pair}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-semibold">الإطار الزمني</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  {TIMEFRAMES.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-semibold">استراتيجية التحليل</label>
                <select 
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  {STRATEGIES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2
                  ${loading 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                    : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white border border-white/10'
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التحليل الذكي...
                  </>
                ) : (
                  'ابدأ التحليل الآن ✨'
                )}
              </button>
            </div>
        </section>

        {/* --- Error Message --- */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-200 px-6 py-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* --- AI Analysis Results --- */}
        {analysisResult && (
           <section id="results" className="scroll-mt-24">
              <AnalysisDisplay data={analysisResult} />
           </section>
        )}

        {/* --- Always Visible Widgets Grid --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px] lg:h-[600px]">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
             <div className="h-full w-full">
                <AdvancedChart symbol={selectedPair} className="h-full w-full" />
             </div>
          </div>

          {/* Side Widgets */}
          <div className="flex flex-col gap-6 h-full">
             <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg p-2">
                <TechnicalGauge symbol={selectedPair} className="h-full w-full" />
             </div>
             <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg p-2">
                <EconomicCalendar className="h-full w-full" />
             </div>
          </div>
        </section>

        {/* --- Heatmap Section --- */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-4 h-[500px] shadow-lg">
           <h3 className="text-xl font-bold mb-4 text-slate-300 px-2">خريطة سيولة العملات (Forex Heatmap)</h3>
           <ForexHeatmap className="w-full h-[calc(100%-2rem)]" />
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;