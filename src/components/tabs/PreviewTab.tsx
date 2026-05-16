import PostPreview from "../PostPreview";
import type { Post } from "../../types";

interface PreviewTabProps {
  post: Post | null;
  onPublish: () => void;
  onBack: () => void;
}

export default function PreviewTab({ post, onPublish, onBack }: PreviewTabProps) {
  if (!post) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No post selected. Go to the{" "}
          <button
            onClick={onBack}
            className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
          >
            Posts tab
          </button>{" "}
          and click View on any post.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Post Preview</h2>
        <button
          onClick={onBack}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          ← Back to Posts
        </button>
      </div>
      <PostPreview post={post} onPublish={onPublish} />
    </div>
  );
}
