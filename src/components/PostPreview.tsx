import { useState } from "react";
import { publishPost } from "../api/client";
import type { Post } from "../types";

interface PostPreviewProps {
  post: Post;
  onPublish: () => void;
}

export default function PostPreview({ post, onPublish }: PostPreviewProps) {
  const [customMessage, setCustomMessage] = useState(post.customMessage || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  async function handlePublish() {
    if (!confirm("Are you sure you want to publish this post to LinkedIn?")) return;
    setIsPublishing(true);
    setStatusMessage("Publishing to LinkedIn…");
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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {post.status === "posted" ? "Published Post" : "Post Preview"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            🔗 LinkedIn · ID: {post.postId.slice(0, 8)}…
          </p>
        </div>
        <StatusBadge status={post.status} />
      </div>

      {/* Source headline */}
      {post.newsHeadline && (
        <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-md p-3">
          <p className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            Source Headline
          </p>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{post.newsHeadline}</p>
          {post.newsUrl && (
            <a
              href={post.newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
            >
              Source ↗
            </a>
          )}
        </div>
      )}

      {/* Generated content — scrollable */}
      {post.generatedContent && (
        <div>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Generated Post Content
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-3 max-h-64 overflow-y-auto">
            <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {post.generatedContent}
            </p>
          </div>
        </div>
      )}

      {/* Running state */}
      {(post.status === "pending" || post.status === "running") && (
        <p className="text-xs text-blue-600 dark:text-blue-400 animate-pulse">
          ⏳ Pipeline is running… this page will refresh automatically.
        </p>
      )}

      {/* Error state */}
      {post.status === "failed" && post.error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md p-3">
          <p className="text-xs text-red-800 dark:text-red-300">
            <strong>Error:</strong> {post.error}
          </p>
        </div>
      )}

      {/* Posted confirmation */}
      {post.status === "posted" && (
        <p className="text-xs text-green-700 dark:text-green-400">
          ✓ Posted to LinkedIn at{" "}
          {post.postedAt ? new Date(post.postedAt).toLocaleString() : "unknown time"}
        </p>
      )}

      {/* Publish controls — draft only */}
      {post.status === "draft" && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col gap-3">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
            Custom message before publishing{" "}
            <span className="text-slate-400 dark:text-slate-500">(optional)</span>
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="self-start px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-semibold rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {isPublishing ? "Publishing…" : "Publish to LinkedIn"}
          </button>
        </div>
      )}

      {statusMessage && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{statusMessage}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Post["status"] }) {
  const styles: Record<Post["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    running: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    draft:   "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    posted:  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    failed:  "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
