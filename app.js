import { analyzeMarket } from './api.js';

// --- Constants ---
const WIDGET_CONFIG = {
    locale: "en",
    theme: "dark"
};

// --- DOM Elements ---
const analyzeBtn = document.getElementById('analyze-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const resultsContainer = document.getElementById('results-container');
const pairSelect = document.getElementById('pair-select');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadTickerTape();
    loadMainChart('XAUUSD');
    loadTechnicalGauge('XAUUSD');
    loadHeatmap();
    loadCalendar();
});

// --- Event Listeners ---
pairSelect.addEventListener('change', (e) => {
    const newPair = e.target.value;
    loadMainChart(newPair);
    loadTechnicalGauge(newPair);
});

analyzeBtn.addEventListener('click', async () => {
    const pair = pairSelect.value;
    const timeframe = document.getElementById('timeframe-select').value;
    const strategy = document.getElementById('strategy-select').value;

    // UI Loading State
    setLoading(true);
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('hidden');

    try {
        const data = await analyzeMarket(pair, timeframe, strategy);
        renderResults(data);
        resultsContainer.classList.remove('hidden');
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        alert("فشل التحليل. تأكد من مفتاح API أو حاول مرة أخرى.\n" + error.message);
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        analyzeBtn.disabled = true;
        analyzeBtn.classList.add('opacity-75', 'cursor-not-allowed');
        btnText.textContent = 'جاري التحليل...';
        btnSpinner.classList.remove('hidden');
    } else {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        btnText.textContent = 'ابدأ التحليل الذكي';
        btnSpinner.classList.add('hidden');
    }
}

// --- Render Logic ---
function renderResults(data) {
    const isBuy = data.signal === 'BUY';
    const isNeutral = data.signal === 'NEUTRAL';
    const colorClass = isNeutral ? 'gray' : isBuy ? 'emerald' : 'rose';
    const typeText = isNeutral ? 'حيادي (NEUTRAL)' : isBuy ? 'شراء (BUY)' : 'بيع (SELL)';
    
    // Calculate visual widths for the Risk bar
    const range = Math.abs(data.tp2 - data.sl);
    const slPct = isNeutral ? 0 : Math.min(((Math.abs(data.entry - data.sl)) / range) * 100, 30);
    const tp1Pct = isNeutral ? 0 : Math.min(((Math.abs(data.tp1 - data.entry)) / range) * 100, 30);

    const html = `
    <!-- 1. Trade Card -->
    <div class="bg-slate-800 border-t-4 border-${colorClass}-500 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
        <!-- Header -->
        <div class="bg-${colorClass}-500/10 p-4 border-b border-slate-700 flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-bold text-${colorClass}-400">${typeText}</h2>
                <div class="text-sm text-gray-400 mt-1">${data.pair} @ ${data.price}</div>
            </div>
            <div class="text-center">
                <div class="text-xs text-gray-500 mb-1">نسبة الثقة</div>
                <div class="text-xl font-bold text-white">${data.confidence}%</div>
            </div>
        </div>

        <!-- Numbers Grid -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700 order-2 md:order-1">
                <div class="text-xs text-gray-500 mb-1">دخول (Entry)</div>
                <div class="text-xl font-mono font-bold text-blue-400">${data.entry}</div>
            </div>
            <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700 order-1 md:order-2 relative overflow-hidden">
                <div class="absolute right-0 top-0 h-full w-1 bg-rose-500"></div>
                <div class="text-xs text-gray-500 mb-1">وقف خسارة (SL)</div>
                <div class="text-xl font-mono font-bold text-rose-400">${data.sl}</div>
            </div>
            <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700 order-3 relative overflow-hidden">
                <div class="absolute left-0 top-0 h-full w-1 bg-emerald-500"></div>
                <div class="text-xs text-gray-500 mb-1">هدف أول (TP1)</div>
                <div class="text-xl font-mono font-bold text-emerald-400">${data.tp1}</div>
            </div>
        </div>

        <!-- Visual Bar -->
        ${!isNeutral ? `
        <div class="px-6 pb-2">
            <div class="h-4 bg-slate-700 rounded-full flex overflow-hidden text-[9px] font-bold text-white relative">
                 <div style="width: ${slPct}%; order: ${isBuy ? 1 : 3}" class="bg-rose-500/80 flex items-center justify-center">RISK</div>
                 <div style="width: 2px; order: 2" class="bg-white h-full z-10"></div>
                 <div style="width: ${tp1Pct}%; order: ${isBuy ? 3 : 1}" class="bg-emerald-500/80 flex items-center justify-center">TP1</div>
                 <div class="flex-1 bg-emerald-500/30 flex items-center justify-center" style="order: ${isBuy ? 4 : 0}">TP2/TP3</div>
            </div>
            <div class="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                <span>${isBuy ? data.sl : data.tp3}</span>
                <span>Entry</span>
                <span>${isBuy ? data.tp3 : data.sl}</span>
            </div>
        </div>
        ` : ''}

        <!-- Targets & Management -->
        <div class="p-6 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="text-sm font-bold text-emerald-400 mb-2">الأهداف الممتدة:</h4>
                <div class="flex gap-4 text-sm font-mono text-gray-300">
                    <span>TP2: <b class="text-emerald-300">${data.tp2}</b></span>
                    <span>TP3: <b class="text-emerald-300">${data.tp3}</b></span>
                </div>
            </div>
            <div>
                <h4 class="text-sm font-bold text-amber-400 mb-2">إدارة الصفقة:</h4>
                <p class="text-xs text-gray-300 leading-relaxed bg-slate-900 p-2 rounded">${data.management}</p>
            </div>
        </div>
    </div>

    <!-- 2. Analysis Card -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Fundamental -->
        <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                <span class="text-blue-500">●</span> التحليل الأساسي
            </h3>
            <p class="text-sm text-gray-400 leading-relaxed">${data.summary}</p>
            <div class="mt-3 pt-3 border-t border-slate-800">
                <h4 class="text-xs font-bold text-indigo-400 mb-1">الارتباطات:</h4>
                <p class="text-xs text-gray-500">${data.correlations}</p>
            </div>
        </div>

        <!-- Technical -->
        <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                <span class="text-purple-500">●</span> الأسباب الفنية (SMC)
            </h3>
            <ul class="space-y-2">
                ${data.technical_reasoning.map(r => `<li class="text-sm text-gray-400 flex items-start gap-2"><span class="text-purple-500 mt-1">▪</span> ${r}</li>`).join('')}
            </ul>
        </div>
    </div>

    <!-- 3. Levels -->
    <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
        <h3 class="text-sm text-white font-bold mb-4">مناطق الدعم والمقاومة</h3>
        <div class="flex justify-center gap-8 text-sm font-mono">
            <div class="text-rose-400">
                <div class="text-[10px] text-gray-500">RESISTANCE</div>
                ${data.levels.r.slice().reverse().map(l => `<div>${l}</div>`).join('')}
            </div>
            <div class="flex flex-col justify-center">
                <div class="text-blue-400 font-bold text-lg animate-pulse">${data.price}</div>
            </div>
            <div class="text-emerald-400">
                <div class="text-[10px] text-gray-500">SUPPORT</div>
                ${data.levels.s.map(l => `<div>${l}</div>`).join('')}
            </div>
        </div>
    </div>
    `;
    
    resultsContainer.innerHTML = html;
}

// --- TradingView Injectors ---

function loadTickerTape() {
    injectScript('ticker-tape-container', 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js', {
        "symbols": [
            {"proName": "FOREXCOM:SPX500", "title": "S&P 500"},
            {"proName": "FOREXCOM:XAUUSD", "title": "Gold"},
            {"proName": "FX_IDC:EURUSD", "title": "EUR/USD"},
            {"proName": "BITSTAMP:BTCUSD", "title": "Bitcoin"},
            {"proName": "TVC:DXY", "title": "DXY"}
        ],
        "showSymbolLogo": true,
        "isTransparent": true,
        "displayMode": "adaptive",
        "colorTheme": "dark",
        "locale": "en"
    });
}

