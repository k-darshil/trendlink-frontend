import Dashboard from "../Dashboard";
import type { Post, Settings } from "../../types";

interface DashboardTabProps {
  posts: Post[];
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
  onTriggered: () => void;
}

export default function DashboardTab({ posts, settings, onTriggered }: DashboardTabProps) {
  const postedCount = posts.filter(p => p.status === "posted").length;
  const thisWeek = posts.filter(p => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(p.updatedAt) >= weekAgo && p.status === "posted";
  }).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Total Posts
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{postedCount}</p>
          {thisWeek > 0 && (
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-1">↑ {thisWeek} this week</p>
          )}
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Platform
          </p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">🔗 LinkedIn</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">+2 coming soon</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
          <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Region
          </p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">{settings.region}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Change in Settings</p>
        </div>
      </div>

      <Dashboard settings={settings} onTriggered={onTriggered} />
    </div>
  );
}
