/**
 * App.tsx
 * -------
 * The main React component that holds the entire UI.
 *
 * Layout (top to bottom):
 *   1. Header — app title and tagline
 *   2. Dashboard — region selector + manual trigger button + schedule info
 *   3. Latest Post Preview — preview the most recent generated post
 *   4. Post History — table of past posts
 *   5. Company Info — view/edit the company profile
 *
 * State managed at this level:
 *   - posts: the list of past posts (refreshed every 10 seconds while pipeline is running)
 *   - settings: the current region and company profile
 *   - selectedPost: which post is being previewed in the preview modal
 */

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import PostHistory from "./components/PostHistory";
import PostPreview from "./components/PostPreview";
import CompanyInfo from "./components/CompanyInfo";
import { fetchPosts, fetchSettings } from "./api/client";
import type { Post, Settings } from "./types";

export default function App() {
  // Application state — held here at the top level and passed down to components
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Settings>({ region: "Canada", company_markdown: "" });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load posts and settings from the API when the app first mounts.
   * useEffect with an empty dependency array [] runs only once on first render.
   */
  useEffect(() => {
    loadAllData();
  }, []);

  /**
   * Reload posts every 10 seconds — but only if a pipeline run is in progress.
   * This way the UI updates automatically as the pipeline progresses.
   */
  useEffect(() => {
    const hasRunningPost = posts.some(
      (post) => post.status === "running" || post.status === "pending"
    );

    if (!hasRunningPost) {
      return; // Nothing in progress — skip auto-refresh
    }

    // Set up a timer that fires every 10 seconds
    const intervalId = setInterval(() => {
      loadPosts();
    }, 10_000);

    // Clean up the timer when the component re-renders or unmounts
    return () => clearInterval(intervalId);
  }, [posts]);

  /** Loads both posts and settings from the API */
  async function loadAllData() {
    setIsLoading(true);
    try {
      await Promise.all([loadPosts(), loadSettings()]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /** Fetches the post history from the API */
  async function loadPosts() {
    const response = await fetchPosts();
    setPosts(response.posts);
  }

  /** Fetches the current settings from the API */
  async function loadSettings() {
    const response = await fetchSettings();
    setSettings(response.settings);
  }

  // The most recent post — shown in the preview section
  const latestPost = posts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Dashboard — region control, schedule info, manual trigger */}
        <Dashboard
          settings={settings}
          onSettingsChange={setSettings}
          onTriggered={loadPosts}
        />

        {/* Latest post preview — only shown if we have at least one post */}
        {latestPost && (
          <PostPreview
            post={latestPost}
            onPublish={loadPosts}
          />
        )}

        {/* Post history table */}
        <PostHistory
          posts={posts}
          isLoading={isLoading}
          onSelectPost={setSelectedPost}
        />

        {/* Company info viewer/editor */}
        <CompanyInfo
          companyMarkdown={settings.company_markdown}
          onSave={(updated) => setSettings({ ...settings, company_markdown: updated })}
        />
      </main>

      {/* Selected post modal (only shown when user clicks a post in history) */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PostPreview post={selectedPost} onPublish={loadPosts} />
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setSelectedPost(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