function loadMainChart(symbol) {
    // Clean symbol (remove slash if needed, though TradingView is smart)
    const tvSymbol = symbol.replace('/', '');
    // Reset container
    const container = document.getElementById('main-chart-container');
    container.innerHTML = '';
    
    // Create new div for widget inside container (required by advanced chart)
    const widgetDiv = document.createElement('div');
    widgetDiv.id = 'tv-chart-widget';
    widgetDiv.style.height = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.onload = () => {
        new TradingView.widget({
            "autosize": true,
            "symbol": tvSymbol,
            "interval": "60",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "allow_symbol_change": true,
            "container_id": "tv-chart-widget"
        });
    };
    container.appendChild(script);
}

function loadTechnicalGauge(symbol) {
    const tvSymbol = symbol.replace('/', '');
    injectScript('technical-gauge-container', 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js', {
        "interval": "1h",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": `FOREXCOM:${tvSymbol}`, // Best guess prefix
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
    });
}

function loadHeatmap() {
    injectScript('heatmap-container', 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js', {
        "width": "100%",
        "height": "100%",
        "currencies": ["EUR","USD","JPY","GBP","CHF","AUD","CAD","NZD"],
        "isTransparent": true,
        "colorTheme": "dark",
        "locale": "en"
    });
}

function loadCalendar() {
    injectScript('calendar-container', 'https://s3.tradingview.com/external-embedding/embed-widget-events.js', {
        "colorTheme": "dark",
        "isTransparent": true,
        "width": "100%",
        "height": "100%",
        "locale": "ar_AE",
        "importanceFilter": "0,1",
        "currencyFilter": "USD,EUR,GBP,JPY,CAD"
    });
}

function injectScript(containerId, src, config) {
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