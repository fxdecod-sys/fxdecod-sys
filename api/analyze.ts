import { AnalysisRequest } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

function tryParseServiceAccount() {
  const rawJson = process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
  const b64 = process.env.GOOGLE_CREDENTIALS_B64 || "";

  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      const parsed = JSON.parse(decoded);
      return { ok: true, source: "GOOGLE_CREDENTIALS_B64", parsed };
    } catch (e: any) {
      return { ok: false, source: "GOOGLE_CREDENTIALS_B64", error: String(e) };
    }
  }

  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      return { ok: true, source: "GOOGLE_APPLICATION_CREDENTIALS", parsed };
    } catch (e: any) {
      return { ok: false, source: "GOOGLE_APPLICATION_CREDENTIALS", error: String(e) };
    }
  }

  return { ok: false, source: "none", error: "No credential env var set" };
}

let aiClient: any;
let initError: string | null = null;
try {
  const parsed = tryParseServiceAccount();
  if (!parsed.ok) {
    initError = `parse error (${parsed.source}): ${parsed.error}`;
    console.error("Initialization parse error:", initError);
  } else {
    const sa = parsed.parsed;
    if (!sa.client_email || !sa.private_key) {
      initError = "service account missing client_email or private_key";
      console.error("Service account invalid fields:", {
        client_email: sa.client_email,
        has_private_key: Boolean(sa.private_key),
      });
    } else {
      aiClient = new GoogleGenerativeAI({ credentials: sa });
      console.log("AI client initialized using @google/generative-ai");
    }
  }
} catch (e: any) {
  initError = String(e);
  console.error("Unexpected initialization error:", e);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // If client not initialized, return diagnostic info (safe: no private_key in response)
  if (!aiClient) {
    const parsed = tryParseServiceAccount();
    const diag = {
      aiClientInitialized: false,
      initError,
      envPresent: {
        GOOGLE_APPLICATION_CREDENTIALS: Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        GOOGLE_CREDENTIALS_B64: Boolean(process.env.GOOGLE_CREDENTIALS_B64)
      },
      parsedSource: parsed.source,
      parsedOk: parsed.ok,
      parsedClientEmail: parsed.ok ? (parsed.parsed.client_email || null) : null,
      parsedProjectId: parsed.ok ? (parsed.parsed.project_id || parsed.parsed.project || null) : null,
      // Do NOT return private_key
      note: "For security, private_key is never returned. If parsedOk is false, re-check env var value and encoding."
    };
    console.error("aiClient not initialized - diagnostic:", diag);
    return res.status(500).json({ error: "aiClient not initialized", diagnostic: diag });
  }

  try {
    const requestData: AnalysisRequest = req.body;
    if (!requestData || !requestData.pair) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const aiResponse = await aiClient.chat({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "أنت محلل SMC محترف" },
        { role: "user", content: JSON.stringify(requestData) }
      ],
    });

    const outputText = (aiResponse as any).output_text || (aiResponse as any)?.responses?.[0]?.candidates?.[0]?.content || "{}";

    try {
      return res.status(200).json(JSON.parse(outputText));
    } catch {
      return res.status(200).json({ rawOutput: outputText });
    }
  } catch (err: any) {
    console.error("AI Error:", err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
