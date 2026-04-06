import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  {
    title: "Explainable verdicts",
    description:
      "Move past generic spam scoring and get readable reasons, suspicious indicators, and confidence context.",
  },
  {
    title: "Link intelligence",
    description:
      "Break down extracted URLs, volume, and VirusTotal telemetry in one place so analysts can triage faster.",
  },
  {
    title: "Evidence-ready reports",
    description:
      "Export structured JSON that can be forwarded into SOC workflows, labs, or incident notes.",
  },
];

const workflow = [
  "Paste sender, receiver, subject, and raw message body.",
  "Run the scan through the secure PhishRaksha analysis route.",
  "Review risk posture, URL stats, reasons, and suspicious patterns.",
];

const useCases = [
  "Students practicing phishing triage with realistic signals",
  "SOC teams performing rapid first-pass email screening",
  "Everyday users validating suspicious account or payment emails",
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader currentPath="/" />

      <main className="relative isolate">
        <Backdrop />

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-300/16 bg-emerald-300/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-emerald-100/85">
              Security intelligence for email threats
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Turn suspicious emails into clear, explainable risk decisions.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                PhishRaksha is a phishing analysis workspace for learners,
                analysts, and everyday users who need more than a red warning
                badge. Inspect the message, the URLs, and the reasoning behind
                the verdict.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/analyse"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6be7ff_0%,#48b4ff_45%,#89ffb9_100%)] px-7 text-base font-semibold text-slate-950 shadow-[0_24px_80px_rgba(47,194,255,0.28)] hover:-translate-y-0.5"
              >
                Start Detailed Analysis
              </Link>
              <a
                href="#capabilities"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/12 bg-white/6 px-7 text-base font-medium text-white hover:bg-white/10"
              >
                Explore Capabilities
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Metric value="3 signals" label="AI, URLs, and phishing indicators" />
              <Metric value="JSON export" label="Evidence-ready report download" />
              <Metric value="SOC-ready" label="Built for serious triage workflows" />
            </div>
          </div>

          <div className="relative">
            <GlassCard className="panel-sheen overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-300/10 to-transparent" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
                      Live Verdict Preview
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      High-fidelity triage layout
                    </h2>
                  </div>
                  <span className="rounded-full border border-rose-300/24 bg-rose-300/10 px-4 py-1.5 text-sm font-semibold text-rose-100">
                    High Risk
                  </span>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-400">
                        Investigation Snapshot
                      </p>
                      <p className="mt-3 max-w-md text-2xl font-semibold text-white">
                        Credential lure detected with typo-squatted sender and
                        unsafe backup URL.
                      </p>
                    </div>
                    <div className="grid gap-3 text-right">
                      <MiniScore label="AI" value="98%" />
                      <MiniScore label="Confidence" value="100%" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PreviewPanel
                    title="Reasons"
                    items={[
                      "Urgency and coercive language",
                      "Typosquatted sender domain",
                      "Suspicious phishing path in extracted URL",
                    ]}
                  />
                  <PreviewPanel
                    title="Indicators"
                    items={[
                      "Immediate action request",
                      "Generic salutation",
                      "Unsafe HTTP backup link",
                    ]}
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <section
          id="capabilities"
          className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8"
        >
          {features.map((feature) => (
            <GlassCard key={feature.title} className="px-6 py-6">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                Capability
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-300">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <GlassCard className="px-6 py-7 sm:px-8">
            <SectionHeading
              eyebrow="Workflow"
              title="Built around a short, decisive analysis loop"
              description="The product should feel fast for a student and credible for an analyst. The workflow is intentionally simple, but the output is investigation-grade."
            />
            <div className="mt-8 space-y-4">
              {workflow.map((item, index) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-slate-950/52 p-5"
                >
                  <div className="flex gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 font-mono text-sm text-cyan-100">
                      0{index + 1}
                    </span>
                    <p className="pt-1 text-base leading-7 text-slate-200">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="px-6 py-7 sm:px-8">
            <SectionHeading
              eyebrow="Audience Fit"
              title="Designed for both learning and real-world triage"
              description="PhishRaksha keeps the surface approachable while still showing the exact evidence that makes an email risky."
            />
            <div className="mt-8 grid gap-4">
              {useCases.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,16,29,0.9),rgba(12,24,44,0.78))] p-5"
                >
                  <p className="text-base leading-7 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <GlassCard className="overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(107,231,255,0.14),transparent_60%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-200/72">
                  Ready to Investigate
                </p>
                <h2 className="max-w-3xl text-balance text-3xl font-semibold text-white sm:text-4xl">
                  Jump into the full analysis workspace and test a suspicious
                  email end to end.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  Use the dedicated `/analyse` route for detailed inspection,
                  live risk telemetry, exportable reports, and cleaner operator
                  flow.
                </p>
              </div>
              <Link
                href="/analyse"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/10 px-7 text-base font-semibold text-cyan-50 hover:-translate-y-0.5 hover:bg-cyan-300/16"
              >
                Open Analysis Workspace
              </Link>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{label}</p>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function PreviewPanel({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-slate-400">
        {title}
      </p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm leading-6 text-slate-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Backdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-35" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_10%_20%,rgba(36,232,255,0.16),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(255,110,199,0.16),transparent_18%),radial-gradient(circle_at_50%_56%,rgba(114,146,255,0.1),transparent_28%)]" />
      <div className="mesh-orb absolute left-[-8rem] top-24 -z-20 h-72 w-72 rounded-full bg-cyan-400/22" />
      <div className="mesh-orb absolute right-[-6rem] top-32 -z-20 h-80 w-80 rounded-full bg-fuchsia-500/16 [animation-delay:2s]" />
      <div className="mesh-orb absolute left-1/2 top-[34rem] -z-20 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/10 [animation-delay:4s]" />
    </>
  );
}
