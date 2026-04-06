import { DownloadReport } from "@/lib/types";
import { isAnalysisResponse } from "@/lib/utils";

const REPORT_STORAGE_KEY = "phishraksha:last-report";
let cachedRawReport: string | null | undefined;
let cachedParsedReport: DownloadReport | null = null;

export function saveReportToSession(report: DownloadReport) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(report);

  cachedRawReport = serialized;
  cachedParsedReport = report;
  window.sessionStorage.setItem(REPORT_STORAGE_KEY, serialized);
}

export function getReportFromSession(): DownloadReport | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(REPORT_STORAGE_KEY);

  if (raw === cachedRawReport) {
    return cachedParsedReport;
  }

  if (!raw) {
    cachedRawReport = null;
    cachedParsedReport = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!isDownloadReport(parsed)) {
      cachedRawReport = raw;
      cachedParsedReport = null;
      return null;
    }

    cachedRawReport = raw;
    cachedParsedReport = parsed;
    return cachedParsedReport;
  } catch {
    cachedRawReport = raw;
    cachedParsedReport = null;
    return null;
  }
}

export function subscribeToReportSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => onStoreChange();

  window.addEventListener("storage", handler);

  return () => window.removeEventListener("storage", handler);
}

function isDownloadReport(value: unknown): value is DownloadReport {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.generatedAt === "string" &&
    isAnalysisRequest(payload.request) &&
    isAnalysisResponse(payload.response)
  );
}

function isAnalysisRequest(value: unknown) {
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
