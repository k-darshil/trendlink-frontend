/**
 * PostPreview.tsx
 * ---------------
 * Shows the generated LinkedIn post for a single record.
 * If the post is a "draft" (dry-run), the user can publish it for real.
 */

import { useState } from "react";
import { publishPost } from "../api/client";
import type { Post } from "../types";

interface PostPreviewProps {
  post: Post;
  onPublish: () => void;  // Called after a successful publish so parent can refresh
}

export default function PostPreview({ post, onPublish }: PostPreviewProps) {
  const [customMessage, setCustomMessage] = useState(post.customMessage || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  /** Publish this draft post to LinkedIn for real */
  async function handlePublish() {
    if (!confirm("Are you sure you want to publish this post to LinkedIn?")) {
      return;
    }

    setIsPublishing(true);
    setStatusMessage("Publishing to LinkedIn...");

    try {
      await publishPost(post.postId, customMessage);
      setStatusMessage("Posted successfully to LinkedIn!");
      onPublish();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatusMessage(`Failed to publish: ${message}`);
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {post.status === "posted" ? "Latest Post" : "Latest Draft"}
        </h2>
        <span className="text-xs text-gray-500">
          ID: {post.postId.slice(0, 8)}...
        </span>
      </div>

      {/* News article info */}
      {post.newsHeadline && (
        <div className="bg-gray-50 rounded p-3 mb-4 text-sm">
          <p className="text-gray-600 mb-1">Based on news article:</p>
          <p className="font-medium text-gray-900">{post.newsHeadline}</p>
          {post.newsUrl && (
            <a
              href={post.newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs"
            >
              Source →
            </a>
          )}
        </div>
      )}

      {/* The generated post content */}
      {post.generatedContent && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <p className="text-sm text-gray-900 whitespace-pre-wrap">
            {post.generatedContent}
          </p>
        </div>
      )}

      {/* Show error if the pipeline failed */}
      {post.status === "failed" && post.error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm text-red-900">
            <strong>Error:</strong> {post.error}
          </p>
        </div>
      )}

      {/* Show "running" indicator if still in progress */}
      {(post.status === "pending" || post.status === "running") && (
        <p className="text-sm text-blue-600 mb-4">
          Pipeline is running... this page will refresh automatically.
        </p>
      )}

      {/* Publish controls — only shown for drafts */}
      {post.status === "draft" && (
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a custom message before publishing (optional)
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isPublishing ? "Publishing..." : "Publish to LinkedIn"}
          </button>
        </div>
      )}

      {/* Confirmation that the post was published */}
      {post.status === "posted" && (
        <p className="text-sm text-green-700">
          Posted to LinkedIn at {post.postedAt ? new Date(post.postedAt).toLocaleString() : "unknown time"}
        </p>
      )}

      {statusMessage && (
        <p className="text-sm text-gray-600 mt-3">{statusMessage}</p>
      )}
    </section>
  );
}
