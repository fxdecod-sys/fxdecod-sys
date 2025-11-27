import { AnalysisRequest, AnalysisResponse, ActionType } from "../types";

/**
 * Temporary mock API so frontend works while we fix real credentials.
 * Returns a deterministic AnalysisResponse matching types.ts
 */

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body: AnalysisRequest = req.body || {};
    const pair = body.pair || "EURUSD";

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
        resistances: [1.1269, 1.1300]
      }
    };

    return res.status(200).json(mock);
  } catch (err: any) {
    console.error("Mock API error:", err);
    return res.status(500).json({ error: String(err) });
  }
}
