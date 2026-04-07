"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AnalyzerForm } from "@/components/analyzer-form";
import { saveReportToSession } from "@/lib/report-session";
import {
  AnalysisRequest,
  AnalysisResponse,
  ApiErrorResponse,
  ValidationErrors,
} from "@/lib/types";
import { normalizeAnalysisResponse, validateAnalysisRequest } from "@/lib/utils";

const initialFormValues: AnalysisRequest = {
  subject: "",
  email_text: "",
  sender: "",
  receiver: "",
};

export function PhishRakshaDashboard() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<AnalysisRequest>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateField<K extends keyof AnalysisRequest>(
    field: K,
    value: AnalysisRequest[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function analyzeEmail() {
    const validation = validateAnalysisRequest(formValues);

    if (!validation.data) {
      setFieldErrors(validation.errors);
      setErrorMessage("Complete the highlighted fields before running analysis.");
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const payload = (await response
        .json()
        .catch(() => null)) as AnalysisResponse | ApiErrorResponse | null;

      if (!response.ok) {
        const message =
          payload && "message" in payload && payload.message
            ? payload.message
            : "Failed to analyze email.";
        const details =
          payload && "details" in payload && typeof payload.details === "string"
            ? payload.details
            : "";
        throw new Error(details ? `${message} ${details}` : message);
      }

      const normalizedResponse = normalizeAnalysisResponse(payload);

      if (!normalizedResponse) {
        throw new Error("Analyzer returned an unexpected response.");
      }

      saveReportToSession({
        generatedAt: new Date().toISOString(),
        request: validation.data,
        response: normalizedResponse,
      });
      setErrorMessage(null);
      router.push("/results");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to analyze email.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnalyzerForm
      values={formValues}
      errors={fieldErrors}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onChange={updateField}
      onSubmit={analyzeEmail}
      onRetry={analyzeEmail}
    />
  );
}
