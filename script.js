// المحرك الرئيسي للتطبيق
class FXDecodEngine {
    constructor() {
        this.currentSymbol = 'XAUUSD';
        this.initEventListeners();
        this.initTradingViewWidgets();
        this.startLiveUpdates();
    }

    initEventListeners() {
        // أزرار الإطارات الزمنية
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const timeframe = e.target.getAttribute('data-timeframe');
                this.updateChartTimeframe(timeframe);
            });
        });

        // عناصر القائمة
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleMenuItemClick(item.textContent);
            });
        });
    }

    initTradingViewWidgets() {
        // انتظر حتى يتم تحميل مكتبة TradingView
        if (typeof TradingView === 'undefined') {
            setTimeout(() => this.initTradingViewWidgets(), 100);
            return;
        }

        // الشارت الرئيسي
        new TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": "OANDA:XAUUSD",
            "interval": "60",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#1e293b",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "container_id": "tradingview_chart",
            "studies": [
                "BB@tv-basicstudies",
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies"
            ],
            "show_popup_button": true,
            "popup_width": "1000",
            "popup_height": "650",
            "allow_symbol_change": true
        });

        // التحليل الفني
        new TradingView.widget({
            "container_id": "technical_analysis",
            "width": "100%",
            "height": "100%",
            "symbol": "OANDA:XAUUSD",
            "interval": "60",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#1e293b",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "save_image": false,
            "details": true,
            "hotlist": true,
            "calendar": false,
            "studies": [
                "STD;SMA"
            ]
        });

        // الخريطة الحرارية
        new TradingView.widget({
            "container_id": "forex_heatmap",
            "width": "100%",
            "height": "100%",
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
            "locale": "en",
            "width": "100%",
            "height": "100%"
        });

        // التقويم الاقتصادي
        new TradingView.widget({
            "container_id": "economic_calendar",
            "width": "100%",
            "height": "100%",
            "colorTheme": "dark",
            "isTransparent": true,
            "locale": "en",
            "importanceFilter": "-1,0,1"
        });
    }

    updateChartTimeframe(timeframe) {
        console.log('Updating timeframe to:', timeframe);
        // هنا يمكن إضافة منطق لتحديث الشارت
    }

    handleMenuItemClick(itemText) {
        console.log('Menu item clicked:', itemText);
        
        // محاكاة تحليل الذكاء الاصطناعي
        if (itemText.includes('XAUUSD') || itemText.includes('التحليل')) {
            this.showAnalysisResult();
        }
    }

    showAnalysisResult() {
        const result = {
            symbol: 'XAUUSD',
            recommendation: Math.random() > 0.5 ? 'BUY' : 'SELL',
            confidence: Math.floor(Math.random() * 30) + 70,
            entry: (4160 + Math.random() * 10).toFixed(3),
            stopLoss: (4150 + Math.random() * 5).toFixed(3),
            takeProfit: (4170 + Math.random() * 10).toFixed(3)
        };

        alert(`🎯 نتيجة التحليل:
الزوج: ${result.symbol}
التوصية: ${result.recommendation}
الثقة: ${result.confidence}%
سعر الدخول: ${result.entry}
وقف الخسارة: ${result.stopLoss}
الهدف: ${result.takeProfit}`);
    }

    startLiveUpdates() {
        // تحديث الأسعار كل 5 ثوانٍ
        setInterval(() => {
            this.updateLivePrices();
        }, 5000);
    }

    updateLivePrices() {
        const priceElements = document.querySelectorAll('.price-up, .price-down');
        priceElements.forEach(element => {
            if (element.textContent.includes('Vol')) return;
            
            const currentText = element.textContent;
            const priceMatch = currentText.match(/([\d,]+\.\d+)/);
            if (!priceMatch) return;
            
            const currentPrice = parseFloat(priceMatch[1].replace(',', ''));
            const randomChange = (Math.random() - 0.5) * 0.1;
            const newPrice = currentPrice * (1 + randomChange / 100);
            
            if (randomChange > 0) {
                element.className = 'price-up';
                element.textContent = newPrice.toFixed(3) + ' +' + Math.abs(randomChange).toFixed(2) + '%';
            } else {
                element.className = 'price-down';
                element.textContent = newPrice.toFixed(3) + ' ' + randomChange.toFixed(2) + '%';
            }
        });
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // انتظر قليلاً لضمان تحميل كل شيء
    setTimeout(() => {
        window.fxApp = new FXDecodEngine();
        console.log('FX DECOD App Initialized Successfully!');
    }, 1000);
});

// وظيفة مساعدة للتحقق من أخطاء التحميل
window.addEventListener('error', function(e) {
    console.error('Error loading page:', e.error);
});

// إظهار رسالة عندما تكون الصفحة جاهزة
window.addEventListener('load', function() {
    console.log('Page fully loaded');
});
