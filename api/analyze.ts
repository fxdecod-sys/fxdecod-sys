// /api/analyze.ts
import type { NextApiRequest, NextApiResponse } from "next";

interface AnalysisResponse {
  pair: string;
  currentPrice: number;
  action: "BUY" | "SELL" | "NEUTRAL";
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  confidence: number;
  note?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const pair = body.pair || "EURUSD";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GOOGLE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Provide a trading analysis for ${pair} in JSON format with fields: pair, currentPrice, action, entry, stopLoss, takeProfit1, takeProfit2, takeProfit3, confidence.`,
          maxOutputTokens: 200,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API Error:", errorText);
      return res.status(500).json({ error: `Google API Error: ${errorText}` });
    }

    const data = await response.json();

    // اذا API رجع شيء غير متوقع نرجع fallback
    const fallback: AnalysisResponse = {
      pair,
      currentPrice: 1.12345,
      action: "NEUTRAL",
      entry: 1.12345,
      stopLoss: 1.1200,
      takeProfit1: 1.1269,
      takeProfit2: 1.1300,
      takeProfit3: 1.1350,
      confidence: 60,
      note: "Fallback mock response"
    };

    return res.status(200).json(data?.candidates?.[0]?.content ? JSON.parse(data.candidates[0].content) : fallback);
  } catch (err: any) {
    console.error("Handler Error:", err);
    const fallback: AnalysisResponse = {
      pair,
      currentPrice: 1.12345,
      action: "NEUTRAL",
      entry: 1.12345,
      stopLoss: 1.1200,
      takeProfit1: 1.1269,
      takeProfit2: 1.1300,
      takeProfit3: 1.1350,
      confidence: 60,
      note: `Fallback due to error: ${err.message}`
    };
    return res.status(500).json(fallback);
  }
}
