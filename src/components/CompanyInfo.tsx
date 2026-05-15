/**
 * CompanyInfo.tsx
 * ---------------
 * Displays the company profile (in markdown format).
 * The user can edit the profile and save it back to DynamoDB.
 *
 * The pipeline reads this profile to understand the company's brand,
 * tone, and messaging when generating LinkedIn posts.
 */

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

  /** Switch to edit mode */
  function handleStartEditing() {
    setDraftContent(companyMarkdown);
    setIsEditing(true);
    setStatusMessage("");
  }

  /** Cancel without saving */
  function handleCancel() {
    setDraftContent(companyMarkdown);
    setIsEditing(false);
  }

  /** Save changes to the backend */
  async function handleSave() {
    setIsSaving(true);
    setStatusMessage("Saving...");

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
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Company Profile</h2>
        {!isEditing && (
          <button
            onClick={handleStartEditing}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-4">
        This profile guides the AI when generating LinkedIn posts.
        Update it to match your company's brand and tone.
      </p>

      {!isEditing && (
        // Read-only display — preserves whitespace using whitespace-pre-wrap
        <div className="bg-gray-50 rounded p-4 text-sm text-gray-800 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
          {companyMarkdown || "No company profile saved yet. Click Edit to add one."}
        </div>
      )}

      {isEditing && (
        <div>
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter your company profile in markdown format..."
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {statusMessage && (
        <p className="text-sm text-gray-600 mt-3">{statusMessage}</p>
      )}
    </section>
  );
}
