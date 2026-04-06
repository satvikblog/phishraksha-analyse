"use client";

import { FormEvent } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { AnalysisRequest, ValidationErrors } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AnalyzerFormProps {
  values: AnalysisRequest;
  errors: ValidationErrors;
  isLoading: boolean;
  errorMessage: string | null;
  onChange: <K extends keyof AnalysisRequest>(
    field: K,
    value: AnalysisRequest[K],
  ) => void;
  onSubmit: () => void;
  onRetry: () => void;
}

export function AnalyzerForm({
  values,
  errors,
  isLoading,
  errorMessage,
  onChange,
  onSubmit,
  onRetry,
}: AnalyzerFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <GlassCard className="panel-sheen mx-auto w-full max-w-3xl overflow-hidden">
      <div className="border-b border-white/8 px-5 py-6 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/72">
          Analyse Email
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Submit a suspicious message
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Paste the exact subject, sender, receiver, and raw email body. When
          the scan completes, you will be redirected to a dedicated results page.
        </p>
      </div>

      <form className="space-y-5 px-5 py-6 sm:px-8 sm:py-8" onSubmit={handleSubmit}>
        <Field
          label="Subject"
          placeholder="Urgent: verify your payroll credentials"
          value={values.subject}
          error={errors.subject}
          onChange={(value) => onChange("subject", value)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Sender Email"
            placeholder="security@company-mail.co"
            value={values.sender}
            error={errors.sender}
            onChange={(value) => onChange("sender", value)}
            type="email"
          />

          <Field
            label="Receiver Email"
            placeholder="employee@company.com"
            value={values.receiver}
            error={errors.receiver}
            onChange={(value) => onChange("receiver", value)}
            type="email"
          />
        </div>

        <Field
          label="Email Body"
          placeholder="Paste the full email body, links, and call-to-action text here."
          value={values.email_text}
          error={errors.email_text}
          onChange={(value) => onChange("email_text", value)}
          multiline
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
            {isLoading ? "Analyzing..." : "Analyze Email"}
          </button>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            We keep the submission step focused here and open the verdict on a
            separate results screen.
          </p>
        </div>
      </form>
    </GlassCard>
  );
}

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  multiline?: boolean;
}

function Field({
  label,
  placeholder,
  value,
  error,
  onChange,
  type = "text",
  multiline = false,
}: FieldProps) {
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
          rows={12}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(sharedClasses, "resize-y")}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={sharedClasses}
        />
      )}
    </label>
  );
}
