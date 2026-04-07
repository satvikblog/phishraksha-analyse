import {
  AnalysisRequest,
  AnalysisResponse,
  AttackType,
  RiskLevel,
  TargetingLevel,
  ValidationErrors,
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
  return attackType === "Phishing" || attackType === "Spear Phishing"
    ? attackType
    : "Unknown";
}

export function getTargetingLevelDisplay(targetingLevel?: string) {
  return targetingLevel === "Mass" || targetingLevel === "Targeted"
    ? targetingLevel
    : "Unknown";
}

export function getAttackTypeBadgeClass(attackType?: string) {
  const normalized = getAttackTypeDisplay(attackType);

  if (normalized === "Spear Phishing") {
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

export function isAnalysisResponse(value: unknown): value is AnalysisResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  const allowedRiskLevels: RiskLevel[] = ["Low", "Medium", "High"];

  return (
    isOptionalAttackType(payload.attack_type) &&
    isOptionalTargetingLevel(payload.targeting_level) &&
    isStringArray(payload.urls_analyzed) &&
    typeof payload.total_urls === "number" &&
    typeof payload.ai_score === "number" &&
    typeof payload.vt_malicious_total === "number" &&
    typeof payload.vt_suspicious_total === "number" &&
    typeof payload.confidence_score === "number" &&
    typeof payload.final_risk === "string" &&
    allowedRiskLevels.includes(payload.final_risk as RiskLevel) &&
    isStringArray(payload.reasons) &&
    isStringArray(payload.suspicious_indicators)
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isOptionalAttackType(value: unknown): value is AttackType | undefined {
  return (
    typeof value === "undefined" ||
    value === "Phishing" ||
    value === "Spear Phishing"
  );
}

function isOptionalTargetingLevel(
  value: unknown,
): value is TargetingLevel | undefined {
  return typeof value === "undefined" || value === "Mass" || value === "Targeted";
}
