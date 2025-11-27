import { AnalysisRequest, AnalysisResponse } from "../types";

export const analyzeMarket = async (
  request: AnalysisRequest
): Promise<AnalysisResponse> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let details = "";
      try {
        const err = await response.json();
        details = err.error || "";
      } catch (_) {}

      throw new Error(`API Error ${response.status}: ${details}`);
    }

    const data = (await response.json()) as AnalysisResponse;
    return data;
  } catch (error) {
    console.error("Analysis Service Error:", error);
    throw error;
  }
};
