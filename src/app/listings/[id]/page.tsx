"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
import { Sidebar } from "@/components/Sidebar";
import {
  ListingHeader,
  RequirementsSection,
  InstitutionContext,
  AdditionalNotes,
  ContactSection,
  BusinessDetails,
  ProposalForm,
  SubmitProposalButton,
  ViewProposalsButton,
  LoadingState,
  ErrorState,
  type Listing,
} from "./components";

export default function ListingDetailPage() {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData, actingAs } = useUserData();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const listingId = params.id as string;
  
  // Use actingAs role if set, otherwise use actual role
  const effectiveRole = actingAs || userData?.role;
  
  // Check if user is super admin - check email first (most reliable), then userData, then publicMetadata
  const isSuperAdmin = useMemo(() => {
  const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (userEmail === "hitesh.ms24@gmail.com") return true;
    if (userData?.role === "superadmin") return true;
    if (user?.publicMetadata?.role === "superadmin") return true;
    return false;
  }, [user?.emailAddresses, userData?.role, user?.publicMetadata?.role]);
  
  // Edit/Delete is ONLY for customers who created the listing (not vendors, not superadmins)
  const isOwner = useMemo(() => {
    if (!user?.id || !listing?.userId) return false;
    // Only allow edit if user is the actual owner AND is a customer (not vendor, not superadmin acting as vendor)
    return user.id === listing.userId && effectiveRole === "customer";
  }, [user?.id, listing?.userId, effectiveRole]);
  
  // Check if user is a vendor (vendors can submit proposals)
  // Only valid for superadmin or vendor role
  const isVendor = useMemo(() => {
    // If explicitly acting as vendor, return true
    if (actingAs === "vendor") return true;
    // Superadmin can submit proposals unless explicitly acting as customer
    if (isSuperAdmin && actingAs !== "customer") return true;
    // Check if user is a vendor - check effectiveRole first, then userData, then publicMetadata
    if (effectiveRole === "vendor") return true;
    if (userData?.role === "vendor") return true;
    if (user?.publicMetadata?.role === "vendor") return true;
    return false;
  }, [effectiveRole, userData?.role, user?.publicMetadata?.role, isSuperAdmin, actingAs]);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setListing(data.data);
        } else {
          throw new Error("Listing not found");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    }

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  // Log all proposal button conditions when listing is loaded
  useEffect(() => {
    if (loading || !listing || !isLoaded) return;
    
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const listingStatus = (listing?.status || '').toLowerCase();
    const isUserLoggedIn = !!user && isLoaded;
    const superAdminCanSubmit = isSuperAdmin && actingAs !== "customer";
    const canSubmit = isVendor || superAdminCanSubmit;
    const isNotOwner = user?.id !== listing?.userId;
    const isValidStatus = listingStatus !== 'cancelled' && listingStatus !== 'completed';
    const canSubmitProposal = isUserLoggedIn && canSubmit && isNotOwner && isValidStatus;
    
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📋 LISTING DETAIL PAGE - PROPOSAL BUTTON DEBUG");
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
    console.log("   - canSubmitProposal:", canSubmitProposal, canSubmitProposal ? "✅ BUTTON WILL SHOW" : "❌ BUTTON WILL NOT SHOW");
    console.log("");
    if (!canSubmitProposal) {
      console.log("❌ REASON BUTTON IS HIDDEN:");
      if (!isUserLoggedIn) console.log("   → User is not logged in");
      if (!canSubmit) console.log("   → User cannot submit (not vendor and not superadmin)");
      if (!isNotOwner) console.log("   → User is the owner of this listing");
      if (!isValidStatus) console.log("   → Listing status is cancelled or completed");
    }
    console.log("═══════════════════════════════════════════════════════════");
  }, [loading, listing, isLoaded, user, isSuperAdmin, isVendor, actingAs, effectiveRole, userData, listingId]);

  const handleProposalSubmitSuccess = async () => {
        setShowProposalForm(false);
        // Refresh listing to show new proposal
        const refreshResponse = await fetch(`/api/listings/${listingId}`);
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setListing(refreshData.data);
          }
    }
  };

  if (loading || !isLoaded) {
    return (
      <LoadingState
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSidebarClose={() => setIsSidebarOpen(false)}
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
    );
  }

  if (error || !listing) {
    return (
      <ErrorState
        error={error}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSidebarClose={() => setIsSidebarOpen(false)}
        isSidebarCollapsed={isSidebarCollapsed}
        onSidebarCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
    );
  }

  // Vendors OR superadmin can submit proposals to any listing they didn't create
  // Allow proposals for all statuses except cancelled/completed
  const listingStatus = (listing?.status || '').toLowerCase();
  const isUserLoggedIn = !!user && isLoaded;
  // Superadmin can submit unless explicitly acting as customer
  const superAdminCanSubmit = isSuperAdmin && actingAs !== "customer";
  const canSubmit = isVendor || superAdminCanSubmit;
  const isNotOwner = user?.id !== listing?.userId;
  const isValidStatus = listingStatus !== 'cancelled' && listingStatus !== 'completed';
  const canSubmitProposal = isUserLoggedIn && canSubmit && isNotOwner && isValidStatus;
  
  // Always log for debugging (remove in production)
  console.log("Proposal button debug (page):", {
    isUserLoggedIn,
    isLoaded,
    isVendor,
    isSuperAdmin,
    superAdminCanSubmit,
    canSubmit,
    isNotOwner,
    listingStatus: listing?.status,
    listingStatusLower: listingStatus,
    isValidStatus,
    userId: user?.id,
    listingUserId: listing?.userId,
    effectiveRole,
    userDataRole: userData?.role,
    actingAs,
    userEmail: user?.emailAddresses[0]?.emailAddress,
    canSubmitProposal,
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
  const showViewProposalsButton = effectiveRole === "customer" && user?.id === listing?.userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <ListingHeader
              listing={listing}
              listingId={listingId}
              isOwner={isOwner}
            />

          {/* Single Column Layout */}
          <div className="space-y-6">
              <RequirementsSection listing={listing} />

              <InstitutionContext listing={listing} />

              <AdditionalNotes listing={listing} />

              <ContactSection listing={listing} />

              <BusinessDetails listing={listing} />

              {/* Submit Proposal (Vendors only) */}
              {canSubmitProposal && (
                <>
                  {!showProposalForm ? (
                    <SubmitProposalButton onClick={() => setShowProposalForm(true)} />
                  ) : (
                    <ProposalForm
                      listingId={listingId}
                      onSubmitSuccess={handleProposalSubmitSuccess}
                      onCancel={() => setShowProposalForm(false)}
                    />
                  )}
                </>
              )}

            {/* View all proposals button for customers who created the listing */}
              {showViewProposalsButton && <ViewProposalsButton />}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
