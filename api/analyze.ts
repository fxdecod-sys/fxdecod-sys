import type { NextApiRequest, NextApiResponse } from "next";
import { AnalysisRequest, AnalysisResponse, ActionType } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --------------------
// Initialize AI client
// --------------------
let aiClient: GoogleGenerativeAI | null = null;

try {
  const credentialsStr = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsStr) throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not set!");

  // Parse the JSON safely
  const serviceAccount = JSON.parse(credentialsStr);

  aiClient = new GoogleGenerativeAI({
    credentials: serviceAccount,
  });

  console.log("AI client initialized successfully.");

} catch (err) {
  console.error("Failed to initialize AI client:", err);
}

// --------------------
// API Handler
// --------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!aiClient) {
    return res.status(500).json({
      error: "AI client not initialized. Check GOOGLE_APPLICATION_CREDENTIALS variable and JSON format."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const requestData: AnalysisRequest = req.body;

    // Example prompt to Gemini 2.5 Flash
    const aiResponse = await aiClient.chat({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "أنت محلل SMC محترف" },
        { role: "user", content: JSON.stringify(requestData) }
      ],
    });

    // Extract JSON output
    const data: AnalysisResponse = JSON.parse(aiResponse.output_text || "{}");

    // Send response
    res.status(200).json(data);

  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
}
