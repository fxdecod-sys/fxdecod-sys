// /api/analyze.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { AnalysisRequest, AnalysisResponse, ActionType } from "../types";
import { TextGenerationClient } from "@google/generative-ai";

// Helper: Parse JSON from ENV variable
function getServiceAccount() {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!raw) throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS environment variable");
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error("Invalid JSON in GOOGLE_APPLICATION_CREDENTIALS");
  }
}

// Initialize AI Client (singleton)
let aiClient: TextGenerationClient | null = null;
function getAIClient() {
  if (!aiClient) {
    const serviceAccount = getServiceAccount();
    aiClient = new TextGenerationClient({
      authClient: {
        email: serviceAccount.client_email,
        key: serviceAccount.private_key,
      },
    });
    console.log("AI client initialized successfully.");
  }
  return aiClient;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body: AnalysisRequest = req.body || {};
    const pair = body.pair || "EURUSD";

    const client = getAIClient();

    // Example: You can replace this with real Gemini AI call
    // const response = await client.generateText({...});
    // For now, return deterministic mock response
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
  } catch (err: any) {
    console.error("API error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
