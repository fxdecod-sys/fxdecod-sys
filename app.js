// --- CONFIGURATION ---
// ⚠️ Put your Gemini API Key here inside the quotes
const API_KEY = ""; 

// --- APP LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    // Check API Key
    if (!API_KEY) {
        alert("تنبيه: لم يتم وضع مفتاح API Key في ملف app.js. لن يعمل التحليل.");
    }

    // Initialize Widgets
    loadTickerTape();
    loadMainChart('XAUUSD');
    loadTechnicalGauge('XAUUSD');
    loadHeatmap();
    loadCalendar();

    // Event Listeners
    document.getElementById('pair-select').addEventListener('change', (e) => {
        const newPair = e.target.value;
        loadMainChart(newPair);
        loadTechnicalGauge(newPair);
    });

    document.getElementById('analyze-btn').addEventListener('click', runAnalysis);
});

// --- GEMINI ANALYSIS FUNCTION (Direct Fetch) ---
async function runAnalysis() {
    if (!API_KEY) {
        alert("الرجاء وضع مفتاح API Key في الكود أولاً.");
        return;
    }

    const pair = document.getElementById('pair-select').value;
    const timeframe = document.getElementById('timeframe-select').value;
    const strategy = document.getElementById('strategy-select').value;

    toggleLoading(true);

    // Prepare Prompt
    const hour = new Date().getUTCHours();
    let session = "Asian";
    if (hour >= 7 && hour < 13) session = "London";
    if (hour >= 13 && hour < 17) session = "London/NY Overlap";
    if (hour >= 17 && hour < 21) session = "New York";

    // Correlation logic
    let corrText = "Analyze correlations with DXY.";
    if(pair.includes('XAU')) corrText = "MUST analyze DXY and US10Y Yields as they inversely affect Gold.";
    if(pair.includes('OIL')) corrText = "MUST analyze Oil inventories and CAD currency strength.";

    const prompt = `
    Role: Senior SMC Institutional Trader.
    Task: Analyze ${pair} (${timeframe}) - ${strategy} style.
    Session: ${session}.
    
    INSTRUCTIONS:
    1. Use Google Search to get LIVE Price & News (Past 6 hours).
    2. STRICT MATH: TP1 must be exactly 1:1 Risk/Reward. (Entry +/- SL distance).
    3. SMC: Identify Order Blocks & Liquidity Sweeps.
    4. ${corrText}

    OUTPUT JSON ONLY (No Markdown):
    {
        "signal": "BUY", "confidence": 85,
        "entry": 0.0, "sl": 0.0, "tp1": 0.0, "tp2": 0.0, "tp3": 0.0,
        "price": "0.0",
        "summary": "Fundamental summary in Arabic",
        "reasoning": ["Tech reason 1 (Arabic)", "Tech reason 2 (Arabic)"],
        "levels": { "s": [0,0,0], "r": [0,0,0] },
        "management": "Trade management tip in Arabic"
    }
    `;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    tools: [{ googleSearch: {} }] // Enable Google Search Grounding
                })
            }
        );

        if (!response.ok) throw new Error("API Request Failed");
        
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) throw new Error("No response from AI");

        // Clean JSON
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);

        renderResults(data, pair);

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء التحليل. تأكد من المفتاح أو الاتصال بالإنترنت.");
    } finally {
        toggleLoading(false);
    }
}

// --- UI HELPERS ---

function toggleLoading(isLoading) {
    const btn = document.getElementById('analyze-btn');
    const loadingView = document.getElementById('loading-view');
    const resultsContainer = document.getElementById('results-container');
    const btnSpinner = document.getElementById('btn-spinner');
    const btnText = document.getElementById('btn-text');

    if (isLoading) {
        btn.disabled = true;
        btn.classList.add('opacity-70');
        btnText.innerText = "جاري التحليل...";
        btnSpinner.classList.remove('hidden');
        loadingView.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-70');
        btnText.innerText = "ابدأ التحليل الذكي";
        btnSpinner.classList.add('hidden');
        loadingView.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
    }
}

