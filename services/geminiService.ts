import { AnalysisRequest, AnalysisResponse } from "../types";

export const analyzeMarket = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return await response.json() as AnalysisResponse;
};
