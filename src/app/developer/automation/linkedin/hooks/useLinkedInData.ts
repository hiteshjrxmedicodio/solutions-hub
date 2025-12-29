import { useState, useEffect, useCallback } from "react";
import { SolutionCard, LinkedInPost } from "../types";

interface UseLinkedInDataReturn {
  recentPosts: LinkedInPost[];
  newListings: SolutionCard[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  refreshListings: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

export function useLinkedInData(): UseLinkedInDataReturn {
  const [recentPosts, setRecentPosts] = useState<LinkedInPost[]>([]);
  const [newListings, setNewListings] = useState<SolutionCard[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/automation/linkedin/posts");
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

  const fetchNewListings = useCallback(async () => {
    try {
      const response = await fetch("/api/solutions");
      const data = await response.json();
      if (data.success) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recent = data.data.filter((card: SolutionCard) => {
          const created = new Date(card.createdAt);
          return created >= weekAgo;
        });
        setNewListings(recent);
      } else {
        setError(data.error || "Failed to fetch listings");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to fetch listings");
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

  const refreshListings = useCallback(async () => {
    await fetchNewListings();
  }, [fetchNewListings]);

  const refreshUnreadCount = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([
        fetchRecentPosts(),
        fetchNewListings(),
        fetchUnreadCount(),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchRecentPosts, fetchNewListings, fetchUnreadCount]);

  return {
    recentPosts,
    newListings,
    unreadCount,
    isLoading,
    error,
    refreshPosts,
    refreshListings,
    refreshUnreadCount,
  };
}

