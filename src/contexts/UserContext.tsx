"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface UserData {
  role: "buyer" | "seller" | null;
  hasInstitutionProfile: boolean;
  hasVendorProfile: boolean;
  profileCompletedAt?: Date;
  lastLoginAt?: Date;
}

interface UserContextType {
  userData: UserData | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
  updateRole: (role: "buyer" | "seller" | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const CACHE_KEY = "user_data_cache";
const CACHE_TIMESTAMP_KEY = "user_data_cache_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from cache on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_DURATION) {
        try {
          const parsed = JSON.parse(cached);
          setUserData(parsed);
          setIsLoading(false);
          // Continue to fetch in background to refresh cache
        } catch (e) {
          // Invalid cache, clear it
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        }
      } else {
        // Cache expired, clear it
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      }
    }
  }, []);

  const fetchUserData = async (skipLoadingState = false) => {
    if (!isLoaded || !user?.id) {
      if (!skipLoadingState) setIsLoading(false);
      return;
    }

    if (!skipLoadingState) setIsLoading(true);

    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.success && data.data) {
        const userData: UserData = {
          role: data.data.role || null,
          hasInstitutionProfile: data.data.hasInstitutionProfile || false,
          hasVendorProfile: data.data.hasVendorProfile || false,
          profileCompletedAt: data.data.profileCompletedAt,
          lastLoginAt: data.data.lastLoginAt ? new Date(data.data.lastLoginAt) : undefined,
        };

        setUserData(userData);

        // Cache the data
        if (typeof window !== "undefined") {
          localStorage.setItem(CACHE_KEY, JSON.stringify(userData));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        }
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    } finally {
      if (!skipLoadingState) setIsLoading(false);
    }
  };

  // Fetch user data when Clerk user is loaded
  useEffect(() => {
    if (!isLoaded || !user?.id) {
      setIsLoading(false);
      return;
    }

    // Check if we have valid cache
    let hasValidCache = false;
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age < CACHE_DURATION) {
          hasValidCache = true;
        }
      }
    }

    // If no valid cache, fetch now with loading state
    // If we have cache, fetch in background without loading state
    fetchUserData(hasValidCache);
  }, [user?.id, isLoaded]);

  const refetch = async () => {
    setIsLoading(true);
    await fetchUserData();
  };

  const updateRole = (role: "buyer" | "seller" | null) => {
    if (userData) {
      const updated = { ...userData, role };
      setUserData(updated);
      
      // Update cache
      if (typeof window !== "undefined") {
        localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      }
    }
  };

  return (
    <UserContext.Provider value={{ userData, isLoading, refetch, updateRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
}

