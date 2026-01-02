"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
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
  const { userData, isLoading: isLoadingUserData, actingAs } = useUserData();
  const router = useRouter();
  const [showProposalForm, setShowProposalForm] = useState(false);
  const proposalSectionRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks for data fetching and keyboard handling
  const { listing, loading, error, refetch } = useListingData({ listingId, isOpen });
  useModalKeyboard(isOpen, onClose);

  // Check if user is super admin - check email first (most reliable), then userData, then publicMetadata
  const isSuperAdmin = useMemo(() => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (userEmail === "hitesh.ms24@gmail.com") return true;
    if (userData?.role === "superadmin") return true;
    if (user?.publicMetadata?.role === "superadmin") return true;
    return false;
  }, [user?.emailAddresses, userData?.role, user?.publicMetadata?.role]);

  // Use actingAs role if set, otherwise use actual role
  const effectiveRole = actingAs || userData?.role;

  // Memoize owner check to avoid unnecessary recalculations
  // Edit is only for: super admin OR customer who created the listing
  const isOwner = useMemo(() => {
    if (isSuperAdmin) return true;
    if (!user?.id || !listing?.userId) return false;
    // Only allow edit if user is the actual owner AND is a customer
    return user.id === listing.userId && effectiveRole === "customer";
  }, [isSuperAdmin, user?.id, listing?.userId, effectiveRole]);

  // Check if user is a vendor (vendors can submit proposals)
  // Check both userData role and publicMetadata as fallback
  // Superadmin can also submit proposals (unless explicitly acting as customer)
  const isVendor = useMemo(() => {
    // Superadmin can submit proposals unless explicitly acting as customer
    if (isSuperAdmin && actingAs !== "customer") return true;
    // First check actingAs role if set
    if (effectiveRole === "vendor") return true;
    // Then check userData (preferred)
    if (userData?.role === "vendor") return true;
    // Fallback to publicMetadata if userData is still loading or not available
    if (user?.publicMetadata?.role === "vendor") return true;
    return false;
  }, [effectiveRole, userData?.role, user?.publicMetadata?.role, isSuperAdmin, actingAs]);

  // Log all proposal button conditions when listing is loaded
  useEffect(() => {
    if (!isOpen || loading || !listing || !isLoaded) return;
    
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const listingStatus = (listing?.status || '').toLowerCase();
    const isUserLoggedIn = !!user && isLoaded;
    const superAdminCanSubmit = isSuperAdmin && actingAs !== "customer";
    const canSubmit = isVendor || superAdminCanSubmit;
    const isNotOwner = user?.id !== listing?.userId;
    const isValidStatus = listingStatus !== "cancelled" && listingStatus !== "completed";
    const shouldShow = isUserLoggedIn && canSubmit && isNotOwner && isValidStatus;
    
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📋 LISTING DETAIL MODAL - PROPOSAL BUTTON DEBUG");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📌 Listing Info:");
    console.log("   - Listing ID:", listingId);
    console.log("   - Listing Title:", listing?.title);
    console.log("   - Listing Status:", listing?.status, `(${listingStatus})`);
    console.log("   - Listing User ID:", listing?.userId);
    console.log("");
    console.log("👤 User Info:");
    console.log("   - User ID:", user?.id);
    console.log("   - User Email:", userEmail);
    console.log("   - Is Loaded:", isLoaded);
    console.log("   - Is Logged In:", isUserLoggedIn);
    console.log("");
    console.log("🔐 Role Checks:");
    console.log("   - userData?.role:", userData?.role);
    console.log("   - user?.publicMetadata?.role:", user?.publicMetadata?.role);
    console.log("   - actingAs:", actingAs);
    console.log("   - effectiveRole:", effectiveRole);
    console.log("   - isSuperAdmin:", isSuperAdmin);
    console.log("   - isVendor:", isVendor);
    console.log("");
    console.log("✅ Proposal Button Conditions:");
    console.log("   - isUserLoggedIn:", isUserLoggedIn, isUserLoggedIn ? "✅" : "❌");
    console.log("   - isVendor:", isVendor, isVendor ? "✅" : "❌");
    console.log("   - isSuperAdmin:", isSuperAdmin, isSuperAdmin ? "✅" : "❌");
    console.log("   - actingAs !== 'customer':", actingAs !== "customer", actingAs !== "customer" ? "✅" : "❌");
    console.log("   - superAdminCanSubmit:", superAdminCanSubmit, superAdminCanSubmit ? "✅" : "❌");
    console.log("   - canSubmit (vendor OR superadmin):", canSubmit, canSubmit ? "✅" : "❌");
    console.log("   - isNotOwner:", isNotOwner, isNotOwner ? "✅" : "❌");
    console.log("   - isValidStatus:", isValidStatus, isValidStatus ? "✅" : "❌");
    console.log("");
    console.log("🎯 Final Result:");
    console.log("   - shouldShow:", shouldShow, shouldShow ? "✅ BUTTON WILL SHOW" : "❌ BUTTON WILL NOT SHOW");
    console.log("");
    if (!shouldShow) {
      console.log("❌ REASON BUTTON IS HIDDEN:");
      if (!isUserLoggedIn) console.log("   → User is not logged in");
      if (!canSubmit) console.log("   → User cannot submit (not vendor and not superadmin)");
      if (!isNotOwner) console.log("   → User is the owner of this listing");
      if (!isValidStatus) console.log("   → Listing status is cancelled or completed");
    }
    console.log("═══════════════════════════════════════════════════════════");
  }, [isOpen, loading, listing, isLoaded, user, isSuperAdmin, isVendor, actingAs, effectiveRole, userData, listingId]);

  // Scroll to proposal section when form opens
  useEffect(() => {
    if (showProposalForm && proposalSectionRef.current) {
      // Small delay to ensure the form is fully rendered
      setTimeout(() => {
        // Find the scrollable container by traversing up from the proposal section
        let parent = proposalSectionRef.current?.parentElement;
        let scrollableContainer: HTMLElement | null = null;
        
        // Traverse up to find the overflow-y-auto container
        while (parent) {
          const computedStyle = window.getComputedStyle(parent);
          if (computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll') {
            scrollableContainer = parent;
            break;
          }
          parent = parent.parentElement;
        }
        
        if (scrollableContainer && proposalSectionRef.current) {
          // Calculate the position relative to the scrollable container
          const containerRect = scrollableContainer.getBoundingClientRect();
          const elementRect = proposalSectionRef.current.getBoundingClientRect();
          const scrollTop = scrollableContainer.scrollTop;
          const elementTop = elementRect.top - containerRect.top + scrollTop;
          
          // Scroll to the proposal section with some offset from top
          scrollableContainer.scrollTo({
            top: elementTop - 30, // 30px offset from top for better visibility
            behavior: 'smooth'
          });
        } else if (proposalSectionRef.current) {
          // Fallback: scroll the element into view
          proposalSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 150); // Delay to ensure DOM is updated
    }
  }, [showProposalForm]);

  // Handle edit action - navigate to listings page and open edit modal
  const handleEdit = () => {
    if (listingId) {
      onClose(); // Close the detail modal
      // Navigate to listings page with edit query param
      router.push(`/listings?edit=${listingId}`);
    }
  };

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
    <ModalContainer 
      isOpen={isOpen} 
      onClose={onClose}
    >
      {loading || !isLoaded ? (
        <LoadingState />
      ) : error || !listing ? (
        <ErrorState error={error} onClose={onClose} />
      ) : (
        <>
          {/* Header Card */}
          <div className="mb-3">
              <ListingHeader
                listing={listing}
                listingId={listingId!}
                isOwner={isOwner}
                onClose={onClose}
              onEdit={handleEdit}
              />
          </div>

          {/* Main Content: Single Column Layout */}
              <div className="space-y-3" ref={modalContentRef}>
                <RequirementsSection listing={listing} />
                <InstitutionContext listing={listing} />
                <AdditionalNotes listing={listing} />
                
                {/* Contact and Business Details - Side by Side */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <ContactSection listing={listing} />
                  </div>
                  <div className="flex-1">
                    <BusinessDetails listing={listing} />
                  </div>
                </div>
                
                {/* Submit Proposal Section (Vendors only) */}
                {/* Show "Submit Proposal" button if: user is logged in, is a vendor OR superadmin, is not the actual owner, and listing is not cancelled/completed */}
                {(() => {
                  // Calculate if proposal button should be shown
                  // Allow vendors OR superadmin (unless acting as customer) to submit proposals
                  const isUserLoggedIn = !!user && isLoaded;
                  // Superadmin can submit unless explicitly acting as customer
                  const superAdminCanSubmit = isSuperAdmin && actingAs !== "customer";
                  const canSubmit = isVendor || superAdminCanSubmit;
                  const isNotOwner = user?.id !== listing?.userId;
                  const status = (listing?.status || '').toLowerCase();
                  const isValidStatus = status !== "cancelled" && status !== "completed";
                  const shouldShow = isUserLoggedIn && canSubmit && isNotOwner && isValidStatus;
                  
                  // Always log for debugging (remove in production)
                  console.log("Proposal button debug (modal):", {
                    isUserLoggedIn,
                    isLoaded,
                    isVendor,
                    isSuperAdmin,
                    superAdminCanSubmit,
                    canSubmit,
                    isNotOwner,
                    listingStatus: listing?.status,
                    statusLower: status,
                    isValidStatus,
                    userId: user?.id,
                    listingUserId: listing?.userId,
                    effectiveRole,
                    userDataRole: userData?.role,
                    actingAs,
                    userEmail: user?.emailAddresses[0]?.emailAddress,
                    shouldShow,
                    allConditions: {
                      "user exists": !!user,
                      "isLoaded": isLoaded,
                      "isVendor": isVendor,
                      "isSuperAdmin": isSuperAdmin,
                      "superAdminCanSubmit": superAdminCanSubmit,
                      "canSubmit (vendor or superadmin)": canSubmit,
                      "not owner": isNotOwner,
                      "valid status": isValidStatus,
                    }
                  });
                  
                  if (!shouldShow) {
                    return null;
                  }
                  
                  return (
                    <div className="pb-8" ref={proposalSectionRef}>
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
                  );
                })()}

                {/* Show "View all proposals" button for customers who created the listing */}
                {effectiveRole === "customer" && user?.id === listing?.userId && (
                  <div className="pb-8">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          onClose();
                          router.push('/proposals');
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium"
                      >
                        View all proposals
                      </button>
                    </div>
                  </div>
                )}
          </div>
        </>
      )}
    </ModalContainer>
  );
}

