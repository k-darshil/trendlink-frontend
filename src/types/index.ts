/**
 * types/index.ts
 * --------------
 * TypeScript type definitions used across the frontend.
 *
 * TypeScript lets us define the "shape" of our data.
 * If we say a Post has a `status` field, TypeScript will warn us
 * if we accidentally try to use a field that doesn't exist.
 */

/** Represents a single LinkedIn post record from DynamoDB */
export interface Post {
  postId: string;
  status: "pending" | "running" | "draft" | "posted" | "failed";
  generatedContent: string;
  newsHeadline: string;
  newsUrl: string;
  region: string;
  customMessage?: string;      // Optional — not always set
  linkedinPostId?: string;     // Only set after posting to LinkedIn
  startedAt: string;           // ISO date string
  updatedAt: string;           // ISO date string
  postedAt?: string;           // Only set when status is "posted"
  error?: string;              // Only set when status is "failed"
  triggeredBy?: "manual" | "scheduled";
}

/** App-wide settings stored in DynamoDB */
export interface Settings {
  region: string;              // e.g., "Canada", "India", "United States"
  company_markdown: string;   // The full company profile text
}

/** The response shape from GET /posts */
export interface PostsResponse {
  posts: Post[];
}

/** The response shape from GET /settings */
export interface SettingsResponse {
  settings: Settings;
}

/** The response shape from POST /trigger */
export interface TriggerResponse {
  message: string;
  post_id: string;
  status: string;
}
