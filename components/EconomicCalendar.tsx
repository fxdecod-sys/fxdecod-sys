import React, { useEffect, useRef } from 'react';
import { CalendarDays } from 'lucide-react';

export const EconomicCalendar: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": true,
      "width": "100%",
      "height": "400",
      "locale": "ar_AE",
      "importanceFilter": "0,1", // 0: High, 1: Medium
      "currencyFilter": "USD,EUR,GBP,JPY,CAD", // Added CAD as it correlates with Oil
      "hideCountryFlag": false
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg mb-8">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-white">
          التقويم الاقتصادي (أخبار العملات والنفط)
        </h3>
      </div>
      <div className="h-[400px] w-full" ref={container}></div>
    </div>
  );
};