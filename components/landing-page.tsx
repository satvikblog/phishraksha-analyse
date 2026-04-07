import type { ReactNode } from "react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { GlassCard } from "@/components/ui/glass-card";

const launchRoutes = [
  {
    href: "/analyse",
    title: "Email Analysis",
    label: "Email",
    accent: "cyan",
    description:
      "Inspect suspicious emails with URL intelligence, attack classification, and explainable verdicts.",
  },
  {
    href: "/smishing",
    title: "Smishing Detection",
    label: "SMS",
    accent: "amber",
    description:
      "Investigate text-message fraud, suspicious sender names, and malicious delivery links.",
  },
  {
    href: "/vishing",
    title: "Vishing Detection",
    label: "Voice",
    accent: "rose",
    description:
      "Review caller identity, transcripts, and coercive tactics in suspected voice scams.",
  },
] as const;

const capabilityCards = [
  {
    title: "Explainable security verdicts",
    text: "Every investigation surfaces risk, confidence, reasons, suspicious indicators, and attack context in one place.",
  },
  {
    title: "Multi-channel phishing coverage",
    text: "Analyze phishing across email, SMS, and voice so the product feels like a unified cyber defense workspace.",
  },
  {
    title: "Operator-friendly workflow",
    text: "Fast submission, focused result pages, and export-ready output make PhishRaksha usable for students and analysts alike.",
  },
];

