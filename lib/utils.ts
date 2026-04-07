import {
  AnalysisRequest,
  AnalysisResponse,
  RiskLevel,
  SmishingRequest,
  SmishingValidationErrors,
  ValidationErrors,
  VishingRequest,
  VishingValidationErrors,
} from "@/lib/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const riskStyles: Record<
  RiskLevel,
  {
    badge: string;
    chip: string;
    panel: string;
    ring: string;
    meter: string;
  }
> = {
  Low: {
    badge:
      "border-emerald-400/35 bg-emerald-400/12 text-emerald-100 shadow-[0_0_30px_rgba(67,226,139,0.18)]",
    chip: "bg-emerald-400/12 text-emerald-200",
    panel: "from-emerald-400/12 via-emerald-400/4 to-transparent",
    ring: "ring-emerald-400/30",
    meter: "from-emerald-300 via-emerald-400 to-cyan-300",
  },
  Medium: {
    badge:
      "border-amber-300/35 bg-amber-300/12 text-amber-100 shadow-[0_0_30px_rgba(255,191,71,0.18)]",
    chip: "bg-amber-300/12 text-amber-100",
    panel: "from-amber-300/12 via-amber-300/4 to-transparent",
    ring: "ring-amber-300/30",
    meter: "from-amber-200 via-amber-300 to-orange-300",
  },
  High: {
    badge:
      "border-rose-400/35 bg-rose-400/12 text-rose-100 shadow-[0_0_30px_rgba(255,107,131,0.18)]",
    chip: "bg-rose-400/12 text-rose-100",
    panel: "from-rose-400/12 via-rose-400/4 to-transparent",
    ring: "ring-rose-400/30",
    meter: "from-rose-300 via-rose-400 to-fuchsia-300",
  },
};

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function formatPercent(value: number) {
  return `${clampScore(value)}%`;
}

export function getMailClassification(risk: RiskLevel) {
  return risk === "Low" ? "Non-Phishing Mail" : "Phishing Mail";
}

export function getAttackTypeDisplay(attackType?: string) {
  if (typeof attackType !== "string") {
    return "Unknown";
  }

  const normalized = attackType.trim();

  return normalized ? normalized : "Unknown";
}

export function getTargetingLevelDisplay(targetingLevel?: string) {
  if (typeof targetingLevel !== "string") {
    return "Unknown";
  }

  const normalized = targetingLevel.trim();

  return normalized ? normalized : "Unknown";
}

export function getAttackTypeBadgeClass(attackType?: string) {
  const normalized = getAttackTypeDisplay(attackType);

  if (
    normalized === "Spear Phishing" ||
    normalized === "Smishing" ||
    normalized === "Vishing"
  ) {
    return "border-rose-400/35 bg-rose-400/12 text-rose-100";
  }

  if (normalized === "Phishing") {
    return "border-amber-300/35 bg-amber-300/12 text-amber-100";
  }

  return "border-white/14 bg-white/8 text-slate-200";
}

export function getTargetingLevelClass(targetingLevel?: string) {
  const normalized = getTargetingLevelDisplay(targetingLevel);

  if (normalized === "Targeted") {
    return "border-rose-400/30 bg-rose-400/12 text-rose-100 font-semibold";
  }

  if (normalized === "Mass") {
    return "border-white/14 bg-white/8 text-slate-200";
  }

  return "border-white/14 bg-white/6 text-slate-300";
}

export function sanitizeAnalysisRequest(
  input: Partial<Record<keyof AnalysisRequest, unknown>>,
): AnalysisRequest {
  return {
    subject: typeof input.subject === "string" ? input.subject.trim() : "",
    email_text: typeof input.email_text === "string" ? input.email_text.trim() : "",
    sender: typeof input.sender === "string" ? input.sender.trim() : "",
    receiver: typeof input.receiver === "string" ? input.receiver.trim() : "",
  };
}

export function sanitizeSmishingRequest(
  input: Partial<Record<keyof SmishingRequest, unknown>>,
): SmishingRequest {
  return {
    sender_name:
      typeof input.sender_name === "string" ? input.sender_name.trim() : "",
    sms_text: typeof input.sms_text === "string" ? input.sms_text.trim() : "",
  };
}

export function sanitizeVishingRequest(
  input: Partial<Record<keyof VishingRequest, unknown>>,
): VishingRequest {
  return {
    call_from: typeof input.call_from === "string" ? input.call_from.trim() : "",
    call_transcript:
      typeof input.call_transcript === "string"
        ? input.call_transcript.trim()
        : "",
  };
}

