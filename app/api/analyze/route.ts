import { NextResponse } from "next/server";

import { AnalysisRequest, ApiErrorResponse } from "@/lib/types";
import { normalizeAnalysisResponse, validateAnalysisRequest } from "@/lib/utils";

const DEFAULT_UPSTREAM_URL = "https://api.phishraksha.tech/webhook/check";
const MAX_NETWORK_ATTEMPTS = 2;
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

  for (let attempt = 1; attempt <= MAX_NETWORK_ATTEMPTS; attempt += 1) {
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
      const trimmedResponse = responseText.trim();
      const upstreamStatus = upstreamResponse.status;
      const upstreamContentType =
        upstreamResponse.headers.get("content-type") ?? "unknown";

      if (!upstreamResponse.ok) {
        lastFailure = {
          status: 502,
          message: "Failed to analyze email.",
          details: buildUpstreamFailureDetails({
            channel: "email",
            status: upstreamStatus,
            contentType: upstreamContentType,
            responseText: trimmedResponse,
          }),
        };
        break;
      }

      if (!trimmedResponse) {
        lastFailure = {
          status: 502,
          message: "Live analyzer is temporarily unavailable for this email.",
          details:
            "The upstream email webhook completed without returning a JSON body.",
        };
        break;
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(trimmedResponse);
      } catch {
        lastFailure = {
          status: 502,
          message: "Live analyzer returned unreadable data.",
          details: `The upstream email webhook returned a non-JSON payload with content-type "${upstreamContentType}".`,
        };
        break;
      }

      const normalizedResponse = normalizeAnalysisResponse(parsed);

      if (!normalizedResponse) {
        lastFailure = {
          status: 502,
          message: "Live analyzer returned an unexpected payload.",
          details:
            "The upstream webhook responded, but its JSON shape did not match the expected analysis schema.",
        };
        break;
      }

      return {
        ok: true as const,
        data: normalizedResponse,
      };
    } catch (error) {
      lastFailure = {
        status: 502,
        message: "Unable to reach the live analyzer.",
        details:
          attempt < MAX_NETWORK_ATTEMPTS
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

function buildUpstreamFailureDetails({
  channel,
  status,
  contentType,
  responseText,
}: {
  channel: string;
  status: number;
  contentType: string;
  responseText: string;
}) {
  if (!responseText) {
    return `The upstream ${channel} webhook responded with HTTP ${status} and an empty body. Reported content-type: "${contentType}".`;
  }

  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;
    const message =
      typeof parsed.message === "string" ? parsed.message : "Upstream error.";
    const details =
      typeof parsed.details === "string" ? ` ${parsed.details}` : "";

    return `The upstream ${channel} webhook responded with HTTP ${status}. ${message}${details}`.trim();
  } catch {
    return `The upstream ${channel} webhook responded with HTTP ${status} and a non-JSON body. Reported content-type: "${contentType}".`;
  }
}
