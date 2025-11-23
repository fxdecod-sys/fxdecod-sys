import React, { useEffect, useRef } from 'react';
import { Flame } from 'lucide-react';

export const ForexHeatmap: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "400",
      "currencies": [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY"
      ],
      "isTransparent": true,
      "colorTheme": "dark",
      "locale": "en"
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg mb-8">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-bold text-white">
          خريطة السيولة وقوة العملات (Forex Heatmap)
        </h3>
      </div>
      <div className="h-[400px] w-full" ref={container}></div>
    </div>
  );
};