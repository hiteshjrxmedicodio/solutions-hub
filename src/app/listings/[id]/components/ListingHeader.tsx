"use client";

import { useRouter } from "next/navigation";
import type { Listing } from "./types";
import { priorityColors } from "./types";

interface ListingHeaderProps {
  listing: Listing;
  listingId: string;
  isOwner: boolean;
}

export function ListingHeader({ listing, listingId, isOwner }: ListingHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-zinc-900">{listing.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[listing.priority]}`}>
              {listing.priority}
            </span>
          </div>
          {listing.category.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.category.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
        {isOwner && (
          <button
            onClick={() => router.push(`/listings/${listingId}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      
      <p className="text-zinc-700 text-lg leading-relaxed mb-4">{listing.description}</p>
      
      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 pt-4 border-t border-zinc-200">
        {listing.budgetRange && listing.budgetRange !== 'Not specified' && (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {listing.budgetRange}
          </span>
        )}
        {listing.timeline && (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {listing.timeline}
          </span>
        )}
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {listing.viewsCount} views
        </span>
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {listing.proposalsCount} proposals
        </span>
      </div>
    </div>
  );
}

