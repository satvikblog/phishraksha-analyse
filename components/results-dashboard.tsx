import { AttackSummaryBadges } from "@/components/attack-summary-badges";
import { GlassCard } from "@/components/ui/glass-card";
import { AnalysisRequest, AnalysisResponse } from "@/lib/types";
import {
  clampScore,
  cn,
  formatPercent,
  getMailClassification,
  riskStyles,
} from "@/lib/utils";

interface ResultsDashboardProps {
  result: AnalysisResponse;
  request: AnalysisRequest;
  onDownload: () => void;
}

export function ResultsDashboard({
  result,
  request,
  onDownload,
}: ResultsDashboardProps) {
  const theme = riskStyles[result.final_risk];
  const riskAccent =
    result.final_risk === "High"
      ? "text-rose-100"
      : result.final_risk === "Medium"
        ? "text-amber-100"
        : "text-emerald-100";
  const verdict = getMailClassification(result.final_risk);

  return (
    <div className="space-y-6">
      <GlassCard className="panel-sheen overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", theme.panel)} />
        <div className="relative space-y-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <AttackSummaryBadges
                  attackType={result.attack_type}
                  targetingLevel={result.targeting_level}
                />
                <span
                  className={cn(
                    "inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold",
                    theme.badge,
                  )}
                >
                  {result.final_risk} risk detected
                </span>
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.24em] text-slate-300">
                  Threat intelligence verdict
                </span>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-300/70">
                  Investigation results
                </p>
                <p className={cn("text-xl font-bold uppercase tracking-[0.16em] sm:text-2xl", riskAccent)}>
                  {verdict}
                </p>
                <h2 className="max-w-4xl break-words text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {request.subject}
                </h2>
                <p className="max-w-3xl text-base leading-7 text-slate-200/90">
                  From <span className={cn("font-medium", riskAccent)}>{request.sender}</span>{" "}
                  to <span className="font-medium text-white">{request.receiver}</span>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-medium text-slate-100 hover:border-cyan-300/35 hover:bg-cyan-300/10"
            >
              Download JSON report
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ResultStat label="AI Score" value={formatPercent(result.ai_score)} />
            <ResultStat
              label="Confidence"
              value={formatPercent(result.confidence_score)}
            />
            <ResultStat label="URLs Analyzed" value={String(result.total_urls)} />
            <ResultStat
              label="VT Flags"
              value={String(
                result.vt_malicious_total + result.vt_suspicious_total,
              )}
            />
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <GlassCard className="overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
                  Email Context
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  Message preview and scoring
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:min-w-[240px]">
                <ScoreMeter
                  label="AI score"
                  value={result.ai_score}
                  meterClass={theme.meter}
                />
                <ScoreMeter
                  label="Confidence score"
                  value={result.confidence_score}
                  meterClass={theme.meter}
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-[#0a1020]/88 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-400">
                Email Body Preview
              </p>
              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                {request.email_text}
              </pre>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
                  URL Analysis
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Link intelligence
                </h3>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  theme.chip,
                )}
              >
                {result.total_urls} total
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ResultStat label="Malicious" value={String(result.vt_malicious_total)} />
              <ResultStat label="Suspicious" value={String(result.vt_suspicious_total)} />
            </div>

            <div className="space-y-3">
              {result.urls_analyzed.length > 0 ? (
                result.urls_analyzed.map((url) => (
                  <div
                    key={url}
                    className="rounded-[1.4rem] border border-white/10 bg-[#0a1020]/88 px-4 py-3 font-mono text-xs leading-6 text-cyan-100/88 break-all"
                  >
                    {url}
                  </div>
                ))
              ) : (
                <p className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/4 px-4 py-5 text-sm text-slate-300">
                  No URLs were extracted from this email body.
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <InsightList
          eyebrow="Reasons"
          title="Why this email triggered the phishing verdict"
          items={result.reasons}
          accentClass={theme.ring}
        />
        <InsightList
          eyebrow="Suspicious Indicators"
          title="Patterns or signals highlighted by the detection flow"
          items={result.suspicious_indicators}
          accentClass={theme.ring}
        />
      </div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1020]/82 px-4 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ScoreMeter({
  label,
  value,
  meterClass,
}: {
  label: string;
  value: number;
  meterClass: string;
}) {
  const width = clampScore(value);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1020]/82 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
          {label}
        </p>
        <p className="text-sm font-medium text-white">{formatPercent(value)}</p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", meterClass)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function InsightList({
  eyebrow,
  title,
  items,
  accentClass,
}: {
  eyebrow: string;
  title: string;
  items: string[];
  accentClass: string;
}) {
  return (
    <GlassCard className="overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{title}</h3>

      {items.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li
              key={item}
              className={cn(
                "rounded-[1.6rem] border border-white/10 bg-[#0a1020]/84 p-4 ring-1 ring-inset",
                accentClass,
              )}
            >
              <div className="flex gap-4">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <p className="text-sm leading-7 text-slate-200">{item}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-[1.4rem] border border-dashed border-white/12 bg-white/4 px-4 py-5 text-sm text-slate-300">
          No explicit indicators were returned for this category.
        </p>
      )}
    </GlassCard>
  );
}
