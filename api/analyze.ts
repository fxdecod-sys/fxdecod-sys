import { AnalysisRequest, AnalysisResponse } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// نحول JSON حساب الخدمة المخزن بالـ ENV إلى كائن JS
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}");

const aiClient = new GoogleGenerativeAI({
  credentials: serviceAccount,
});

export default async function handler(req: any, res: any) {
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
