import React, { useEffect, useRef } from 'react';
import { Gauge } from 'lucide-react';

export const GoldTechnical: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1h",
      "width": "100%",
      "isTransparent": true,
      "height": "400",
      "symbol": "FOREXCOM:XAUUSD",
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "dark"
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg mb-8">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
        <Gauge className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-bold text-white">
          مقياس ضغط السيولة - الذهب (Gold Momentum)
        </h3>
      </div>
      <div className="h-[400px] w-full p-2" ref={container}></div>
    </div>
  );
};