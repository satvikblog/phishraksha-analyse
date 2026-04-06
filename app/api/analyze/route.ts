import { NextResponse } from "next/server";

import { AnalysisRequest, ApiErrorResponse } from "@/lib/types";
import { isAnalysisResponse, validateAnalysisRequest } from "@/lib/utils";

const DEFAULT_UPSTREAM_URL = "https://api.phishraksha.tech/webhook/check";
const MAX_UPSTREAM_ATTEMPTS = 3;
const UPSTREAM_TIMEOUT_MS = 25000;

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);

    if (!payload || typeof payload !== "object") {
      return NextResponse.json<ApiErrorResponse>(
        { message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const validation = validateAnalysisRequest(
      payload as Record<string, unknown>,
    );

    if (!validation.data) {
      const details = Object.values(validation.errors).join(" ");

      return NextResponse.json<ApiErrorResponse>(
        {
          message: "Invalid analysis request.",
          details,
        },
        { status: 400 },
      );
    }

    const upstreamResult = await analyzeWithRetries(validation.data);

    if (!upstreamResult.ok) {
      return NextResponse.json<ApiErrorResponse>(
        {
          message: upstreamResult.message,
          details: upstreamResult.details,
        },
        { status: upstreamResult.status },
      );
    }

    return NextResponse.json(upstreamResult.data);
  } catch (error) {
    return NextResponse.json<ApiErrorResponse>(
      {
        message: "Failed to analyze email.",
        details:
          error instanceof Error
            ? error.message
            : "Unexpected server error while contacting the analyzer.",
      },
      { status: 500 },
    );
  }
}

async function analyzeWithRetries(payload: AnalysisRequest) {
  let lastFailure:
    | {
        status: number;
        message: string;
        details?: string;
      }
    | undefined;

  for (let attempt = 1; attempt <= MAX_UPSTREAM_ATTEMPTS; attempt += 1) {
    try {
      const upstreamResponse = await fetch(
        process.env.PHISHRAKSHA_API_URL ?? DEFAULT_UPSTREAM_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        },
      );

      const responseText = await upstreamResponse.text();

      if (!responseText.trim()) {
        lastFailure = {
          status: 502,
          message: "Live analyzer is temporarily unavailable for this email.",
          details:
            attempt < MAX_UPSTREAM_ATTEMPTS
              ? `Attempt ${attempt} returned no JSON body. Retrying automatically.`
              : `The upstream webhook returned no JSON data after ${MAX_UPSTREAM_ATTEMPTS} attempts. Try again in a few moments or test with a different email sample.`,
        };
        continue;
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(responseText);
      } catch {
        lastFailure = {
          status: 502,
          message: "Live analyzer returned unreadable data.",
          details:
            attempt < MAX_UPSTREAM_ATTEMPTS
              ? `Attempt ${attempt} returned invalid JSON. Retrying automatically.`
              : `The upstream webhook returned invalid JSON after ${MAX_UPSTREAM_ATTEMPTS} attempts.`,
        };
        continue;
      }

      if (!upstreamResponse.ok) {
        const upstreamMessage =
          parsed &&
          typeof parsed === "object" &&
          "message" in parsed &&
          typeof parsed.message === "string"
            ? parsed.message
            : `Upstream analyzer failed with status ${upstreamResponse.status}.`;

        lastFailure = {
          status: 502,
          message: "Failed to analyze email.",
          details:
            attempt < MAX_UPSTREAM_ATTEMPTS
              ? `${upstreamMessage} Retrying automatically.`
              : upstreamMessage,
        };
        continue;
      }

      if (!isAnalysisResponse(parsed)) {
        lastFailure = {
          status: 502,
          message: "Live analyzer returned an unexpected payload.",
          details:
            attempt < MAX_UPSTREAM_ATTEMPTS
              ? `Attempt ${attempt} returned a malformed response. Retrying automatically.`
              : `The upstream webhook responded, but its JSON shape did not match the expected analysis schema after ${MAX_UPSTREAM_ATTEMPTS} attempts.`,
        };
        continue;
      }

      return {
        ok: true as const,
        data: parsed,
      };
    } catch (error) {
      lastFailure = {
        status: 502,
        message: "Unable to reach the live analyzer.",
        details:
          attempt < MAX_UPSTREAM_ATTEMPTS
            ? `Attempt ${attempt} failed while contacting the upstream service. Retrying automatically.`
            : error instanceof Error
              ? error.message
              : "Unexpected network error while contacting the upstream service.",
      };
    }
  }

  return {
    ok: false as const,
    status: lastFailure?.status ?? 502,
    message: lastFailure?.message ?? "Failed to analyze email.",
    details: lastFailure?.details,
  };
}
