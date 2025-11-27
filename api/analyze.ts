import { AnalysisRequest, AnalysisResponse } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

let aiClient: GoogleGenerativeAI | null = null;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    aiClient = new GoogleGenerativeAI({ credentials: serviceAccount });
  } catch (err) {
    console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", err);
  }
} else {
  console.error("GOOGLE_APPLICATION_CREDENTIALS is not set!");
}

export default async function handler(req: any, res: any) {
  if (!aiClient) {
    return res.status(500).json({ error: "AI client not initialized. Check your Environment Variable." });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const requestData: AnalysisRequest = req.body;

    const aiResponse = await aiClient.chat({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "أنت محلل SMC محترف" },
        { role: "user", content: JSON.stringify(requestData) }
      ],
    });

    const data: AnalysisResponse = JSON.parse(aiResponse.output_text || "{}");
    res.status(200).json(data);

  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
}
