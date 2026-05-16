import { useState } from "react";
import { triggerPipeline } from "../api/client";
import { getTimezoneAbbr } from "../utils/regions";
import type { Settings } from "../types";

interface DashboardProps {
  settings: Settings;
  onTriggered: () => void;
}

export default function Dashboard({ settings, onTriggered }: DashboardProps) {
  const [customMessage, setCustomMessage] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  async function handleTrigger() {
    setIsTriggering(true);
    setStatusMessage("Starting pipeline...");
    try {
      const response = await triggerPipeline(customMessage, dryRun);
      setStatusMessage(`Pipeline started! Post ID: ${response.post_id}`);
      setCustomMessage("");
      onTriggered();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatusMessage(`Failed to start: ${message}`);
    } finally {
      setIsTriggering(false);
    }
  }

  const tzAbbr = getTimezoneAbbr(settings.region);

  return (
    <div className="flex flex-col gap-4">
      {/* Schedule info banner */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 border-l-4 border-l-blue-700 dark:border-l-blue-500 rounded-lg p-4 flex items-center gap-3">
        <span className="text-xl select-none">📅</span>
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Next Scheduled Run
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            Daily at 8:00 PM{tzAbbr ? ` ${tzAbbr}` : ""}
          </p>
        </div>
        <span className="ml-auto bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 select-none pointer-events-none">
          ● Active
        </span>
      </div>

      {/* Manual trigger card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Manual Trigger
        </h3>

        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
          Custom message <span className="text-slate-400 dark:text-slate-500">(optional)</span>
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={3}
          placeholder="Add a personal note to be included in the post..."
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mb-4"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Dry-run mode <span className="text-slate-400 dark:text-slate-500">(won't post live)</span>
            </span>
          </label>

          <button
            onClick={handleTrigger}
            disabled={isTriggering}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-semibold rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {isTriggering ? "Starting…" : "▶ Run Now"}
          </button>
        </div>

        {statusMessage && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">{statusMessage}</p>
        )}
      </div>
    </div>
  );
}
