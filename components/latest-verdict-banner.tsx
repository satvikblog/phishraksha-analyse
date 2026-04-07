"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { getReportFromSession } from "@/lib/report-session";
import { cn, getMailClassification, riskStyles } from "@/lib/utils";

export function LatestVerdictBanner() {
  const report = getReportFromSession();

  if (!report) {
    return null;
  }

  const verdict = getMailClassification(report.response.final_risk);
  const theme = riskStyles[report.response.final_risk];

  return (
    <GlassCard className="panel-sheen mx-auto mt-8 w-full max-w-4xl overflow-hidden px-5 py-5 sm:px-6">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", theme.panel)} />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
            Latest Verdict
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {verdict}
          </h2>
          <p className="text-sm leading-6 text-slate-200/90">
            Previous result: {report.response.final_risk} risk for{" "}
            <span className="font-medium text-white">{report.request.subject}</span>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex self-start rounded-full border px-4 py-2 text-sm font-semibold sm:self-center",
            theme.badge,
          )}
        >
          {report.response.final_risk} risk
        </span>
      </div>
    </GlassCard>
  );
}
