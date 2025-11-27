import { GoogleGenAI } from "@google/genai";

// ⚠️ IMPORTANT: REPLACE THIS WITH YOUR GEMINI API KEY
const API_KEY = ""; 

export const analyzeMarket = async (pair, timeframe, strategy) => {
    
    if (!API_KEY || API_KEY === "") {
        alert("يرجى وضع مفتاح API في ملف api.js أولاً!");
        throw new Error("API Key missing");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const modelId = "gemini-2.5-flash";

    // 1. Determine Session
    const hour = new Date().getUTCHours();
    let session = "Asian Session";
    if (hour >= 7 && hour < 13) session = "London Session";
    if (hour >= 13 && hour < 17) session = "London/New York Overlap";
    if (hour >= 17 && hour < 21) session = "New York Session";

    // 2. Correlation Logic
    let correlationInstruction = "حلل الارتباط مع مؤشر الدولار (DXY).";
    if (pair.includes('XAU') || pair.includes('Gold')) {
        correlationInstruction = "إجباري: حلل DXY وعوائد السندات US10Y لأنها تعاكس الذهب.";
    } else if (pair.includes('OIL') || pair.includes('WTI')) {
        correlationInstruction = "إجباري: حلل مخزونات النفط، والتوترات الجيوسياسية، وزوج USDCAD.";
    }

    // 3. Prompt Engineering
    const prompt = `
    Role: Institutional SMC Analyst.
    Task: Analyze ${pair} for a ${strategy} setup on ${timeframe}.
    Current Session: ${session} (UTC ${hour}:00).
    
    RULES:
    1. USE GOOGLE SEARCH TOOL to get the EXACT live price and news from the last 6 hours.
    2. STRICT MATH: TP1 must equal Risk (Entry - SL). 1:1 Ratio.
    3. SMC: Find Liquidity Grabs & Order Blocks.
    4. ${correlationInstruction}

    OUTPUT JSON ONLY (No Markdown, No Text):
    {
        "pair": "${pair}",
        "price": "Live Price",
        "trend": "UP/DOWN/SIDEWAYS",
        "signal": "BUY/SELL/NEUTRAL",
        "confidence": 85,
        "entry": 0.00,
        "sl": 0.00,
        "tp1": 0.00,
        "tp2": 0.00,
        "tp3": 0.00,
        "risk_reward": "1:1 @ TP1",
        "summary": "Brief fundamental summary in Arabic.",
        "technical_reasoning": ["Reason 1 in Arabic", "Reason 2 in Arabic"],
        "management": "One strict rule for managing this trade in Arabic.",
        "levels": {
            "r": [0.00, 0.00, 0.00],
            "s": [0.00, 0.00, 0.00]
        },
        "correlations": "Short text about correlation impact."
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.1
            }
        });

        const text = response.text;
        // Clean Markdown if present
        const jsonStr = text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("AI Error:", error);
        throw error;
    }
};