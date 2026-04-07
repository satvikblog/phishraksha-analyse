export type RiskLevel = "Low" | "Medium" | "High";
export type AttackType =
  | "Phishing"
  | "Spear Phishing"
  | "Smishing"
  | "Vishing"
  | (string & {});
export type TargetingLevel = "Mass" | "Targeted" | (string & {});

export interface AnalysisRequest {
  subject: string;
  email_text: string;
  sender: string;
  receiver: string;
}

export interface SmishingRequest {
  sender_name: string;
  sms_text: string;
}

export interface VishingRequest {
  call_from: string;
  call_transcript: string;
}

export interface AnalysisResponse {
  attack_type?: AttackType;
  targeting_level?: TargetingLevel;
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
export type SmishingValidationErrors = Partial<Record<keyof SmishingRequest, string>>;
export type VishingValidationErrors = Partial<Record<keyof VishingRequest, string>>;

export interface ApiErrorResponse {
  message: string;
  details?: string;
}

export interface StoredAnalysisReport<TRequest> {
  generatedAt: string;
  request: TRequest;
  response: AnalysisResponse;
}

export type DownloadReport = StoredAnalysisReport<AnalysisRequest>;
export type SmishingReport = StoredAnalysisReport<SmishingRequest>;
export type VishingReport = StoredAnalysisReport<VishingRequest>;
