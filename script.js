// المحرك الرئيسي للتطبيق
class FXDecodEngine {
    constructor() {
        this.currentSymbol = 'XAUUSD';
        this.currentTimeframe = 'M1';
        this.currentStrategy = 'conservative';
        this.isAnalyzing = false;
    }

    // بدء التحليل
    async startAnalysis() {
        if (this.isAnalyzing) return;

        this.isAnalyzing = true;
        const analyzeBtn = document.querySelector('.analyze-btn');
        analyzeBtn.innerHTML = '⏳ جاري التحليل...';
        analyzeBtn.disabled = true;

        try {
            // محاكاة التحليل (سيتم استبدالها بالذكاء الاصطناعي الحقيقي)
            const analysisResult = await this.performAIAnalysis();
            this.displayResults(analysisResult);
        } catch (error) {
            console.error('Error in analysis:', error);
            this.showError('فشل في التحليل. يرجى المحاولة مرة أخرى.');
        } finally {
            this.isAnalyzing = false;
            analyzeBtn.innerHTML = '🚀 ابدأ التحليل الذكي';
            analyzeBtn.disabled = false;
        }
    }

    // محاكاة تحليل الذكاء الاصطناعي
    async performAIAnalysis() {
        // محاكاة وقت التحليل
        await new Promise(resolve => setTimeout(resolve, 3000));

        return {
            symbol: this.currentSymbol,
            recommendation: Math.random() > 0.5 ? 'BUY' : 'SELL',
            confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
            entry: this.generateRandomPrice(4160, 4165),
            stopLoss: this.generateRandomPrice(4150, 4155),
            takeProfit1: this.generateRandomPrice(4170, 4175),
            takeProfit2: this.generateRandomPrice(4175, 4180),
            analysis: {
                fundamental: "البنك المركزي الأوروبي يحافظ على السياسات النقدية مع توقعات بنمو اقتصادي معتدل",
                technical: "المؤشرات الفنية تشير إلى استمرار الاتجاه الصاعد مع وجود دعم قوي عند 4150",
                smc: "منطقة السيولة الرئيسية عند 4180 مع وجود أوامر مؤسسية كبيرة",
                session: this.getCurrentTradingSession()
            },
            riskReward: "1:1.5",
            timeFrame: "H1-H4"
        };
    }

    generateRandomPrice(min, max) {
        return (Math.random() * (max - min) + min).toFixed(3);
    }

    getCurrentTradingSession() {
        const hour = new Date().getUTCHours();
        if (hour >= 7 && hour < 16) return "جلسة لندن";
        if (hour >= 13 && hour < 22) return "جلسة نيويورك";
        return "الجلسة الآسيوية";
    }

    // عرض النتائج
    displayResults(result) {
        const resultsContainer = document.getElementById('analysisResults');
        resultsContainer.innerHTML = this.generateResultsHTML(result);
        resultsContainer.classList.remove('hidden');
        
        // scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    generateResultsHTML(result) {
        const isBuy = result.recommendation === 'BUY';
        const confidenceClass = result.confidence >= 80 ? 'high' : 'medium';

        return `
            <div class="trade-card ${isBuy ? 'buy' : 'sell'}">
                <div class="trade-header">
                    <div class="trade-signal ${isBuy ? 'buy' : 'sell'}">
                        ${isBuy ? '🟢 توصية شراء' : '🔴 توصية بيع'} - ${result.symbol}
                    </div>
                    <div class="confidence-circle ${confidenceClass}">
                        ${result.confidence}%
                    </div>
                </div>

                <div class="trade-levels">
                    <div class="level-item">
                        <div class="level-label">سعر الدخول</div>
                        <div class="level-value">${result.entry}</div>
                    </div>
                    <div class="level-item">
                        <div class="level-label">وقف الخسارة</div>
                        <div class="level-value">${result.stopLoss}</div>
                    </div>
                    <div class="level-item">
                        <div class="level-label">الهدف الأول</div>
                        <div class="level-value">${result.takeProfit1}</div>
                    </div>
                    <div class="level-item">
                        <div class="level-label">الهدف الثاني</div>
                        <div class="level-value">${result.takeProfit2}</div>
                    </div>
                </div>

                <div class="risk-metric">
                    <div class="level-label">نسبة المخاطرة/العائد: ${result.riskReward}</div>
                    <div class="risk-bar">
                        <div class="risk-fill" style="width: 60%"></div>
                    </div>
                </div>

                <div class="analysis-details">
                    <h4>📊 تفاصيل التحليل:</h4>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <strong>الأساسي:</strong>
                            <p>${result.analysis.fundamental}</p>
                        </div>
                        <div class="analysis-item">
                            <strong>الفني:</strong>
                            <p>${result.analysis.technical}</p>
                        </div>
                        <div class="analysis-item">
                            <strong>سيولة المؤسسات:</strong>
                            <p>${result.analysis.smc}</p>
                        </div>
                        <div class="analysis-item">
                            <strong>الجلسة:</strong>
                            <p>${result.analysis.session}</p>
                        </div>
                    </div>
                </div>

                <div class="trade-management">
                    <h4>🎯 إدارة الصفقة:</h4>
                    <ul>
                        <li>انقل وقف الخسارة إلى نقطة التعادل بعد تحقيق الهدف الأول</li>
                        <li>اختر نصف الكمية عند الهدف الأول والنصف الآخر عند الهدف الثاني</li>
                        <li>راقب أخبار ${this.getCurrencyFromSymbol(result.symbol)} خلال الجلسة</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getCurrencyFromSymbol(symbol) {
        const currencies = {
            'XAUUSD': 'الذهب',
            'EURUSD': 'اليورو',
            'GBPUSD': 'الجنيه الإسترليني',
            'USDJPY': 'الين الياباني',
            'USOIL': 'النفط'
        };
        return currencies[symbol] || symbol;
    }

    showError(message) {
        alert(`❌ ${message}`);
    }
}

// تهيئة التطبيق
const fxEngine = new FXDecodEngine();

// دالة بدء التحليل (للاستدعاء من الزر)
function startAnalysis() {
    // تحديث الإعدادات الحالية
    fxEngine.currentSymbol = document.getElementById('symbolSelect').value;
    fxEngine.currentTimeframe = document.getElementById('timeframeSelect').value;
    fxEngine.currentStrategy = document.getElementById('strategySelect').value;
    
    fxEngine.startAnalysis();
}

// إعدادات إضافية عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تحديث شريط الأسعار تلقائياً
    setInterval(updateTickerPrices, 5000);
});

function updateTickerPrices() {
    const prices = document.querySelectorAll('.ticker-item .price-up, .ticker-item .price-down');
    prices.forEach(priceElement => {
        const currentPrice = parseFloat(priceElement.textContent.split(' ')[0].replace(',', ''));
        const randomChange = (Math.random() - 0.5) * 0.2;
        const newPrice = currentPrice * (1 + randomChange / 100);
        
        if (randomChange > 0) {
            priceElement.className = 'price-up';
            priceElement.textContent = newPrice.toFixed(2) + ' +' + Math.abs(randomChange).toFixed(2) + '%';
        } else {
            priceElement.className = 'price-down';
            priceElement.textContent = newPrice.toFixed(2) + ' ' + randomChange.toFixed(2) + '%';
        }
    });
}
