import { useState } from "react";
import { updateSettings } from "../api/client";

interface CompanyInfoProps {
  companyMarkdown: string;
  onSave: (updated: string) => void;
}

export default function CompanyInfo({ companyMarkdown, onSave }: CompanyInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(companyMarkdown);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  function handleStartEditing() {
    setDraftContent(companyMarkdown);
    setIsEditing(true);
    setStatusMessage("");
  }

  function handleCancel() {
    setDraftContent(companyMarkdown);
    setIsEditing(false);
  }

  async function handleSave() {
    setIsSaving(true);
    setStatusMessage("Saving…");
    try {
      await updateSettings({ company_markdown: draftContent });
      onSave(draftContent);
      setStatusMessage("Saved!");
      setIsEditing(false);
      setTimeout(() => setStatusMessage(""), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatusMessage(`Failed to save: ${message}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Company Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Guides the AI when generating posts. Supports Markdown.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartEditing}
            className="text-xs text-blue-700 dark:text-blue-400 hover:underline font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {!isEditing && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-3 max-h-80 overflow-y-auto">
          <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
            {companyMarkdown || "No company profile saved yet. Click Edit to add one."}
          </pre>
        </div>
      )}

      {isEditing && (
        <div className="flex flex-col gap-3">
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            rows={16}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
            placeholder={"## About\nWe are a B2B SaaS company...\n\n## Tone\nProfessional, concise, thought-leadership focused."}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-semibold rounded-md transition-colors disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {statusMessage && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{statusMessage}</p>
      )}
    </div>
  );
}
