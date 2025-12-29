import { useState, useEffect, useCallback } from "react";
import { BlogPost } from "../types";

interface UseBlogDataReturn {
  recentPosts: BlogPost[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

export function useBlogData(): UseBlogDataReturn {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/automation/blog/posts");
      const data = await response.json();
      if (data.success) {
        setRecentPosts(data.posts || []);
      } else {
        setError(data.error || "Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts");
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch("/api/automation/notifications?filter=unread");
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.notifications?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    await fetchRecentPosts();
  }, [fetchRecentPosts]);

  const refreshUnreadCount = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([
        fetchRecentPosts(),
        fetchUnreadCount(),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchRecentPosts, fetchUnreadCount]);

  return {
    recentPosts,
    unreadCount,
    isLoading,
    error,
    refreshPosts,
    refreshUnreadCount,
  };
}