export function validateAnalysisRequest(
  input: Partial<Record<keyof AnalysisRequest, unknown>>,
): {
  data: AnalysisRequest | null;
  errors: ValidationErrors;
} {
  const data = sanitizeAnalysisRequest(input);
  const errors: ValidationErrors = {};

  if (!data.subject) {
    errors.subject = "Subject is required.";
  }

  if (!data.email_text) {
    errors.email_text = "Email body is required.";
  }

  if (!data.sender) {
    errors.sender = "Sender email is required.";
  } else if (!EMAIL_PATTERN.test(data.sender)) {
    errors.sender = "Enter a valid sender email address.";
  }

  if (!data.receiver) {
    errors.receiver = "Receiver email is required.";
  } else if (!EMAIL_PATTERN.test(data.receiver)) {
    errors.receiver = "Enter a valid receiver email address.";
  }

  return Object.keys(errors).length > 0
    ? { data: null, errors }
    : { data, errors };
}

export function validateSmishingRequest(
  input: Partial<Record<keyof SmishingRequest, unknown>>,
): {
  data: SmishingRequest | null;
  errors: SmishingValidationErrors;
} {
  const data = sanitizeSmishingRequest(input);
  const errors: SmishingValidationErrors = {};

  if (!data.sender_name) {
    errors.sender_name = "Sender name is required.";
  }

  if (!data.sms_text) {
    errors.sms_text = "SMS text is required.";
  }

  return Object.keys(errors).length > 0
    ? { data: null, errors }
    : { data, errors };
}

export function validateVishingRequest(
  input: Partial<Record<keyof VishingRequest, unknown>>,
): {
  data: VishingRequest | null;
  errors: VishingValidationErrors;
} {
  const data = sanitizeVishingRequest(input);
  const errors: VishingValidationErrors = {};

  if (!data.call_from) {
    errors.call_from = "Caller identity is required.";
  }

  if (!data.call_transcript) {
    errors.call_transcript = "Call transcript is required.";
  }

  return Object.keys(errors).length > 0
    ? { data: null, errors }
    : { data, errors };
}

export function isAnalysisResponse(value: unknown): value is AnalysisResponse {
  return normalizeAnalysisResponse(value) !== null;
}

export function normalizeAnalysisResponse(value: unknown): AnalysisResponse | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const payload = value as Record<string, unknown>;
  const allowedRiskLevels: RiskLevel[] = ["Low", "Medium", "High"];
  const finalRisk = payload.final_risk;
  const aiScore = toFiniteNumber(payload.ai_score);
  const confidenceScore = toFiniteNumber(payload.confidence_score);
  const reasons = toStringArray(payload.reasons);
  const suspiciousIndicators = toStringArray(payload.suspicious_indicators);

  if (
    typeof finalRisk !== "string" ||
    !allowedRiskLevels.includes(finalRisk as RiskLevel) ||
    aiScore === null ||
    confidenceScore === null ||
    reasons === null ||
    suspiciousIndicators === null
  ) {
    return null;
  }

  const urlsAnalyzed = toOptionalStringArray(payload.urls_analyzed) ?? [];
  const totalUrls = toFiniteNumber(payload.total_urls) ?? urlsAnalyzed.length;
  const vtMaliciousTotal = toFiniteNumber(payload.vt_malicious_total) ?? 0;
  const vtSuspiciousTotal = toFiniteNumber(payload.vt_suspicious_total) ?? 0;
  const attackType = toOptionalString(payload.attack_type);
  const targetingLevel = toOptionalString(payload.targeting_level);

  return {
    attack_type: attackType,
    targeting_level: targetingLevel,
    urls_analyzed: urlsAnalyzed,
    total_urls: totalUrls,
    ai_score: aiScore,
    vt_malicious_total: vtMaliciousTotal,
    vt_suspicious_total: vtSuspiciousTotal,
    final_risk: finalRisk as RiskLevel,
    confidence_score: confidenceScore,
    reasons,
    suspicious_indicators: suspiciousIndicators,
  };
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toStringArray(value: unknown): string[] | null {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : null;
}

function toOptionalStringArray(value: unknown): string[] | null {
  if (typeof value === "undefined") {
    return null;
  }

  return toStringArray(value);
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  return normalized ? normalized : undefined;
}
