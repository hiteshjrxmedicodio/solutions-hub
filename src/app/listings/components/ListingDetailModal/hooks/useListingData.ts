"use client";

import { useState, useEffect, useCallback } from "react";

interface UseListingDataOptions {
  listingId: string | null;
  isOpen: boolean;
}

interface UseListingDataReturn {
  listing: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing listing data
 * Handles loading states, error handling, and data refresh
 */
export function useListingData({ listingId, isOpen }: UseListingDataOptions): UseListingDataReturn {
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = useCallback(async () => {
    if (!listingId) {
      setListing(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/listings/${listingId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch listing: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setListing(data.data);
      } else {
        throw new Error(data.error || "Listing not found");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load listing";
      setError(errorMessage);
      console.error("Error fetching listing:", err);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    if (isOpen && listingId) {
      // Always refetch when modal opens to ensure we have the latest data
      // This ensures the modal shows the current status even if it was changed in the card
      fetchListing();
    } else {
      setListing(null);
      setError(null);
    }
  }, [isOpen, listingId, fetchListing]);

  return {
    listing,
    loading,
    error,
    refetch: fetchListing,
  };
}

