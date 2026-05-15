import { useState } from "react";
import PostHistory from "../PostHistory";
import type { Post } from "../../types";

interface PostsTabProps {
  posts: Post[];
  isLoading: boolean;
  onViewPost: (post: Post) => void;
}

export default function PostsTab({ posts, isLoading, onViewPost }: PostsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Post History</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-52 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
