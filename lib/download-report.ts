import { StoredAnalysisReport } from "@/lib/types";

export function downloadJsonReport<TRequest>(report: StoredAnalysisReport<TRequest>) {
  const stamp = report.generatedAt.replaceAll(":", "-").replaceAll(".", "-");
  const filename = `phishraksha-report-${stamp}.json`;
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}
