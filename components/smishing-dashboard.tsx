"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChannelAnalysisForm } from "@/components/channel-analysis-form";
import { saveSmishingReportToSession } from "@/lib/report-session";
import {
  ApiErrorResponse,
  AnalysisResponse,
  SmishingRequest,
  SmishingValidationErrors,
} from "@/lib/types";
import { isAnalysisResponse, validateSmishingRequest } from "@/lib/utils";

const initialFormValues: SmishingRequest = {
  sender_name: "",
  sms_text: "",
};

const smishingMalicious: SmishingRequest = {
  sender_name: "GITAM IT Support",
  sms_text:
    "URGENT: Your GITAM student account has been locked due to suspicious login attempts. Verify immediately to restore access: http://testsafebrowsing.appspot.com/s/phishing.html",
};

const smishingLegitimate: SmishingRequest = {
  sender_name: "GITAM University",
  sms_text:
    "Reminder: Your classes will begin at 9:00 AM tomorrow. Please check your schedule on the official portal: https://www.gitam.edu/",
};

export function SmishingDashboard() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<SmishingRequest>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<SmishingValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateField<K extends keyof SmishingRequest>(
    field: K,
    value: SmishingRequest[K],
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

  function applyPreset(values: SmishingRequest) {
    setFormValues(values);
    setFieldErrors({});
    setErrorMessage(null);
  }

  async function analyzeSmishing() {
    const validation = validateSmishingRequest(formValues);

    if (!validation.data) {
      setFieldErrors(validation.errors);
      setErrorMessage("Complete the highlighted fields before running analysis.");
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/smishing", {
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
            : "Failed to analyze SMS.";
        const details =
          payload && "details" in payload && typeof payload.details === "string"
            ? payload.details
            : "";
        throw new Error(details ? `${message} ${details}` : message);
      }

      if (!isAnalysisResponse(payload)) {
        throw new Error("Analyzer returned an unexpected response.");
      }

      saveSmishingReportToSession({
        generatedAt: new Date().toISOString(),
        request: validation.data,
        response: payload,
      });
      router.push("/smishing/result");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to analyze SMS.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ChannelAnalysisForm
      eyebrow="Smishing"
      title="Analyze suspicious SMS content"
      description="Submit the sender name and raw message text. Use the autofill buttons below to quickly test malicious and legitimate SMS examples."
      primaryLabel="Sender Name"
      primaryPlaceholder="GITAM IT Support"
      primaryValue={formValues.sender_name}
      primaryError={fieldErrors.sender_name}
      onPrimaryChange={(value) => updateField("sender_name", value)}
      secondaryLabel="SMS Text"
      secondaryPlaceholder="Paste the full SMS message here."
      secondaryValue={formValues.sms_text}
      secondaryError={fieldErrors.sms_text}
      onSecondaryChange={(value) => updateField("sms_text", value)}
      submitLabel="Analyze SMS"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onSubmit={analyzeSmishing}
      onRetry={analyzeSmishing}
      autofillOptions={[
        {
          label: "Autofill Smishing Test",
          tone: "danger",
          onClick: () => applyPreset(smishingMalicious),
        },
        {
          label: "Autofill Legit SMS",
          tone: "safe",
          onClick: () => applyPreset(smishingLegitimate),
        },
      ]}
    />
  );
}
