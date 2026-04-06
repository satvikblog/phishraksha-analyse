export type RiskLevel = "Low" | "Medium" | "High";

export interface AnalysisRequest {
  subject: string;
  email_text: string;
  sender: string;
  receiver: string;
}

export interface AnalysisResponse {
  urls_analyzed: string[];
  total_urls: number;
  ai_score: number;
  vt_malicious_total: number;
  vt_suspicious_total: number;
  final_risk: RiskLevel;
  confidence_score: number;
  reasons: string[];
  suspicious_indicators: string[];
}

export type ValidationErrors = Partial<Record<keyof AnalysisRequest, string>>;

export interface ApiErrorResponse {
  message: string;
  details?: string;
}

export interface DownloadReport {
  generatedAt: string;
  request: AnalysisRequest;
  response: AnalysisResponse;
}
