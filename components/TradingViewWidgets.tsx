import React, { useEffect, useRef } from 'react';

// --- Types ---
interface WidgetProps {
  className?: string;
  symbol?: string;
}

// --- Ticker Tape ---
export const TickerTape: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = ''; // Clear previous

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
        { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
        { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
        { "description": "Gold", "proName": "OANDA:XAUUSD" },
        { "description": "Oil", "proName": "TVC:USOIL" },
        { "description": "DXY", "proName": "TVC:DXY" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": false,
      "displayMode": "adaptive",
      "locale": "ar_AE"
    });
    container.current.appendChild(script);
  }, []);

  return <div className="tradingview-widget-container w-full h-12" ref={container}></div>;
};

// --- Advanced Real-Time Chart ---
export const AdvancedChart: React.FC<WidgetProps> = ({ symbol = "XAUUSD", className }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "H",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "backgroundColor": "rgba(2, 6, 23, 1)", // Slate 950 matches app bg
      "gridColor": "rgba(30, 41, 59, 1)",
      "hide_top_toolbar": false,
      "save_image": false,
      "calendar": false,
      "hide_volume": true,
      "support_host": "https://www.tradingview.com"
    });
    container.current.appendChild(script);
  }, [symbol]);

  return <div className={`tradingview-widget-container ${className}`} ref={container}></div>;
};

// --- Technical Gauge ---
export const TechnicalGauge: React.FC<WidgetProps> = ({ symbol = "XAUUSD", className }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1h",
      "width": "100%",
      "isTransparent": true,
      "height": "100%",
      "symbol": symbol,
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "dark"
    });
    container.current.appendChild(script);
  }, [symbol]);

  return <div className={`tradingview-widget-container ${className}`} ref={container}></div>;
};

// --- Forex Heatmap ---
export const ForexHeatmap: React.FC<{ className?: string }> = ({ className }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "100%",
      "currencies": [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD"
      ],
      "isTransparent": true,
      "colorTheme": "dark",
      "locale": "en"
    });
    container.current.appendChild(script);
  }, []);

  return <div className={`tradingview-widget-container ${className}`} ref={container}></div>;
};

// --- Economic Calendar ---
export const EconomicCalendar: React.FC<{ className?: string }> = ({ className }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": true,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "importanceFilter": "0,1", // High and Medium only (0 and 1 usually map to high/med in embed params depending on version, sometimes it's -1, 0, 1. Using standard config)
      "currencyFilter": "USD,EUR,GBP,JPY,CAD"
    });
    container.current.appendChild(script);
  }, []);

  return <div className={`tradingview-widget-container ${className}`} ref={container}></div>;
};
