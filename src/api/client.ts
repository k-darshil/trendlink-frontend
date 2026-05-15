/**
 * api/client.ts
 * -------------
 * All API calls to the backend are defined here.
 *
 * Having all API calls in one file makes it easy to:
 * - See all the available endpoints at a glance
 * - Change the API base URL in one place
 * - Handle errors consistently
 *
 * Each function returns a Promise — meaning it runs in the background
 * and gives back a result when it finishes (or throws an error if it fails).
 */

import type { Post, PostsResponse, SettingsResponse, TriggerResponse, Settings } from "../types";

// The base URL of our API Gateway
// During local development, Vite proxies /api → your API Gateway URL (see vite.config.ts)
// In production (S3 + CloudFront), this should be the full API Gateway URL
const API_BASE = import.meta.env.VITE_API_URL || "/api";

/**
 * A shared helper that makes an HTTP request and handles errors.
 *
 * @param path    - The URL path, e.g., "/posts"
 * @param options - Standard fetch() options (method, body, headers)
 * @returns       - The parsed JSON response
 * @throws        - An Error with a message if the request fails
 */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // If the server returned an error status (4xx or 5xx), throw an error
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

/** Fetch all posts for the history view */
export async function fetchPosts(): Promise<PostsResponse> {
  return apiFetch<PostsResponse>("/posts");
}

/** Fetch a single post by ID (for the preview modal) */
export async function fetchPost(postId: string): Promise<{ post: Post }> {
  return apiFetch<{ post: Post }>(`/posts/${postId}`);
}

// ── Settings ──────────────────────────────────────────────────────────────────

/** Fetch the current app settings (region, company profile) */
export async function fetchSettings(): Promise<SettingsResponse> {
  return apiFetch<SettingsResponse>("/settings");
}

/** Save updated settings */
export async function updateSettings(settings: Partial<Settings>): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

/**
 * Manually trigger a pipeline run.
 *
 * @param customMessage - Optional custom text to include in the post
 * @param dryRun        - If true, don't actually post to LinkedIn (default: true)
 */
export async function triggerPipeline(
  customMessage: string = "",
  dryRun: boolean = true
): Promise<TriggerResponse> {
  return apiFetch<TriggerResponse>("/trigger", {
    method: "POST",
    body: JSON.stringify({
      custom_message: customMessage,
      dry_run: dryRun,
    }),
  });
}

/** Publish a draft post to LinkedIn */
export async function publishPost(
  postId: string,
  customMessage?: string
): Promise<{ message: string; linkedin_post_id: string }> {
  return apiFetch<{ message: string; linkedin_post_id: string }>(
    `/posts/${postId}/publish`,
    {
      method: "POST",
      body: JSON.stringify({ custom_message: customMessage }),
    }
  );
}
