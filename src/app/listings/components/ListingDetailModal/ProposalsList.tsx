import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { Listing } from "./types";
import { formatDate } from "./utils/formatDate";

interface ProposalsListProps {
  listing: Listing;
  onClose: () => void;
}

/**
 * ProposalsList Component
 * Displays all vendor proposals for a listing (owner view only)
 * Features proper date formatting and status badges
 */
export function ProposalsList({ listing, onClose }: ProposalsListProps) {
  const router = useRouter();

  // Memoize proposals check to avoid unnecessary re-renders
  const hasProposals = useMemo(() => {
    return listing.proposals && listing.proposals.length > 0;
  }, [listing.proposals]);

  if (!hasProposals) {
    return null;
  }

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
      <h2 className="text-2xl font-bold text-zinc-900 mb-3">
        Proposals ({listing.proposals!.length})
      </h2>
      <div className="space-y-2" role="list">
        {listing.proposals!.map((proposal, idx) => (
          <article
            key={`${proposal.vendorUserId}-${idx}`}
            className="border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            role="listitem"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <h3 className="font-semibold text-lg text-zinc-900">{proposal.vendorName}</h3>
                <time
                  className="text-sm text-zinc-500 mt-0.5 block"
                  dateTime={proposal.submittedAt}
                >
                  {formatDate(proposal.submittedAt)}
                </time>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize ${getStatusBadgeClass(
                  proposal.status
                )}`}
                aria-label={`Proposal status: ${proposal.status}`}
              >
                {proposal.status}
              </span>
            </div>
            <p className="text-zinc-700 mb-2 leading-snug">{proposal.proposalText}</p>
            {(proposal.proposedPrice || proposal.proposedTimeline) && (
              <div className="flex gap-4 text-sm text-zinc-600 mb-2">
                {proposal.proposedPrice && (
                  <span className="font-medium">Price: {proposal.proposedPrice}</span>
                )}
                {proposal.proposedTimeline && (
                  <span className="font-medium">Timeline: {proposal.proposedTimeline}</span>
                )}
              </div>
            )}
            <div>
              <button
                onClick={() => {
                  onClose();
                  router.push(`/vendor/${proposal.vendorUserId}`);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={`View profile of ${proposal.vendorName}`}
              >
                View Vendor Profile →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

