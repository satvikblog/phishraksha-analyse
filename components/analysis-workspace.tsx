import Link from "next/link";

import { PhishRakshaDashboard } from "@/components/phishraksha-dashboard";
import { SiteHeader } from "@/components/site-header";

export function AnalysisWorkspace() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader currentPath="/analyse" />

      <main className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-grid opacity-28" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[640px] bg-[radial-gradient(circle_at_12%_18%,rgba(0,224,255,0.14),transparent_18%),radial-gradient(circle_at_88%_18%,rgba(255,96,168,0.12),transparent_15%),radial-gradient(circle_at_50%_60%,rgba(74,222,128,0.1),transparent_22%)]" />
        <div className="mesh-orb absolute left-[-8rem] top-20 -z-20 h-72 w-72 rounded-full bg-cyan-400/16" />
        <div className="mesh-orb absolute right-[-10rem] top-40 -z-20 h-96 w-96 rounded-full bg-indigo-500/14 [animation-delay:2s]" />

        <section className="mx-auto w-full max-w-5xl px-4 pb-10 pt-12 text-center sm:px-6 lg:pt-16">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-200/72">
            Analyse
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Submit the email. Read the verdict on a separate results page.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            This page is intentionally focused on intake only. Fill the form,
            run the scan, and PhishRaksha will open a dedicated results view when
            the analysis completes.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
          <PhishRakshaDashboard />
        </section>
      </main>
    </div>
  );
}
