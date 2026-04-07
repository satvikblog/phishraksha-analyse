import {
  AnalysisRequest,
  DownloadReport,
  SmishingReport,
  SmishingRequest,
  StoredAnalysisReport,
  VishingReport,
  VishingRequest,
} from "@/lib/types";
import { isAnalysisResponse } from "@/lib/utils";

const EMAIL_REPORT_STORAGE_KEY = "phishraksha:last-report";
const SMISHING_REPORT_STORAGE_KEY = "phishraksha:last-smishing-report";
const VISHING_REPORT_STORAGE_KEY = "phishraksha:last-vishing-report";
const reportCache = new Map<
  string,
  {
    raw: string | null | undefined;
    parsed: unknown | null;
  }
>();

export function saveReportToSession(report: DownloadReport) {
  saveTypedReportToSession(EMAIL_REPORT_STORAGE_KEY, report);
}

export function saveSmishingReportToSession(report: SmishingReport) {
  saveTypedReportToSession(SMISHING_REPORT_STORAGE_KEY, report);
}

export function saveVishingReportToSession(report: VishingReport) {
  saveTypedReportToSession(VISHING_REPORT_STORAGE_KEY, report);
}

export function getReportFromSession(): DownloadReport | null {
  return getTypedReportFromSession(EMAIL_REPORT_STORAGE_KEY, isAnalysisRequest);
}

export function getSmishingReportFromSession(): SmishingReport | null {
  return getTypedReportFromSession(
    SMISHING_REPORT_STORAGE_KEY,
    isSmishingRequest,
  );
}

export function getVishingReportFromSession(): VishingReport | null {
  return getTypedReportFromSession(VISHING_REPORT_STORAGE_KEY, isVishingRequest);
}

export function subscribeToReportSession(onStoreChange: () => void) {
  return subscribeToStorage(onStoreChange);
}

export function subscribeToSmishingReportSession(onStoreChange: () => void) {
  return subscribeToStorage(onStoreChange);
}

export function subscribeToVishingReportSession(onStoreChange: () => void) {
  return subscribeToStorage(onStoreChange);
}

function saveTypedReportToSession<TRequest>(
  storageKey: string,
  report: StoredAnalysisReport<TRequest>,
) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(report);
  reportCache.set(storageKey, { raw: serialized, parsed: report });
  window.sessionStorage.setItem(storageKey, serialized);
}

function getTypedReportFromSession<TRequest>(
  storageKey: string,
  isRequest: (value: unknown) => value is TRequest,
): StoredAnalysisReport<TRequest> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(storageKey);
  const cached = reportCache.get(storageKey);

  if (cached && raw === cached.raw) {
    return cached.parsed as StoredAnalysisReport<TRequest> | null;
  }

  if (!raw) {
    reportCache.set(storageKey, { raw: null, parsed: null });
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!isStoredAnalysisReport(parsed, isRequest)) {
      reportCache.set(storageKey, { raw, parsed: null });
      return null;
    }

    reportCache.set(storageKey, { raw, parsed });
    return parsed;
  } catch {
    reportCache.set(storageKey, { raw, parsed: null });
    return null;
  }
}

function subscribeToStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => onStoreChange();

  window.addEventListener("storage", handler);

  return () => window.removeEventListener("storage", handler);
}

function isStoredAnalysisReport<TRequest>(
  value: unknown,
  isRequest: (request: unknown) => request is TRequest,
): value is StoredAnalysisReport<TRequest> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.generatedAt === "string" &&
    isRequest(payload.request) &&
    isAnalysisResponse(payload.response)
  );
}

function isAnalysisRequest(value: unknown): value is AnalysisRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.subject === "string" &&
    typeof payload.email_text === "string" &&
    typeof payload.sender === "string" &&
    typeof payload.receiver === "string"
  );
}

function isSmishingRequest(value: unknown): value is SmishingRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.sender_name === "string" &&
    typeof payload.sms_text === "string"
  );
}

function isVishingRequest(value: unknown): value is VishingRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.call_from === "string" &&
    typeof payload.call_transcript === "string"
  );
}
