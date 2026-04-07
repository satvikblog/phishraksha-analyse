"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import { ChannelResultsDashboard } from "@/components/channel-results-dashboard";
import { SmishingDashboard } from "@/components/smishing-dashboard";
import { SiteHeader } from "@/components/site-header";
import { downloadJsonReport } from "@/lib/download-report";
import {
  getSmishingReportFromSession,
  subscribeToSmishingReportSession,
} from "@/lib/report-session";
import { SmishingReport } from "@/lib/types";

export function SmishingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader currentPath="/smishing" />
      <main className="relative isolate">
        <SharedChannelBackdrop />
        <section className="mx-auto w-full max-w-5xl px-4 pb-10 pt-12 text-center sm:px-6 lg:pt-16">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-amber-100/75">
            Smishing
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Submit suspicious SMS content for analysis.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Investigate sender names, phishing links, urgency patterns, and
            whether the message looks like targeted or mass text fraud.
          </p>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
          <SmishingDashboard />
        </section>
      </main>
    </div>
  );
}

export function SmishingResultsPage() {
  const report = useSyncExternalStore(
    subscribeToSmishingReportSession,
    getSmishingReportFromSession,
    () => null,
  ) as SmishingReport | null;
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
      <SiteHeader currentPath="/smishing" />
      <main className="relative isolate">
        <SharedChannelBackdrop />
        <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-100/75">
                Smishing Results
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Detailed SMS verdict
              </h1>
            </div>
            <Link
              href="/smishing"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Analyze another SMS
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          {!isHydrated ? (
            <LoadingState />
          ) : report ? (
            <ChannelResultsDashboard
              result={report.response}
              title={report.request.sender_name}
              subtitle="Submitted SMS analysis verdict with attack context, suspicious indicators, and extracted links."
              contextEyebrow="SMS Context"
              primaryLabel="Sender Name"
              primaryValue={report.request.sender_name}
              contentLabel="SMS Text"
              contentValue={report.request.sms_text}
              onDownload={handleDownload}
            />
          ) : (
            <EmptyState
              title="No completed SMS analysis found"
              href="/smishing"
              button="Go to Smishing"
            />
          )}
        </section>
      </main>
    </div>
  );
}

function SharedChannelBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-28" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[680px] bg-[radial-gradient(circle_at_12%_18%,rgba(255,191,71,0.14),transparent_18%),radial-gradient(circle_at_88%_18%,rgba(0,224,255,0.12),transparent_18%)]" />
    </>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 text-slate-300 backdrop-blur-xl">
      Loading the latest analysis result...
    </div>
  );
}

function EmptyState({
  title,
  href,
  button,
}: {
  title: string;
  href: string;
  button: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
        No Results
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-white">{title}</h2>
      <div className="mt-6">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-50 hover:bg-cyan-300/16"
        >
          {button}
        </Link>
      </div>
    </div>
  );
}
