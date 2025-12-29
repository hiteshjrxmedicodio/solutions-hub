"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar as AutomationSidebar } from "../components/Sidebar";
import { Sidebar } from "@/components/Sidebar";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export default function NotificationsCenterPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
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
      fetchNotifications();
    }
  }, [isSuperAdmin, filter]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/automation/notifications?filter=${filter}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/automation/notifications/${notificationId}/read`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/automation/notifications/read-all", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "vendor_created":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "customer_started_using_vendor":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "new_listing":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        );
      case "solution_published":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "vendor_created":
        return "bg-blue-100 text-blue-600";
      case "customer_started_using_vendor":
        return "bg-green-100 text-green-600";
      case "new_listing":
        return "bg-purple-100 text-purple-600";
      case "solution_published":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-zinc-100 text-zinc-600";
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.isRead);

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
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-zinc-900">
                Notifications Center
              </h1>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <p className="text-zinc-600">
              View and manage all system notifications
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 border-b border-zinc-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                filter === "all"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                filter === "unread"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                filter === "read"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-zinc-400 mx-auto mb-4"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p className="text-zinc-500 text-lg font-medium">
                No notifications found
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                {filter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : filter === "read"
                  ? "No read notifications yet."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white border rounded-lg p-4 transition-colors ${
                    notification.isRead
                      ? "border-zinc-200"
                      : "border-blue-300 bg-blue-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3
                          className={`font-semibold ${
                            notification.isRead
                              ? "text-zinc-700"
                              : "text-zinc-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="ml-2 h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {notification.actionLabel || "View →"}
                            </a>
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-zinc-500 hover:text-zinc-700 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Sidebar - Fixed (30% wider: 288px * 1.3 = 375px) */}
        <aside className="fixed right-0 top-28 bottom-0 w-[375px] flex-shrink-0 pl-6 pr-6 overflow-y-auto z-30">
          <AutomationSidebar unreadCount={unreadCount} />
        </aside>
      </div>
    </div>
  );
}

