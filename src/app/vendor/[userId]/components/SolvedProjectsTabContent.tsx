"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SolvedListing {
  _id: string;
  title: string;
  description: string;
  category: string[];
  priority: string;
  budgetRange?: string;
  timeline?: string;
  institutionName?: string;
  contactName: string;
  contactEmail: string;
  proposals?: Array<{
    vendorUserId: string;
    vendorName: string;
    proposalText: string;
    proposedPrice?: string;
    proposedTimeline?: string;
    submittedAt: string;
    status: string;
  }>;
  createdAt: string;
  publishedAt?: string;
}

interface SolvedProjectsTabContentProps {
  vendorUserId: string;
  enabledSubSections?: string[];
}

export function SolvedProjectsTabContent({ vendorUserId, enabledSubSections = [] }: SolvedProjectsTabContentProps) {
  const isSubSectionEnabled = (subSectionId: string) => {
    return enabledSubSections.includes(`solved.${subSectionId}`);
  };
  const router = useRouter();
  const [listings, setListings] = useState<SolvedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSolvedListings() {
      try {
        setLoading(true);
        const response = await fetch(`/api/listings/vendor/${vendorUserId}/solved`);
        if (!response.ok) {
          throw new Error("Failed to fetch solved listings");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setListings(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching solved listings:", err);
        setError(err instanceof Error ? err.message : "Failed to load solved listings");
      } finally {
        setLoading(false);
      }
    }

    if (vendorUserId) {
      fetchSolvedListings();
    }
  }, [vendorUserId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAcceptedProposal = (listing: SolvedListing) => {
    if (!listing.proposals) return null;
    return listing.proposals.find(
      (p) => p.vendorUserId === vendorUserId && p.status === "accepted"
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-zinc-300 border-t-zinc-900 mx-auto mb-4"></div>
            <p className="text-zinc-600">Loading solved projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Solved Projects</h2>
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-zinc-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">No solved projects yet</h3>
          <p className="text-zinc-600">
            Projects where your proposals have been accepted will appear here
          </p>
        </div>
      </div>
    );
  }

  if (!isSubSectionEnabled("solved-projects-list")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <h2 className="text-xl font-semibold text-zinc-900 mb-6">Solved Projects</h2>
        <p className="text-zinc-600 mb-6">
          Projects where your proposals have been accepted by customers
        </p>
        
        <div className="space-y-4">
          {listings.map((listing) => {
            const acceptedProposal = getAcceptedProposal(listing);
            return (
              <div
                key={listing._id}
                className="border border-zinc-300 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => router.push(`/listings/${listing._id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">{listing.title}</h3>
                    <p className="text-zinc-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-300 ml-4 flex-shrink-0">
                    Solved
                  </span>
                </div>
                
                {listing.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.category.slice(0, 3).map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs border border-zinc-300"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                
                {acceptedProposal && (
                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-zinc-700">Your Proposal:</span>
                        <span className="text-zinc-600">{acceptedProposal.proposalText.substring(0, 100)}...</span>
                      </div>
                      {(acceptedProposal.proposedPrice || acceptedProposal.proposedTimeline) && (
                        <div className="flex gap-4 text-sm text-zinc-600">
                          {acceptedProposal.proposedPrice && (
                            <span>Price: {acceptedProposal.proposedPrice}</span>
                          )}
                          {acceptedProposal.proposedTimeline && (
                            <span>Timeline: {acceptedProposal.proposedTimeline}</span>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-zinc-500">
                        Accepted on {formatDate(acceptedProposal.submittedAt)}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-4">
                    {listing.institutionName && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {listing.institutionName}
                      </span>
                    )}
                    {listing.budgetRange && listing.budgetRange !== 'Not specified' && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {listing.budgetRange}
                      </span>
                    )}
                  </div>
                  <span>{formatDate(listing.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

