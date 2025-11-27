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

  // Logic for correlations: Explicitly checking for Oil/Energy assets
  let correlationInstruction = "قم بتحليل ارتباط العملة الأساسية بمؤشر الدولار أو السلع ذات الصلة.";
  if (pair.includes('XAU') || pair.includes('GOLD')) {
    correlationInstruction = "يجب عليك تحليل مؤشر الدولار (DXY) وعوائد السندات الأمريكية (US10Y) لأنها تؤثر بشدة على الذهب.";
  } else if (pair.includes('OIL') || pair.includes('WTI') || pair.includes('BRENT')) {
    correlationInstruction = "هذا تحليل للنفط. يجب تحليل مخزونات النفط الأمريكية، وقوة الدولار الكندي (CAD) لأنه مرتبط بالنفط، والتوترات الجيوسياسية الحالية.";
  }

  const prompt = `
    أنت خبير أسواق مالية (Senior Financial Analyst) ومتداول مؤسسي يستخدم مفاهيم المال الذكي (SMC).
    
    معلومات الجلسة:
    - الوقت الحالي (UTC): ${hour}:00
    - الجلسة المقدرة: ${session}
    
    طلب التحليل:
    - الأصل: ${pair}
    - الإطار الزمني: ${timeframe}
    - الأسلوب: ${strategy}

    المهام الإلزامية (Algorithm Rules):
    1. **البحث المباشر (LIVE DATA)**: استخدم أداة Google Search لجلب السعر الحالي بدقة (بالسنت)، وآخر الأخبار السياسية والاقتصادية خلال الـ 6 ساعات الماضية.
    2. **الرياضيات الصارمة (1:1 RR Ratio)**:
       - حساب الهدف الأول (TP1) يجب أن يكون مساوياً للمخاطرة تماماً.
       - معادلة الشراء: TP1 = Entry + (Entry - SL).
       - معادلة البيع: TP1 = Entry - (SL - Entry).
       - هذا شرط غير قابل للتفاوض لضمان إدارة مالية سليمة.
    3. **التحليل الفني (SMC)**: حدد مناطق السيولة (Liquidity Grabs) وكتل الأوامر (Order Blocks).
    4. **الارتباطات**: ${correlationInstruction}

    تنسيق الإجابة (JSON Structure Only):
    يجب أن يكون الرد كود JSON فقط وبدون أي نصوص إضافية، بالحقول التالية:
    {
      "pair": "${pair}",
      "currentPrice": number,
      "session": "${session}",
      "trend": "UP" | "DOWN" | "SIDEWAYS",
      "fundamentals": {
        "summary": "تحليل موجز للأخبار وتأثيرها المباشر",
        "impactLevel": "HIGH" | "MEDIUM" | "LOW",
        "newsPoints": ["عنوان خبر 1", "عنوان خبر 2"],
        "upcomingEvents": ["حدث قادم 1", "حدث قادم 2"]
      },
      "technicals": {
        "rsi": number,
        "macd": "وصف الإشارة",
        "mas": "السعر فوق/تحت المتوسطات",
        "patterns": ["نموذج فني 1", "نموذج فني 2"],
        "institutionalBias": "وصف لتحركات صناع السوق (SMC)",
        "indicators": [
           { "name": "RSI", "value": number, "signal": "BUY" | "SELL" | "NEUTRAL" },
           { "name": "Trend", "value": "Strong/Weak", "signal": "BUY" | "SELL" | "NEUTRAL" },
           { "name": "Volume", "value": "High/Low", "signal": "BUY" | "SELL" | "NEUTRAL" }
        ]
      },
      "correlations": [
        { "asset": "DXY/CAD/Yields", "correlation": "Inverse/Direct", "details": "تفاصيل العلاقة" }
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
        "riskRewardRatio": "1:1 (TP1)",
        "confidence": number,
        "reasoning": ["سبب 1", "سبب 2", "سبب 3"],
        "managementTips": ["نصيحة 1", "نصيحة 2"]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Low temperature for precise math and data
      },
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("Empty response from AI");

    // Extract JSON using Regex
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse analysis data");

    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Process grounding metadata for citations
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
    console.error("Gemini Analysis Error:", error);
    throw new Error("فشل التحليل. يرجى المحاولة مرة أخرى أو التأكد من الرمز.");
  }
};