function renderResults(data, pair) {
    const container = document.getElementById('results-container');
    
    // Determine Colors
    const isBuy = data.signal === 'BUY';
    const color = isBuy ? 'emerald' : 'rose'; // green or red
    const typeAr = isBuy ? 'شراء (BUY)' : 'بيع (SELL)';

    // Build HTML
    const html = `
    <!-- Signal Card -->
    <div class="bg-slate-800 border-t-4 border-${color}-500 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div class="bg-${color}-500/10 p-4 border-b border-slate-700 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-${color}-400">${typeAr}</h2>
                <div class="text-sm text-gray-400">${pair} @ ${data.price}</div>
            </div>
            <div class="text-center">
                <div class="text-xs text-gray-500">الثقة</div>
                <div class="text-xl font-bold text-white">${data.confidence}%</div>
            </div>
        </div>

        <div class="p-6 grid grid-cols-3 gap-4 text-center font-mono">
            <div class="bg-slate-900/50 p-3 rounded border border-slate-700">
                <div class="text-xs text-gray-500">Entry</div>
                <div class="text-blue-400 font-bold text-lg">${data.entry}</div>
            </div>
            <div class="bg-slate-900/50 p-3 rounded border border-slate-700 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-1 h-full bg-rose-500"></div>
                <div class="text-xs text-gray-500">Stop Loss</div>
                <div class="text-rose-400 font-bold text-lg">${data.sl}</div>
            </div>
            <div class="bg-slate-900/50 p-3 rounded border border-slate-700 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div class="text-xs text-gray-500">TP1</div>
                <div class="text-emerald-400 font-bold text-lg">${data.tp1}</div>
            </div>
        </div>
        
        <div class="px-6 pb-6 pt-2 flex justify-between text-sm text-gray-300 border-t border-slate-700 mt-4">
             <div>TP2: <span class="text-emerald-300 font-mono">${data.tp2}</span></div>
             <div>TP3: <span class="text-emerald-300 font-mono">${data.tp3}</span></div>
        </div>
    </div>

    <!-- Analysis Text -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <h3 class="font-bold text-white mb-2">📊 التحليل الأساسي</h3>
            <p class="text-sm text-gray-400 leading-relaxed">${data.summary}</p>
        </div>
        <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <h3 class="font-bold text-white mb-2">📈 الأسباب الفنية</h3>
            <ul class="space-y-2">
                ${data.reasoning.map(r => `<li class="text-sm text-gray-400 flex gap-2"><span class="text-blue-500">•</span> ${r}</li>`).join('')}
            </ul>
        </div>
    </div>
    
    <!-- Management -->
    <div class="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h3 class="text-sm font-bold text-amber-400 mb-1">💡 إدارة الصفقة</h3>
        <p class="text-sm text-gray-300">${data.management}</p>
    </div>
    `;

    container.innerHTML = html;
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth' });
}

// --- TRADINGVIEW INJECTORS ---

function injectWidget(containerId, src, config) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    container.appendChild(script);
}

function loadTickerTape() {
    injectWidget('ticker-tape-container', 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js', {
        "symbols": [
            {"proName": "FOREXCOM:SPX500", "title": "S&P 500"},
            {"proName": "FOREXCOM:XAUUSD", "title": "Gold"},
            {"proName": "FX_IDC:EURUSD", "title": "EUR/USD"},
            {"proName": "BITSTAMP:BTCUSD", "title": "Bitcoin"},
            {"proName": "TVC:DXY", "title": "DXY"}
        ],
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "en"
    });
}

function loadMainChart(pair) {
    const container = document.getElementById('main-chart-container');
    if (!container) return;
    container.innerHTML = ''; // Clear previous

    // Advanced Chart requires a specific ID target inside
    const widgetDiv = document.createElement('div');
    widgetDiv.id = 'tv_chart_div';
    widgetDiv.style.height = '100%';
    container.appendChild(widgetDiv);

    // Wait for TV library to be available
    if (window.TradingView) {
        new TradingView.widget({
            "autosize": true,
            "symbol": pair.replace('/', ''),
            "interval": "60",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "allow_symbol_change": true,
            "container_id": "tv_chart_div"
        });
    } else {
        // Retry if library not loaded yet
        setTimeout(() => loadMainChart(pair), 500);
    }
}

function loadTechnicalGauge(pair) {
    injectWidget('technical-gauge-container', 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js', {
        "interval": "1h",
        "width": "100%",
        "height": "100%",
        "symbol": `FOREXCOM:${pair.replace('/', '')}`,
        "showIntervalTabs": true,
        "locale": "en",
        "colorTheme": "dark",
        "isTransparent": true
    });
}

function loadHeatmap() {
    injectWidget('heatmap-container', 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js', {
        "width": "100%",
        "height": "100%",
        "currencies": ["EUR","USD","JPY","GBP","CAD"],
        "isTransparent": true,
        "colorTheme": "dark",
        "locale": "en"
    });
}

function loadCalendar() {
    injectWidget('calendar-container', 'https://s3.tradingview.com/external-embedding/embed-widget-events.js', {
        "width": "100%",
        "height": "100%",
        "colorTheme": "dark",
        "isTransparent": true,
        "locale": "ar_AE",
        "importanceFilter": "0,1",
        "currencyFilter": "USD,EUR,GBP,JPY,CAD"
    });
}