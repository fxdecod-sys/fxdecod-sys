// /api/analyze.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { AnalysisRequest, AnalysisResponse, ActionType } from "../types";
import { TextServiceClient } from "@google/generative-ai";

// Helper function to initialize AI client
function initAiClient() {
  const saJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!saJson) throw new Error("GOOGLE_APPLICATION_CREDENTIALS not found in ENV.");

  let credentials;
  try {
    credentials = JSON.parse(saJson);
  } catch (err) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not valid JSON.");
  }

  return new TextServiceClient({ credentials });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let aiClient: TextServiceClient;
  try {
    aiClient = initAiClient();
  } catch (err: any) {
    console.error("AI Client initialization error:", err.message);
    return res.status(500).json({ error: `AI Client init failed: ${err.message}` });
  }

  try {
    const body: AnalysisRequest = req.body || {};
    const pair = body.pair || "EURUSD";

    // Example: mock response, replace with real call if needed
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

    // هنا ممكن تضيف استدعاء حقيقي للـ aiClient إذا بدك
    return res.status(200).json(mock);
  } catch (err: any) {
    console.error("API handler error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
