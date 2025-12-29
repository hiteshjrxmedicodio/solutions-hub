"use client";

import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import type { Listing, ListingDetailModalProps } from "./ListingDetailModal/types";
import { useListingData } from "./ListingDetailModal/hooks/useListingData";
import { useModalKeyboard } from "./ListingDetailModal/hooks/useModalKeyboard";
import { ModalContainer } from "./ListingDetailModal/ModalContainer";
import { LoadingState } from "./ListingDetailModal/LoadingState";
import { ErrorState } from "./ListingDetailModal/ErrorState";
import { ListingHeader } from "./ListingDetailModal/ListingHeader";
import { RequirementsSection } from "./ListingDetailModal/RequirementsSection";
import { InstitutionContext } from "./ListingDetailModal/InstitutionContext";
import { AdditionalNotes } from "./ListingDetailModal/AdditionalNotes";
import { ProposalsList } from "./ListingDetailModal/ProposalsList";
import { SubmitProposalButton } from "./ListingDetailModal/SubmitProposalButton";
import { ProposalForm } from "./ListingDetailModal/ProposalForm";
import { ContactSection } from "./ListingDetailModal/ContactSection";
import { BusinessDetails } from "./ListingDetailModal/BusinessDetails";

/**
 * ListingDetailModal Component
 * 
 * A comprehensive modal component for displaying detailed listing information.
 * Features:
 * - Responsive two-column layout (Requirements 52%, Contact 28%)
 * - Owner-specific actions (edit, view proposals)
 * - Vendor proposal submission
 * - Keyboard navigation (ESC to close)
 * - Accessibility features
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal should close
 * @param listingId - ID of the listing to display
 */
export function ListingDetailModal({ isOpen, onClose, listingId }: ListingDetailModalProps) {
  const { user, isLoaded } = useUser();
  const [showProposalForm, setShowProposalForm] = useState(false);
  
  // Custom hooks for data fetching and keyboard handling
  const { listing, loading, error, refetch } = useListingData({ listingId, isOpen });
  useModalKeyboard(isOpen, onClose);

  // Memoize owner check to avoid unnecessary recalculations
  const isOwner = useMemo(() => {
    return user?.id === listing?.userId;
  }, [user?.id, listing?.userId]);

  /**
   * Handles proposal submission with proper error handling and optimistic updates
   */
  const handleSubmitProposal = async (data: {
    proposalText: string;
  }) => {
    if (!listingId) {
      return;
    }

    try {
      const response = await fetch(`/api/listings/${listingId}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit proposal");
      }

      const result = await response.json();
      
      if (result.success) {
        setShowProposalForm(false);
        // Refresh listing to show new proposal
        await refetch();
      } else {
        throw new Error(result.error || "Failed to submit proposal");
      }
    } catch (err) {
      console.error("Error submitting proposal:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to submit proposal. Please try again.";
      // In production, use a toast notification library instead of alert
      alert(errorMessage);
      throw err;
    }
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      {loading || !isLoaded ? (
        <LoadingState />
      ) : error || !listing ? (
        <ErrorState error={error} onClose={onClose} />
      ) : (
        <>
          {/* Header Card - Centered */}
          <div className="mb-3 flex justify-center">
            <div style={{ width: '90%' }}>
              <ListingHeader
                listing={listing}
                listingId={listingId!}
                isOwner={isOwner}
                onClose={onClose}
              />
            </div>
          </div>

          {/* Main Content: Two-Column Layout - Centered */}
          <div className="flex justify-center">
            <div className="flex" style={{ width: '90%' }}>
              {/* Left Column - Requirements & Context (57% - increased by 5%) */}
              <div className="flex-[0.57] space-y-3 pr-3">
                <RequirementsSection listing={listing} />
                <InstitutionContext listing={listing} />
                <div>
                  <AdditionalNotes listing={listing} />
                  <div className="pb-5"></div>
                </div>
                {isOwner && <ProposalsList listing={listing} onClose={onClose} />}
              </div>

              {/* Right Column - Contact & Business Details (side by side) & Submit Proposal (below) - Adjusted to 43% */}
              <div className="flex-[0.43] flex-shrink-0">
                <div className="flex flex-col gap-3">
                  {/* Contact and Business Details - Side by Side */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <ContactSection listing={listing} />
                    </div>
                    <div className="flex-1">
                      <BusinessDetails listing={listing} />
                    </div>
                  </div>
                  {/* Submit Proposal Section - Below Contact & Business Details (Vendors only) */}
                  {user && !isOwner && listing.status === "active" && (
                    <div>
                      {showProposalForm ? (
                        <ProposalForm
                          onSubmit={handleSubmitProposal}
                          onCancel={() => setShowProposalForm(false)}
                        />
                      ) : (
                        <div className="flex justify-center">
                          <SubmitProposalButton onClick={() => setShowProposalForm(true)} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ModalContainer>
  );
}

