/**
 * PostHistory.tsx
 * ---------------
 * Shows a table of all past pipeline runs and their status.
 * Each row is clickable — clicking opens a preview modal.
 */

import type { Post } from "../types";

interface PostHistoryProps {
  posts: Post[];
  isLoading: boolean;
  onSelectPost: (post: Post) => void;
}

export default function PostHistory({ posts, isLoading, onSelectPost }: PostHistoryProps) {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Post History</h2>

      {isLoading && <p className="text-gray-500">Loading...</p>}

      {!isLoading && posts.length === 0 && (
        <p className="text-gray-500">
          No posts yet. Click "Run Now" above to create your first one.
        </p>
      )}

      {posts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Headline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.postId}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectPost(post)}
                >
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{post.region || "—"}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                    {post.newsHeadline || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline text-xs">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** A small colored badge that shows the status of a post */
function StatusBadge({ status }: { status: Post["status"] }) {
  // Each status has different background/text colors for quick visual recognition
  const styles: Record<Post["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    draft: "bg-gray-100 text-gray-800",
    posted: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

/**
 * Formats an ISO date string into a human-readable format.
 * Example: "2026-05-01T20:00:00Z" → "May 1, 2026, 8:00 PM"
 */
function formatDate(isoString: string): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
