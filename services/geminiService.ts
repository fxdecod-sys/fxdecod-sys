import { GoogleGenAI } from "@google/genai";
import { MarketAnalysis, Timeframe, StrategyStyle } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMarket = async (pair: string, timeframe: Timeframe, strategy: StrategyStyle): Promise<MarketAnalysis> => {
  const modelId = "gemini-2.5-flash";

  // Determine current market session roughly (UTC based)
  const hour = new Date().getUTCHours();
  let session = "Asian Session";
  if (hour >= 7 && hour < 13) session = "London Session";
  if (hour >= 13 && hour < 17) session = "London/New York Overlap";
  if (hour >= 17 && hour < 21) session = "New York Session";

  const correlationPrompt = pair.includes('XAU') || pair.includes('GOLD') 
    ? "يجب عليك تحليل مؤشر الدولار (DXY) وعوائد السندات الأمريكية (US10Y) لأنها تؤثر بشدة على الذهب." 
    : "قم بتحليل ارتباط العملة الأساسية بمؤشر الدولار أو السلع ذات الصلة.";

  const prompt = `
    أنت خبير فوركس محترف (Senior FX Analyst) ومحلل مؤسسي (SMC).
    الوقت الحالي (UTC): ${hour}:00.
    الجلسة الحالية المقدرة: ${session}.
    
    المهمة: تحليل شامل لزوج: ${pair}.
    الإطار الزمني: ${timeframe}.
    أسلوب التداول المطلوب: ${strategy}.
    
    التعليمات الخاصة (Smart Trader Logic):
    1. **قاعدة الـ 1:1 الصارمة**: الهدف الأول (TP1) *يجب* أن يحقق عائد 1:1 تماماً مع المخاطرة. 
       - معادلة الشراء: TP1 = Entry + (Entry - StopLoss).
       - معادلة البيع: TP1 = Entry - (StopLoss - Entry).
    2. **إدارة الصفقة**: قدم 3 نصائح محددة لإدارة هذه الصفقة (مثلاً: متى يتم نقل الستوب للدخول؟ هل يوجد خبر قادم يجب الحذر منه؟).
    3. **البيانات الحية**: استخدم Google Search لجمع السعر الحالي بدقة، الأخبار العاجلة خلال الـ 6 ساعات الماضية.
    4. **التمركز المؤسسي**: ابحث عن مناطق العرض والطلب (Order Blocks).

    المخرجات المطلوبة (JSON فقط):
    {
      "pair": "${pair}",
      "currentPrice": number,
      "session": "${session}",
      "trend": "UP" | "DOWN" | "SIDEWAYS",
      "fundamentals": {
        "summary": "تحليل للوضع الأساسي وتأثير الأخبار السياسية/الاقتصادية الحالية",
        "impactLevel": "HIGH" | "MEDIUM" | "LOW",
        "newsPoints": ["خبر 1", "خبر 2"],
        "upcomingEvents": ["حدث متوقع 1", "حدث متوقع 2"]
      },
      "technicals": {
        "rsi": number,
        "macd": "وصف دقيق للتقاطع",
        "mas": "وضع السعر بالنسبة لـ EMA 50 و EMA 200",
        "patterns": ["اسم النموذج الفني"],
        "institutionalBias": "وصف لمناطق السيولة أو الـ Order Blocks",
        "indicators": [
           { "name": "RSI (14)", "value": number, "signal": "BUY" | "SELL" | "NEUTRAL" },
           { "name": "Trend Strength", "value": "Strong/Weak", "signal": "BUY" | "SELL" | "NEUTRAL" },
           { "name": "Volume", "value": "High/Low", "signal": "BUY" | "SELL" | "NEUTRAL" }
        ]
      },
      "correlations": [
        { "asset": "DXY/Oil/Other", "correlation": "Inverse/Direct", "details": "شرح قصير" }
      ],
      "levels": {
        "support": [number, number, number],
        "resistance": [number, number, number]
      },
      "setup": {
        "type": "BUY" | "SELL" | "NEUTRAL",
        "entry": number,
        "stopLoss": number,
        "tp1": number,
        "tp2": number,
        "tp3": number,
        "riskRewardRatio": "1:X (Overall)",
        "confidence": number,
        "reasoning": ["سبب فني 1", "سبب أساسي 1", "تأكيد من الارتباط"],
        "managementTips": ["نصيحة 1 (مثلاً: انقل الستوب للدخول عند TP1)", "نصيحة 2 (إغلاق جزئي)", "نصيحة 3"]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for more precise math
      },
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("Empty response");

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");

    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Safety check for grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null)
      .filter(Boolean);

    return {
      ...parsedData,
      sources,
      timestamp: new Date().toISOString(),
    } as MarketAnalysis;

  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};