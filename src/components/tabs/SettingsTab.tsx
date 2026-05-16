import { useState } from "react";
import CompanyInfo from "../CompanyInfo";
import { LinkedInIcon, TwitterXIcon, InstagramIcon } from "../icons";
import { updateSettings } from "../../api/client";
import { REGION_FLAGS } from "../../utils/regions";
import type { Settings } from "../../types";

const AVAILABLE_REGIONS = [
  "Canada",
  "United States",
  "India",
  "United Kingdom",
  "Australia",
  "Germany",
];

interface SettingsTabProps {
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
}

export default function SettingsTab({ settings, onSettingsChange }: SettingsTabProps) {
  const [regionStatus, setRegionStatus] = useState("");

  async function handleRegionChange(newRegion: string) {
    onSettingsChange({ ...settings, region: newRegion });
    try {
      await updateSettings({ region: newRegion });
      setRegionStatus(`Region updated to ${newRegion}`);
      setTimeout(() => setRegionStatus(""), 3000);
    } catch {
      setRegionStatus("Failed to save region — please try again");
    }
  }

  return (
    <div className="grid grid-cols-2 gap-5 items-start">
      {/* Left column: Region + Platforms */}
      <div className="flex flex-col gap-4">
        {/* Region */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Target Region
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            News searches will focus on this region.
          </p>
          <select
            value={settings.region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AVAILABLE_REGIONS.map((r) => (
              <option key={r} value={r}>
                {REGION_FLAGS[r] ?? "🌐"} {r}
              </option>
            ))}
          </select>
          {regionStatus && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{regionStatus}</p>
          )}
        </div>

        {/* Platforms */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Platforms
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked
                readOnly
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-blue-600"
              />
              <LinkedInIcon className="w-4 h-4 shrink-0" />
              <span className="text-xs text-slate-700 dark:text-slate-300">LinkedIn</span>
              <span className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <input
                type="checkbox"
                disabled
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
              />
              <TwitterXIcon className="w-4 h-4 shrink-0 text-slate-700 dark:text-slate-300" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Twitter / X</span>
              <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500">Coming soon</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <input
                type="checkbox"
                disabled
                className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600"
              />
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Instagram</span>
              <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500">Coming soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: Company Profile */}
      <CompanyInfo
        companyMarkdown={settings.company_markdown}
        onSave={(updated) => onSettingsChange({ ...settings, company_markdown: updated })}
      />
    </div>
  );
}
