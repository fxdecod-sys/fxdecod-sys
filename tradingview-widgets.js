// تكامل أدوات TradingView
document.addEventListener('DOMContentLoaded', function() {
    // شريط الأسعار المتحرك
    new TradingView.widget({
        "container_id": "tradingview_ticker",
        "symbols": [
            { "proName": "OANDA:XAUUSD", "title": "الذهب" },
            { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
            { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
            { "proName": "TVC:DXY", "title": "مؤشر الدولار" },
            { "proName": "OANDA:EURUSD", "title": "EUR/USD" },
            { "proName": "OANDA:GBPUSD", "title": "GBP/USD" },
            { "proName": "OANDA:USDJPY", "title": "USD/JPY" },
            { "proName": "TVC:USOIL", "title": "النفط" }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "ar_AE"
    });

    // الشارت الرئيسي
    new TradingView.widget({
        "autosize": true,
        "symbol": "OANDA:XAUUSD",
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "ar_AE",
        "toolbar_bg": "#1e293b",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_chart",
        "studies": [
            "BB@tv-basicstudies",
            "RSI@tv-basicstudies"
        ],
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650"
    });

    // التحليل الفني
    new TradingView.widget({
        "container_id": "technical-analysis",
        "width": "100%",
        "height": "300",
        "symbol": "OANDA:XAUUSD",
        "interval": "1h",
        "timezone": "exchange",
        "theme": "dark",
        "style": "1",
        "locale": "ar_AE",
        "toolbar_bg": "#1e293b",
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "save_image": false,
        "studies": [
            "STD;SMA"
        ],
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650"
    });

    // الخريطة الحرارية للفوركس
    new TradingView.widget({
        "container_id": "forex-heat-map",
        "width": "100%",
        "height": "300",
        "currencies": [
            "EUR",
            "USD",
            "JPY",
            "GBP",
            "CHF",
            "AUD",
            "CAD",
            "NZD"
        ],
        "isTransparent": true,
        "colorTheme": "dark",
        "locale": "ar_AE"
    });

    // التقويم الاقتصادي
    new TradingView.widget({
        "container_id": "economic-calendar",
        "width": "100%",
        "height": "400",
        "colorTheme": "dark",
        "isTransparent": true,
        "locale": "ar_AE",
        "importanceFilter": "-1,0,1"
    });
});

// تحديث البيانات تلقائياً
function updateMarketData() {
    // يمكن إضافة تحديثات للبيانات هنا
    console.log('Updating market data...');
}

// تحديث كل 30 ثانية
setInterval(updateMarketData, 30000);
