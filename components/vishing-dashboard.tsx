"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChannelAnalysisForm } from "@/components/channel-analysis-form";
import { saveVishingReportToSession } from "@/lib/report-session";
import {
  AnalysisResponse,
  ApiErrorResponse,
  VishingRequest,
  VishingValidationErrors,
} from "@/lib/types";
import { isAnalysisResponse, validateVishingRequest } from "@/lib/utils";

const initialFormValues: VishingRequest = {
  call_from: "",
  call_transcript: "",
};

const vishingMalicious: VishingRequest = {
  call_from: "GITAM IT Department",
  call_transcript:
    "Hello this is IT support from GITAM. Your student account has been compromised. You must share your OTP immediately or your account will be permanently disabled. Do not disconnect this call.",
};

const vishingLegitimate: VishingRequest = {
  call_from: "GITAM Administration",
  call_transcript:
    "Hello, this is a reminder regarding your course registration. Please complete it before Friday using the official university portal.",
};

export function VishingDashboard() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<VishingRequest>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<VishingValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateField<K extends keyof VishingRequest>(
    field: K,
    value: VishingRequest[K],
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

  function applyPreset(values: VishingRequest) {
    setFormValues(values);
    setFieldErrors({});
    setErrorMessage(null);
  }

  async function analyzeVishing() {
    const validation = validateVishingRequest(formValues);

    if (!validation.data) {
      setFieldErrors(validation.errors);
      setErrorMessage("Complete the highlighted fields before running analysis.");
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/vishing", {
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
            : "Failed to analyze call.";
        const details =
          payload && "details" in payload && typeof payload.details === "string"
            ? payload.details
            : "";
        throw new Error(details ? `${message} ${details}` : message);
      }

      if (!isAnalysisResponse(payload)) {
        throw new Error("Analyzer returned an unexpected response.");
      }

      saveVishingReportToSession({
        generatedAt: new Date().toISOString(),
        request: validation.data,
        response: payload,
      });
      router.push("/vishing/result");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to analyze call.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ChannelAnalysisForm
      eyebrow="Vishing"
      title="Analyze suspicious call transcripts"
      description="Submit the caller identity and transcript text. Use the autofill buttons below to test malicious and legitimate vishing scenarios."
      primaryLabel="Call From"
      primaryPlaceholder="GITAM IT Department"
      primaryValue={formValues.call_from}
      primaryError={fieldErrors.call_from}
      onPrimaryChange={(value) => updateField("call_from", value)}
      secondaryLabel="Call Transcript"
      secondaryPlaceholder="Paste the call transcript here."
      secondaryValue={formValues.call_transcript}
      secondaryError={fieldErrors.call_transcript}
      onSecondaryChange={(value) => updateField("call_transcript", value)}
      submitLabel="Analyze Call"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onSubmit={analyzeVishing}
      onRetry={analyzeVishing}
      autofillOptions={[
        {
          label: "Autofill Vishing Test",
          tone: "danger",
          onClick: () => applyPreset(vishingMalicious),
        },
        {
          label: "Autofill Legit Call",
          tone: "safe",
          onClick: () => applyPreset(vishingLegitimate),
        },
      ]}
    />
  );
}
