import { useState, useEffect } from "react";
import PostHistory from "../PostHistory";
import type { Post } from "../../types";

interface PostsTabProps {
  posts: Post[];
  isLoading: boolean;
  /** True when at least one post is pending or running — enables the refresh button */
  hasActivePost: boolean;
  onViewPost: (post: Post) => void;
  /** Fetches fresh post data from the API */
  onRefresh: () => Promise<void>;
}

const COOLDOWN_SECONDS = 20;

export default function PostsTab({ posts, isLoading, hasActivePost, onViewPost, onRefresh }: PostsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Count down the cooldown timer every second
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const id = setInterval(() => {
      setCooldownRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldownRemaining]);

  async function handleRefresh() {
    setCooldownRemaining(COOLDOWN_SECONDS);
    await onRefresh();
  }

  const isRefreshDisabled = !hasActivePost || cooldownRemaining > 0 || isLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Post History</h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Refresh button — only active when a post is pending/running and cooldown has passed */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshDisabled}
            title={
              !hasActivePost
                ? "No active pipeline — nothing to refresh"
                : cooldownRemaining > 0
                ? `Wait ${cooldownRemaining}s before refreshing again`
                : "Refresh post status"
            }
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              isRefreshDisabled
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm cursor-pointer"
            }`}
          >
            {cooldownRemaining > 0 ? `Refresh (${cooldownRemaining}s)` : "Refresh"}
          </button>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full sm:w-52 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <PostHistory
        posts={posts}
        isLoading={isLoading}
        onViewPost={onViewPost}
        searchQuery={searchQuery}
      />
    </div>
  );
}