const processSteps = [
  "Choose the phishing channel you want to inspect.",
  "Submit the suspicious content through the dedicated analysis flow.",
  "Review the final verdict, attack type, targeting level, and evidence-backed reasons.",
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader currentPath="/" />

      <main className="relative isolate">
        <HomeBackdrop />

        <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pt-18">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-cyan-100/84">
                AI phishing defense platform
              </div>

              <div className="space-y-6">
                <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl xl:text-7xl">
                  One platform for email, SMS, and voice phishing analysis.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                  PhishRaksha helps teams and learners investigate suspicious
                  communication with clean verdicts, visible attack context, and
                  evidence they can actually use.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <PrimaryLink href="/analyse">Analyze Email</PrimaryLink>
                <SecondaryLink href="/smishing" tone="amber">
                  Analyze Smishing
                </SecondaryLink>
                <SecondaryLink href="/vishing" tone="rose">
                  Analyze Vishing
                </SecondaryLink>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard value="3 channels" label="Email, SMS, and voice coverage" />
                <MetricCard value="Explainable" label="Reasons, indicators, and verdicts" />
                <MetricCard value="Actionable" label="Focused result pages and export flow" />
              </div>
            </div>

            <GlassCard className="panel-sheen overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-300/10 to-transparent" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/72">
                      Security Workspace
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">
                      Faster phishing triage without clutter
                    </h2>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-1.5 text-sm font-semibold text-emerald-100">
                    Live-ready
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {launchRoutes.map((route) => (
                    <LaunchRouteCard key={route.href} {...route} />
                  ))}
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-[#091221]/88 p-5 sm:p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-400">
                    What analysts see
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <SnapshotBlock
                      title="Verdict"
                      body="Binary classification, risk level, attack type, and targeting level surface immediately."
                    />
                    <SnapshotBlock
                      title="Evidence"
                      body="Reasons, suspicious indicators, extracted URLs, and score context stay grouped and readable."
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {capabilityCards.map((card) => (
              <GlassCard key={card.title} className="px-6 py-7">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                  Capability
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  {card.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  {card.text}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
            <GlassCard className="px-6 py-7 sm:px-8">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/72">
                Product Flow
              </p>
              <h2 className="mt-4 max-w-xl text-balance text-3xl font-semibold text-white sm:text-4xl">
                Built for a short, focused investigation loop.
              </h2>
              <div className="mt-8 space-y-4">
                {processSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-3xl border border-white/10 bg-[#0a1323]/78 p-5"
                  >
                    <div className="flex gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 font-mono text-sm text-cyan-100">
                        0{index + 1}
                      </span>
                      <p className="pt-1 text-base leading-7 text-slate-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="overflow-hidden px-6 py-7 sm:px-8">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(107,231,255,0.08),transparent_60%)]" />
              <div className="relative grid gap-5 md:grid-cols-2">
                <FocusPanel
                  eyebrow="Email"
                  title="URL and sender-based investigations"
                  description="Best for inbox threats, spoofed domains, credential lures, and attachment delivery attempts."
                />
                <FocusPanel
                  eyebrow="Smishing"
                  title="SMS fraud with urgent mobile prompts"
                  description="Ideal for suspicious OTP messages, package scams, fake bank alerts, and short-link abuse."
                />
                <FocusPanel
                  eyebrow="Vishing"
                  title="Voice scam transcript review"
                  description="Useful for caller impersonation, social-engineering scripts, and pressure-driven OTP theft attempts."
                />
                <FocusPanel
                  eyebrow="Results"
                  title="Separate verdict pages"
                  description="Each investigation ends in a focused result screen with attack metadata, reasons, and suspicious indicators."
                />
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <GlassCard className="overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
            <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(107,231,255,0.12),transparent_60%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-200/72">
                  Start With The Right Channel
                </p>
                <h2 className="max-w-3xl text-balance text-3xl font-semibold text-white sm:text-4xl">
                  Choose the phishing surface you want to investigate right now.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  The homepage now acts like a real product launcher instead of
                  a stacked marketing page, with direct paths into each analysis
                  mode.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryLink href="/analyse">Email</PrimaryLink>
                <SecondaryLink href="/smishing" tone="amber">
                  Smishing
                </SecondaryLink>
                <SecondaryLink href="/vishing" tone="rose">
                  Vishing
                </SecondaryLink>
              </div>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6be7ff_0%,#48b4ff_45%,#89ffb9_100%)] px-7 text-base font-semibold text-slate-950 shadow-[0_24px_80px_rgba(47,194,255,0.28)] hover:-translate-y-0.5"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: "amber" | "rose";
  children: ReactNode;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-300/20 bg-amber-300/10 text-amber-50 hover:bg-amber-300/16"
      : "border-rose-300/20 bg-rose-300/10 text-rose-50 hover:bg-rose-300/16";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-14 items-center justify-center rounded-full border px-7 text-base font-medium hover:-translate-y-0.5 ${toneClass}`}
    >
      {children}
    </Link>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{label}</p>
    </div>
  );
}

function LaunchRouteCard({
  href,
  title,
  label,
  accent,
  description,
}: {
  href: string;
  title: string;
  label: string;
  accent: "cyan" | "amber" | "rose";
  description: string;
}) {
  const accentClass =
    accent === "amber"
      ? "border-amber-300/16 bg-amber-300/8 text-amber-100"
      : accent === "rose"
        ? "border-rose-300/16 bg-rose-300/8 text-rose-100"
        : "border-cyan-300/16 bg-cyan-300/8 text-cyan-100";

  return (
    <Link
      href={href}
      className="rounded-[1.8rem] border border-white/10 bg-[#091221]/82 p-5 transition hover:-translate-y-1 hover:bg-[#0d1729]"
    >
      <div
        className={`inline-flex rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] ${accentClass}`}
      >
        {label}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </Link>
  );
}

function SnapshotBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-200">{body}</p>
    </div>
  );
}

function FocusPanel({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.9rem] border border-white/10 bg-[#091221]/82 p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/72">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>
    </div>
  );
}

function HomeBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#07111d_0%,#091522_45%,#07101a_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_14%_12%,rgba(61,221,255,0.12),transparent_18%),radial-gradient(circle_at_86%_14%,rgba(255,123,176,0.10),transparent_16%),radial-gradient(circle_at_50%_38%,rgba(108,255,194,0.08),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(72,131,255,0.10),transparent_24%)]" />
      <div className="mesh-orb absolute left-[-7rem] top-18 -z-20 h-72 w-72 rounded-full bg-cyan-400/16" />
      <div className="mesh-orb absolute right-[-8rem] top-22 -z-20 h-80 w-80 rounded-full bg-fuchsia-500/12 [animation-delay:2s]" />
      <div className="mesh-orb absolute left-1/2 top-[30rem] -z-20 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/8 [animation-delay:4s]" />
    </>
  );
}
