"use client";

import { FormEvent } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface AutofillOption {
  label: string;
  tone: "danger" | "safe";
  onClick: () => void;
}

interface ChannelAnalysisFormProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryPlaceholder: string;
  primaryValue: string;
  primaryError?: string;
  onPrimaryChange: (value: string) => void;
  secondaryLabel: string;
  secondaryPlaceholder: string;
  secondaryValue: string;
  secondaryError?: string;
  onSecondaryChange: (value: string) => void;
  secondaryRows?: number;
  submitLabel: string;
  isLoading: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  onRetry: () => void;
  autofillOptions: AutofillOption[];
}

export function ChannelAnalysisForm({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryPlaceholder,
  primaryValue,
  primaryError,
  onPrimaryChange,
  secondaryLabel,
  secondaryPlaceholder,
  secondaryValue,
  secondaryError,
  onSecondaryChange,
  secondaryRows = 11,
  submitLabel,
  isLoading,
  errorMessage,
  onSubmit,
  onRetry,
  autofillOptions,
}: ChannelAnalysisFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <GlassCard className="panel-sheen mx-auto w-full max-w-4xl overflow-hidden">
      <div className="border-b border-white/8 px-5 py-6 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/72">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          {description}
        </p>
      </div>

      <form className="space-y-6 px-5 py-6 sm:px-8 sm:py-8" onSubmit={handleSubmit}>
        <div className="rounded-[1.5rem] border border-white/10 bg-[#0a1323]/76 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-slate-400">
            Example Autofill
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {autofillOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={option.onClick}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5",
                  option.tone === "danger"
                    ? "border-rose-300/22 bg-rose-300/10 text-rose-50 hover:bg-rose-300/16"
                    : "border-emerald-300/22 bg-emerald-300/10 text-emerald-50 hover:bg-emerald-300/16",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Field
          label={primaryLabel}
          placeholder={primaryPlaceholder}
          value={primaryValue}
          error={primaryError}
          onChange={onPrimaryChange}
        />

        <Field
          label={secondaryLabel}
          placeholder={secondaryPlaceholder}
          value={secondaryValue}
          error={secondaryError}
          onChange={onSecondaryChange}
          multiline
          rows={secondaryRows}
        />

        {errorMessage ? (
          <div className="rounded-[1.4rem] border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="leading-6">{errorMessage}</p>
              <button
                type="button"
                onClick={onRetry}
                disabled={isLoading}
                className="rounded-full border border-rose-300/24 px-4 py-2 font-medium text-rose-50 hover:bg-rose-300/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#6be7ff_0%,#56b9ff_48%,#a36bff_100%)] px-6 text-base font-semibold text-slate-950 shadow-[0_24px_80px_rgba(57,197,255,0.25)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full bg-slate-950",
                isLoading && "animate-pulse",
              )}
            />
            {isLoading ? "Analyzing..." : submitLabel}
          </button>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            The result opens on a dedicated page after the analysis completes.
          </p>
        </div>
      </form>
    </GlassCard>
  );
}

function Field({
  label,
  placeholder,
  value,
  error,
  onChange,
  multiline = false,
  rows = 10,
}: {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const sharedClasses =
    "w-full rounded-[1.4rem] border border-white/10 bg-[#0b1323]/86 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/45 focus:outline-none focus:ring-4 focus:ring-cyan-300/10";

  return (
    <label className="block space-y-2.5">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-medium text-slate-100">{label}</span>
        {error ? <span className="text-xs text-rose-200">{error}</span> : null}
      </div>
      {multiline ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(sharedClasses, "resize-y")}
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={sharedClasses}
        />
      )}
    </label>
  );
}
