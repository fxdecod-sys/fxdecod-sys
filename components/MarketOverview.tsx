
import React, { useEffect, useRef } from 'react';

export const MarketOverview: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "100%",
      "height": "500",
      "plotLineColorGrowing": "rgba(16, 185, 129, 1)",
      "plotLineColorFalling": "rgba(244, 63, 94, 1)",
      "gridLineColor": "rgba(42, 46, 57, 0)",
      "scaleFontColor": "rgba(209, 213, 219, 1)",
      "belowLineFillColorGrowing": "rgba(16, 185, 129, 0.12)",
      "belowLineFillColorFalling": "rgba(244, 63, 94, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "السلع (Gold/Oil)",
          "symbols": [
            { "s": "FOREXCOM:XAUUSD", "d": "Gold" },
            { "s": "FOREXCOM:XAGUSD", "d": "Silver" },
            { "s": "FOREXCOM:WTI", "d": "Oil" },
            { "s": "FOREXCOM:NATGAS", "d": "Gas" }
          ],
          "originalTitle": "Commodities"
        },
        {
          "title": "المؤشرات (Indices)",
          "symbols": [
            { "s": "FOREXCOM:SPX500", "d": "S&P 500" },
            { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" },
            { "s": "FOREXCOM:DJI", "d": "Dow 30" },
            { "s": "TVC:DXY", "d": "Dollar Index" }
          ],
          "originalTitle": "Indices"
        },
        {
          "title": "الفوركس (Forex)",
          "symbols": [
            { "s": "FX:EURUSD", "d": "EUR/USD" },
            { "s": "FX:GBPUSD", "d": "GBP/USD" },
            { "s": "FX:USDJPY", "d": "USD/JPY" },
            { "s": "FX:USDCHF", "d": "USD/CHF" },
            { "s": "FX:AUDUSD", "d": "AUD/USD" },
            { "s": "FX:USDCAD", "d": "USD/CAD" }
          ],
          "originalTitle": "Forex"
        }
      ]
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg mb-8">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          🌍 نظرة عامة على سيولة السوق (Market Liquidity)
        </h3>
      </div>
      <div className="h-[500px] w-full" ref={container}></div>
    </div>
  );
};
