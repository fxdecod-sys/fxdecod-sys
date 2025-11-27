import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  pair: string;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ pair }) => {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Format pair for TradingView (e.g., "XAUUSD" -> "OANDA:XAUUSD" or just "XAUUSD")
  // Using generic mapping for simplicity. 
  let symbol = pair.replace('/', '').toUpperCase();
  if (symbol === 'GOLD') symbol = 'XAUUSD';

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "60",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en", // Keep en for better data availability
      "enable_publishing": false,
      "hide_top_toolbar": true, // Hide toolbar on mobile to save space
      "allow_symbol_change": true,
      "save_image": false,
      "calendar": false,
      "hide_volume": false, // SHOW VOLUME for Bookmap-like analysis
      "support_host": "https://www.tradingview.com"
    });

    container.current.appendChild(script);
    scriptRef.current = script;

  }, [pair]);

  return (
    // Responsive height: 300px on mobile, 500px on desktop
    <div className="h-[350px] md:h-[500px] w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg mb-8" ref={container}>
       {/* Widget loads here */}
    </div>
  );
};