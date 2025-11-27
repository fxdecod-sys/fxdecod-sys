import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisRequest, AnalysisResponse, ActionType } from "../types";

// Ensure API Key is available
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    pair: { type: Type.STRING },
    currentPrice: { type: Type.NUMBER },
    action: { type: Type.STRING, enum: [ActionType.BUY, ActionType.SELL, ActionType.NEUTRAL] },
    entry: { type: Type.NUMBER },
    stopLoss: { type: Type.NUMBER },
    takeProfit1: { type: Type.NUMBER },
    takeProfit2: { type: Type.NUMBER },
    takeProfit3: { type: Type.NUMBER },
    confidence: { type: Type.NUMBER },
    riskRewardRatio: { type: Type.STRING },
    smcContext: { type: Type.STRING },
    fundamentalAnalysis: { type: Type.STRING },
    correlationNote: { type: Type.STRING },
    supportResistance: {
      type: Type.OBJECT,
      properties: {
        supports: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        resistances: { type: Type.ARRAY, items: { type: Type.NUMBER } },
      }
    }
  },
  required: [
    "pair", "currentPrice", "action", "entry", "stopLoss", 
    "takeProfit1", "takeProfit2", "takeProfit3", "confidence", 
    "smcContext", "fundamentalAnalysis", "correlationNote", "supportResistance"
  ]
};

export const analyzeMarket = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  if (!API_KEY) {
    throw new Error("Missing API Key. Please configure process.env.API_KEY in your environment.");
  }

  // 1. Context Gathering
  const now = new Date();
  const utcTime = now.toUTCString();
  const utcHour = now.getUTCHours();
  
  let session = "Asian Session";
  if (utcHour >= 7 && utcHour < 13) session = "London Session";
  if (utcHour >= 13 && utcHour < 21) session = "New York Session";

  // 2. Prompt Engineering
  const prompt = `
    Act as a Senior Institutional SMC (Smart Money Concepts) Analyst.
    
    Context:
    - Pair: ${request.pair}
    - Timeframe: ${request.timeframe}
    - Strategy: ${request.strategy}
    - Current Time (UTC): ${utcTime}
    - Market Session: ${session}

    Task:
    1. Use the 'googleSearch' tool to find the LATEST LIVE price for ${request.pair}. Do not estimate.
    2. Search for the most recent high-impact economic news from the last 6 hours affecting this pair.
    3. If the pair is XAUUSD (Gold), you MUST check DXY (Dollar Index) and US 10Y Bond Yields for correlation.
    4. Analyze market structure using SMC (Order Blocks, Fair Value Gaps, Liquidity Sweeps).
    5. Determine a trade setup:
       - If conditions are unclear, set action to NEUTRAL.
       - If BUY/SELL:
         - Entry: Current Price or nearest Order Block.
         - Stop Loss (SL): Below/Above recent swing structure.
         - Take Profit 1 (TP1): STRICTLY calculate TP1 so that Reward = Risk (1:1 Ratio). Formula: Entry + (Entry - SL) for Buy, Entry - (SL - Entry) for Sell.
         - TP2 and TP3: Extended targets at next liquidity pools.
    
    Output Requirement:
    - Return ONLY valid JSON matching the schema provided.
    - 'confidence' should be a number between 0 and 100.
    - 'fundamentalAnalysis' should be a concise summary of news impact.
    - 'smcContext' should explain the technical reason (e.g., "Retest of bullish Order Block on 1H").
  `;

  try {
    const modelId = "gemini-2.5-flash"; // Using 2.5 Flash for speed and grounding capabilities

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1 // Low temperature for analytical precision
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(textResponse) as AnalysisResponse;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};