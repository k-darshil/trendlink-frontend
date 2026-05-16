import { LinkedInIcon } from "./icons";
import { formatDateWithRegion, getFlag } from "../utils/regions";
import type { Post } from "../types";

interface PostHistoryProps {
  posts: Post[];
  isLoading: boolean;
  onViewPost: (post: Post) => void;
  searchQuery: string;
}

export default function PostHistory({ posts, isLoading, onViewPost, searchQuery }: PostHistoryProps) {
  const filtered = posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.newsHeadline?.toLowerCase().includes(q) ||
      p.region?.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
      {isLoading && (
        <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      )}

      {!isLoading && posts.length === 0 && (
        <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
          No posts yet. Go to Dashboard and click "Run Now" to create your first one.
        </p>
      )}

      {!isLoading && posts.length > 0 && filtered.length === 0 && (
        <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
          No posts match your search.
        </p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Headline</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Region</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Triggered By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr
                  key={post.postId}
                  onClick={() => onViewPost(post)}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDateWithRegion(post.updatedAt, post.region)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <LinkedInIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs text-slate-700 dark:text-slate-300">LinkedIn</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {post.newsHeadline || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {post.region ? `${getFlag(post.region)} ${post.region}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {post.triggeredBy || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
