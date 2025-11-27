import { AnalysisRequest, AnalysisResponse } from "../types";

// This service now connects to our new public Vercel Backend API
// No API Keys are stored here.
export const analyzeMarket = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data as AnalysisResponse;

  } catch (error) {
    console.error("Analysis Service Error:", error);
    throw error;
  }
};