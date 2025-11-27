import { NextApiRequest, NextApiResponse } from "next";
import { AnalysisRequest, AnalysisResponse, ActionType } from "../types";
import { TextServiceClient } from "@google/generative-ai";

let aiClient: TextServiceClient | null = null;

function getClient(): TextServiceClient {
  if (!aiClient) {
    try {
      aiClient = new TextServiceClient({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
    } catch (err: any) {
      console.error("Failed to initialize AI client:", err.message || err);
      throw new Error("Initialization failed: " + (err.message || err));
    }
  }
  return aiClient;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Only POST requests are accepted." });
  }

  const body: AnalysisRequest = req.body || {};
  const pair = body.pair || "EURUSD";

  let client: TextServiceClient;
  try {
    client = getClient();
  } catch (err: any) {
    return res.status(500).json({ error: "AI client initialization error: " + err.message });
  }

  try {
    // مثال: مجرد mock response للتجربة
    const mock: AnalysisResponse = {
      pair,
      currentPrice: 1.12345,
      action: ActionType.NEUTRAL,
      entry: 1.12345,
      stopLoss: 1.12000,
      takeProfit1: 1.12690,
      takeProfit2: 1.13000,
      takeProfit3: 1.13500,
      confidence: 60,
      riskRewardRatio: "1:1",
      smcContext: "Mock: retest of order block on 1H",
      fundamentalAnalysis: "Mock: no high-impact news in last 6h",
      correlationNote: "Mock: correlation not checked",
      supportResistance: {
        supports: [1.1200, 1.1150],
        resistances: [1.1269, 1.1300],
      },
    };

    return res.status(200).json(mock);

    // لاحقًا تقدر تحل الـ mock وتستبدلها باستدعاء حقيقي لـ Google API:
    // const response = await client.generateText({ model: "models/text-bison-001", prompt: "..." });
  } catch (err: any) {
    console.error("AI request error:", err.message || err);
    return res.status(500).json({ error: "AI request failed: " + (err.message || err) });
  }
}
