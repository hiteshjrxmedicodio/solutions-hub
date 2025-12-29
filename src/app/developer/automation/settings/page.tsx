"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar as AutomationSidebar } from "../components/Sidebar";
import { Sidebar } from "@/components/Sidebar";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLinkedInEnabled, setIsLinkedInEnabled] = useState(false);
  const [isBlogEnabled, setIsBlogEnabled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";

  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user && !isSuperAdmin) {
      router.push("/solutions-hub");
    }
  }, [isLoaded, user, isSuperAdmin, router]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLinkedInStatus();
      fetchBlogStatus();
      fetchUnreadCount();
    }
  }, [isSuperAdmin]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/automation/notifications?filter=unread");
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.notifications?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchLinkedInStatus = async () => {
    try {
      const response = await fetch("/api/automation/linkedin/status");
      const data = await response.json();
      if (data.success) {
        setIsLinkedInEnabled(data.enabled || false);
      }
    } catch (error) {
      console.error("Error fetching LinkedIn status:", error);
    }
  };

  const fetchBlogStatus = async () => {
    try {
      // In the future, add blog status API endpoint
      // For now, default to false
      setIsBlogEnabled(false);
    } catch (error) {
      console.error("Error fetching blog status:", error);
    }
  };

  const toggleLinkedIn = async () => {
    try {
      const newEnabled = !isLinkedInEnabled;
      const response = await fetch("/api/automation/linkedin/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newEnabled }),
      });
      const data = await response.json();
      if (data.success) {
        setIsLinkedInEnabled(data.enabled);
      }
    } catch (error) {
      console.error("Error toggling LinkedIn automation:", error);
    }
  };

  const toggleBlog = async () => {
    try {
      // In the future, add blog toggle API endpoint
      const newEnabled = !isBlogEnabled;
      setIsBlogEnabled(newEnabled);
    } catch (error) {
      console.error("Error toggling blog automation:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex min-h-full pt-28 pb-12">
        {/* Main Content - Increased width (sidebar: 375px + 24px left padding + 24px right padding = 423px) */}
        <main className={`flex-1 mr-[423px] pl-8 pr-12 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">Settings</h1>
            <p className="text-zinc-600">
              Configure automated posting and workflow settings
            </p>
          </div>

          <div className="space-y-6">
            {/* LinkedIn Automation Settings */}
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-1">
                    LinkedIn Post Automation
                  </h2>
                  <p className="text-sm text-zinc-600">
                    Automatically create and post to LinkedIn when new solution listings are added
                  </p>
                </div>
                <button
                  onClick={toggleLinkedIn}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLinkedInEnabled ? "bg-blue-600" : "bg-zinc-200"
                  }`}
                  role="switch"
                  aria-checked={isLinkedInEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isLinkedInEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-200">
                <p className="text-sm text-zinc-500">
                  {isLinkedInEnabled
                    ? "Automated posting is enabled. New solution listings will automatically generate and post to LinkedIn."
                    : "Automated posting is disabled. You can manually create posts from the LinkedIn Post Agent page."}
                </p>
              </div>
            </div>

            {/* Blog Post Automation Settings */}
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-1">
                    Blog Post Automation
                  </h2>
                  <p className="text-sm text-zinc-600">
                    Automatically generate blog posts based on scheduled topics
                  </p>
                </div>
                <button
                  onClick={toggleBlog}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    isBlogEnabled ? "bg-green-600" : "bg-zinc-200"
                  }`}
                  role="switch"
                  aria-checked={isBlogEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isBlogEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-200">
                <p className="text-sm text-zinc-500">
                  {isBlogEnabled
                    ? "Blog post automation is enabled."
                    : "Blog post automation is disabled. You can manually create posts from the Blog Post Agent page."}
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar - Fixed (30% wider: 288px * 1.3 = 375px) */}
        <aside className="fixed right-0 top-28 bottom-0 w-[375px] flex-shrink-0 pl-6 pr-6 overflow-y-auto z-30">
          <AutomationSidebar unreadCount={unreadCount} />
        </aside>
      </div>
    </div>
  );
}

