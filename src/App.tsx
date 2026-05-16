import { useEffect, useState, useMemo } from "react";
import TopNav from "./components/TopNav";
import TabBar, { type Tab } from "./components/TabBar";
import DashboardTab from "./components/tabs/DashboardTab";
import PostsTab from "./components/tabs/PostsTab";
import PreviewTab from "./components/tabs/PreviewTab";
import SettingsTab from "./components/tabs/SettingsTab";
import { useTheme } from "./hooks/useTheme";
import { fetchPosts, fetchSettings } from "./api/client";
import type { Post, Settings } from "./types";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Settings>({ region: "Canada", company_markdown: "" });
  const [isLoading, setIsLoading] = useState(true);
  const hasActivePost = useMemo(
    () => posts.some((p) => p.status === "running" || p.status === "pending"),
    [posts]
  );

  useEffect(() => {
    loadAllData();
  }, []);

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

  async function loadPosts() {
    const response = await fetchPosts();
    setPosts(response.posts);
  }

  async function loadSettings() {
    const response = await fetchSettings();
    setSettings(response.settings);
  }

  function handleViewPost(post: Post) {
    setSelectedPost(post);
    setActiveTab("preview");
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    if (tab !== "preview") setSelectedPost(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <TopNav theme={theme} onToggleTheme={toggleTheme} />
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {activeTab === "dashboard" && (
          <DashboardTab
            posts={posts}
            settings={settings}
            onSettingsChange={setSettings}
            onTriggered={loadPosts}
          />
        )}
        {activeTab === "posts" && (
          <PostsTab
            posts={posts}
            isLoading={isLoading}
            hasActivePost={hasActivePost}
            onViewPost={handleViewPost}
            onRefresh={loadPosts}
          />
        )}
        {activeTab === "preview" && (
          <PreviewTab
            post={selectedPost ?? (posts.length > 0 ? posts[0] : null)}
            onPublish={loadPosts}
            onBack={() => setActiveTab("posts")}
          />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            settings={settings}
            onSettingsChange={setSettings}
          />
        )}
      </main>
    </div>
  );
}
