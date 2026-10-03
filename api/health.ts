import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCognitoToken } from "./_lib/cognito.js";

/**
 * Public health endpoint: GET /api/health
 *
 * Follows the health contract shared by all portfolio projects:
 *   { status: "ok" | "degraded" | "down", checked_at, checks: { <name>: Check } }
 *   HTTP 200 for ok/degraded, 503 for down.
 *
 * This function adds the two checks only it can make:
 *   - auth: can we get a Cognito token, and does the API accept it?
 *   - api:  does API Gateway answer the backend's GET /health?
 * Every other check (database, pipeline, llm, ...) comes from the backend's answer.
 *
 * Failure details are logged here and never returned to the caller.
 */

type CheckStatus = "ok" | "down";

interface Check {
  status: CheckStatus;
  critical: boolean;
  latency_ms: number;
  checked_at: string;
}

type OverallStatus = "ok" | "degraded" | "down";

/** How long we wait for Cognito, then for the backend. Together they stay near 8s. */
const TOKEN_TIMEOUT_MS = 2500;
const BACKEND_TIMEOUT_MS = 6000;

/** Builds one check result, timed from `startedAt` (a Date.now() value). */
function makeCheck(status: CheckStatus, startedAt: number): Check {
  return {
    status,
    critical: true, // Without auth or the API, nothing in TrendLink works
    latency_ms: Date.now() - startedAt,
    checked_at: new Date(startedAt).toISOString(),
  };
}

/** Rejects if `promise` has not settled within `ms` milliseconds. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timed out")), ms)),
  ]);
}

/** True when `value` looks like one check from the backend's health answer. */
function isCheck(value: unknown): value is Check {
  const check = value as Check | null;
  return (
    typeof check === "object" &&
    check !== null &&
    (check.status === "ok" || check.status === "down") &&
    typeof check.critical === "boolean"
  );
}

/** "down" if a critical check is down, "degraded" if only non-critical ones are, else "ok". */
export function rollUp(checks: Record<string, Check>): OverallStatus {
  const down = Object.values(checks).filter((check) => check.status === "down");
  if (down.some((check) => check.critical)) return "down";
  return down.length > 0 ? "degraded" : "ok";
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const checks: Record<string, Check> = {};

  // ── auth: get a Cognito token (getCognitoToken reuses a cached one if still valid) ──
  const authStartedAt = Date.now();
  let token: string | null = null;
  try {
    token = await withTimeout(getCognitoToken(), TOKEN_TIMEOUT_MS);
  } catch (error) {
    console.error("[health] auth is down:", error);
  }
  checks.auth = makeCheck(token ? "ok" : "down", authStartedAt);

  // ── api: call the backend's health route through API Gateway ──
  const apiStartedAt = Date.now();
  if (!token) {
    // Without a token the API cannot be reached from here, so it counts as down too
    checks.api = makeCheck("down", apiStartedAt);
  } else {
    try {
      const response = await fetch(`${process.env.API_GATEWAY_URL}/health`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
      });

      if (response.status === 401 || response.status === 403) {
        // The gateway answered but rejected our token: that is an auth problem
        console.error("[health] auth is down: API Gateway rejected the token", response.status);
        checks.auth = makeCheck("down", authStartedAt);
        checks.api = makeCheck("ok", apiStartedAt);
      } else {
        // The backend answers 503 with a normal body when something critical is down,
        // so read the body whatever the status code is.
        const body = (await response.json()) as { checks?: Record<string, unknown> };
        if (typeof body.checks !== "object" || body.checks === null) {
          throw new Error(`unexpected answer from backend (HTTP ${response.status})`);
        }
        checks.api = makeCheck("ok", apiStartedAt);
        for (const [name, check] of Object.entries(body.checks)) {
          if (isCheck(check)) checks[name] = check;
        }
      }
    } catch (error) {
      console.error("[health] api is down:", error);
      checks.api = makeCheck("down", apiStartedAt);
    }
  }

  const status = rollUp(checks);
  res
    .status(status === "down" ? 503 : 200)
    .setHeader("Cache-Control", "no-store")
    .json({ status, checked_at: new Date().toISOString(), checks });
}
