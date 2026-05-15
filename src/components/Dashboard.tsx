/**
 * Dashboard.tsx
 * -------------
 * The main control panel at the top of the app.
 * Contains:
 *   - Region selector (changes which country's news we search for)
 *   - Schedule info ("Runs daily at 8:00 PM" — static label, no controls)
 *   - Manual trigger button ("Run Now")
 *   - Custom message input (optional text added to the post)
 *   - Dry-run toggle (safe testing mode)
 */

import { useState } from "react";
import { triggerPipeline, updateSettings } from "../api/client";
import type { Settings } from "../types";

// List of regions the user can choose from for news targeting
const AVAILABLE_REGIONS = [
  "Canada",
  "United States",
  "India",
  "United Kingdom",
  "Australia",
  "Germany",
];

// The component receives these props from its parent (App.tsx)
interface DashboardProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onTriggered: () => void;  // Called after a manual trigger so the parent can refresh posts
}

export default function Dashboard({ settings, onSettingsChange, onTriggered }: DashboardProps) {
  // Local state for the trigger form (not part of saved settings)
  const [customMessage, setCustomMessage] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  /** Called when the user changes the region dropdown */
  async function handleRegionChange(newRegion: string) {
    // Update the UI immediately for snappy feedback
    onSettingsChange({ ...settings, region: newRegion });

    // Save the change to the backend
    try {
      await updateSettings({ region: newRegion });
      setStatusMessage(`Region updated to ${newRegion}`);
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (error) {
      setStatusMessage("Failed to save region — please try again");
    }
  }

  /** Called when the user clicks "Run Now" */
  async function handleTrigger() {
    setIsTriggering(true);
    setStatusMessage("Starting pipeline...");

    try {
      const response = await triggerPipeline(customMessage, dryRun);
      setStatusMessage(`Pipeline started! Post ID: ${response.post_id.slice(0, 8)}...`);
      setCustomMessage(""); // Clear the input
      onTriggered();         // Tell parent to refresh the post list
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatusMessage(`Failed to start: ${message}`);
    } finally {
      setIsTriggering(false);
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h2>

      {/* Schedule info — static display */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6">
        <p className="text-sm text-blue-900">
          <strong>Schedule:</strong> Runs daily at 8:00 PM (your AWS region's time zone)
        </p>
      </div>

      {/* Region selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Region for News
        </label>
        <select
          value={settings.region}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {AVAILABLE_REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          News searches will focus on this region.
        </p>
      </div>

      {/* Manual trigger section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Run Now (Manual Trigger)</h3>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Message (Optional)
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={3}
          placeholder="Add a personal note to be included in the post..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 mr-2"
          />
          <span className="text-sm text-gray-700">
            Dry-run mode (don't actually post to LinkedIn — recommended for testing)
          </span>
        </label>

        <button
          onClick={handleTrigger}
          disabled={isTriggering}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isTriggering ? "Starting..." : "Run Now"}
        </button>

        {statusMessage && (
          <p className="text-sm text-gray-600 mt-3">{statusMessage}</p>
        )}
      </div>
    </section>
  );
}
