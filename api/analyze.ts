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
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const pair = body.pair || "EURUSD";

    // جرب الاتصال بموديل Google Generative Language API مباشرة
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GOOGLE_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Provide a trading analysis for ${pair} in JSON format`,
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

    // Example response fallback
    const mock: AnalysisResponse = {
      pair,
      currentPrice: 1.12345,
      action: "NEUTRAL",
      entry: 1.12345,
      stopLoss: 1.1200,
      takeProfit1: 1.1269,
      takeProfit2: 1.1300,
      takeProfit3: 1.1350,
      confidence: 60,
    };

    return res.status(200).json(data || mock);
  } catch (err: any) {
    console.error("Handler Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
