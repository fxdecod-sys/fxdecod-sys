import { AnalysisRequest, AnalysisResponse } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

function parseServiceAccount() {
  const rawJson = process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
  const b64 = process.env.GOOGLE_CREDENTIALS_B64 || "";

  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      return JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to parse GOOGLE_CREDENTIALS_B64:", e);
      throw new Error("Invalid GOOGLE_CREDENTIALS_B64");
    }
  }

  if (rawJson) {
    try {
      return JSON.parse(rawJson);
    } catch (e) {
      console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", e);
      throw new Error("Invalid GOOGLE_APPLICATION_CREDENTIALS");
    }
  }

  throw new Error("No Google service account credentials provided");
}

let aiClient: any;
try {
  const serviceAccount = parseServiceAccount();
  if (!serviceAccount || !serviceAccount.client_email || !serviceAccount.private_key) {
    console.error("Service account appears invalid:", {
      client_email: serviceAccount?.client_email,
      has_private_key: Boolean(serviceAccount?.private_key)
    });
    throw new Error("Service account JSON missing client_email or private_key");
  }
  aiClient = new GoogleGenerativeAI({ credentials: serviceAccount });
  console.log("AI client initialized using @google/generative-ai");
} catch (initErr: any) {
  console.error("Initialization error:", initErr);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!aiClient) {
    console.error("aiClient not initialized");
    return res.status(500).json({ error: "Server misconfigured: AI client not initialized. Check logs." });
  }

  try {
    const requestData: AnalysisRequest = req.body;
    if (!requestData || !requestData.pair) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    console.log("Received analyze request for", requestData.pair, requestData.timeframe);

    const aiResponse = await aiClient.chat({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "أنت محلل SMC محترف" },
        { role: "user", content: JSON.stringify(requestData) }
      ],
    });

    // The generative-ai client may return different shapes depending on version.
    const outputText = (aiResponse as any).output_text || (aiResponse as any)?.responses?.[0]?.candidates?.[0]?.content || (aiResponse as any)?.text || "{}";

    console.log("AI output preview:", String(outputText).slice(0, 1000));

    try {
      const data: AnalysisResponse = JSON.parse(outputText);
      return res.status(200).json(data);
    } catch (e) {
      console.error("Failed to parse AI output as JSON:", e);
      // Return raw output under rawOutput to aid debugging
      return res.status(200).json({ rawOutput: outputText });
    }

  } catch (error: any) {
    console.error("AI Error:", error);
    const message = error?.message || String(error);
    if (message.toLowerCase().includes("unauth") || message.includes("401") || message.includes("permission")) {
      return res.status(401).json({ error: "Authentication error with Google API: " + message });
    }
    return res.status(500).json({ error: message });
  }
}
