"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { Listing } from "./types";
import { priorityColors } from "./types";

interface ListingHeaderProps {
  listing: Listing;
  listingId: string;
  isOwner: boolean;
  onClose: () => void;
}

/**
 * ListingHeader Component
 * 
 * Displays the main listing header with:
 * - Title and priority badge
 * - Category tags
 * - Description
 * - Metadata (budget, timeline, views, proposals)
 * - Edit button for owners
 */
export function ListingHeader({ listing, listingId, isOwner, onClose }: ListingHeaderProps) {
  const router = useRouter();

  // Memoize metadata items to avoid unnecessary re-renders
  const metadataItems = useMemo(() => {
    const items = [];
    
    if (listing.budgetRange && listing.budgetRange !== "Not specified") {
      items.push({
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: listing.budgetRange,
        ariaLabel: `Budget: ${listing.budgetRange}`,
      });
    }
    
    if (listing.timeline) {
      items.push({
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: listing.timeline,
        ariaLabel: `Timeline: ${listing.timeline}`,
      });
    }
    
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      label: `${listing.viewsCount} views`,
      ariaLabel: `${listing.viewsCount} views`,
    });
    
    items.push({
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: `${listing.proposalsCount} proposals`,
      ariaLabel: `${listing.proposalsCount} proposals`,
    });
    
    return items;
  }, [listing.budgetRange, listing.timeline, listing.viewsCount, listing.proposalsCount]);

  const handleEdit = () => {
    onClose();
    router.push(`/listings/${listingId}/edit`);
  };

  return (
    <header className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 w-full">
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <h1 id="modal-title" className="text-3xl font-bold text-zinc-900">
              {listing.title}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${priorityColors[listing.priority]}`}
              aria-label={`Priority: ${listing.priority}`}
            >
              {listing.priority}
            </span>
          </div>
          {listing.category.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1.5" role="list" aria-label="Categories">
              {listing.category.map((cat, idx) => (
                <span
                  key={`category-${cat}-${idx}`}
                  className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium border border-zinc-200"
                  role="listitem"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
        {isOwner && (
          <button
            onClick={handleEdit}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg transition-colors ml-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Edit listing"
            type="button"
          >
            Edit
          </button>
        )}
      </div>

      <p className="text-zinc-700 text-base leading-snug mb-2">{listing.description}</p>

      <div className="flex flex-wrap gap-3 text-sm text-zinc-600 pt-2 border-t border-zinc-200" role="list" aria-label="Listing metadata">
        {metadataItems.map((item, idx) => (
          <span
            key={`metadata-${idx}`}
            className="flex items-center gap-1.5"
            role="listitem"
            aria-label={item.ariaLabel}
          >
            {item.icon}
            {item.label}
          </span>
        ))}
      </div>
    </header>
  );
}

