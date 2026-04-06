"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import { ResultsDashboard } from "@/components/results-dashboard";
import { SiteHeader } from "@/components/site-header";
import { downloadJsonReport } from "@/lib/download-report";
import { DownloadReport } from "@/lib/types";
import {
  getReportFromSession,
  subscribeToReportSession,
} from "@/lib/report-session";

export function ResultsPage() {
  const report = useSyncExternalStore(
    subscribeToReportSession,
    getReportFromSession,
    () => null,
  ) as DownloadReport | null;
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  function handleDownload() {
    if (!report) {
      return;
    }

    downloadJsonReport(report);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader currentPath="/results" />

      <main className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-28" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[720px] bg-[radial-gradient(circle_at_12%_18%,rgba(0,224,255,0.14),transparent_18%),radial-gradient(circle_at_88%_18%,rgba(255,96,168,0.13),transparent_15%),radial-gradient(circle_at_50%_60%,rgba(74,222,128,0.1),transparent_22%)]" />

        <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/72">
                Results
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Detailed phishing verdict
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-300">
                Review the outcome in a dedicated results view with no form
                clutter and no extra dashboard noise.
              </p>
            </div>
            <Link
              href="/analyse"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Analyze another email
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          {!isHydrated ? (
            <ResultsLoadingState />
          ) : report ? (
            <ResultsDashboard
              request={report.request}
              result={report.response}
              onDownload={handleDownload}
            />
          ) : (
            <ResultsEmptyState />
          )}
        </section>
      </main>
    </div>
  );
}

function ResultsLoadingState() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-slate-300 backdrop-blur-xl">
      Loading the latest analysis result...
    </div>
  );
}

function ResultsEmptyState() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
        No Results
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-white">
        No completed analysis found
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        Submit an email from the analysis page first. Once the scan succeeds,
        the verdict will open here automatically.
      </p>
      <div className="mt-6">
        <Link
          href="/analyse"
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-50 hover:bg-cyan-300/16"
        >
          Go to Analyse
        </Link>
      </div>
    </div>
  );
}
