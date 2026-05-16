import Dashboard from "../Dashboard";
import { LinkedInIcon } from "../icons";
import { getFlag } from "../../utils/regions";
import type { Post, Settings } from "../../types";

interface DashboardTabProps {
  posts: Post[];
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
  onTriggered: () => void;
}

export default function DashboardTab({ posts, settings, onTriggered }: DashboardTabProps) {
  const postedCount  = posts.filter(p => p.status === "posted").length;
  const draftCount   = posts.filter(p => p.status === "draft").length;
  const runningCount = posts.filter(p => p.status === "running" || p.status === "pending").length;
  const erroredCount = posts.filter(p => p.status === "failed").length;
  const totalCount   = postedCount + draftCount + runningCount + erroredCount;

  const thisWeek = posts.filter(p => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(p.updatedAt) >= weekAgo && p.status === "posted";
  }).length;

  const flag = getFlag(settings.region);

  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Post Summary card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Post Summary
          </p>
          <div className="grid grid-cols-4 gap-1 mb-2">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-green-600 dark:text-green-400">{postedCount}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 text-center leading-tight">LinkedIn</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{draftCount}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 text-center leading-tight">Draft</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{runningCount}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 text-center leading-tight">Running</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-red-600 dark:text-red-400">{erroredCount}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 text-center leading-tight">Errored</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-700 pt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">{totalCount}</span>
          </div>
          {thisWeek > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ {thisWeek} posted this week</p>
          )}
        </div>

        {/* Platform card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Platform
          </p>
          <div className="flex items-center gap-2 mt-1">
            <LinkedInIcon className="w-5 h-5 shrink-0" />
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">LinkedIn</span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">+2 coming soon</p>
        </div>

        {/* Region card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Region
          </p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            {flag} {settings.region}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Change in Settings</p>
        </div>
      </div>

      <Dashboard settings={settings} onTriggered={onTriggered} />
    </div>
  );
}
