"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUserData } from "@/contexts/UserContext";
import { OnboardingFlow } from "./OnboardingFlow";
import { VendorQuestionnaireData } from "./vendor-questionnaire/types";
import { BuyerQuestionnaireData } from "./buyer-questionnaire/types";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData, actingAs } = useUserData();
  const router = useRouter();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hasVendorProfile, setHasVendorProfile] = useState<boolean | null>(null);
  const [hasBuyerProfile, setHasBuyerProfile] = useState<boolean | null>(null);

  const userRole = userData?.role;
  // Use actual role for onboarding checks, not actingAs (onboarding is based on actual role)
  const isLoading = !isLoaded || isLoadingUserData;

  // Check if role selection is needed
  useEffect(() => {
    if (!isLoading && user && userData && !userRole) {
      setIsOnboardingOpen(true);
    }
  }, [isLoading, user, userData, userRole]);

  // Check if vendor profile exists when user is a vendor
  useEffect(() => {
    // If user is a customer, don't check for vendor profile at all
    if (userRole === "customer") {
      setHasVendorProfile(true); // Mark as not needed
      return;
    }

    const checkVendorProfile = async () => {
      if (userRole === "vendor" && user?.id) {
        try {
          const response = await fetch("/api/vendor");
          if (response.ok) {
            const result = await response.json();
            setHasVendorProfile(result.success && result.data);
            if (!result.success || !result.data) {
              setIsOnboardingOpen(true);
            }
          } else {
            setHasVendorProfile(false);
            setIsOnboardingOpen(true);
          }
        } catch (error) {
          console.error("Error checking vendor profile:", error);
          setHasVendorProfile(false);
          setIsOnboardingOpen(true);
        }
      }
    };

    if (userRole === "vendor" && user?.id && hasVendorProfile === null) {
      checkVendorProfile();
    }
  }, [userRole, user?.id, hasVendorProfile]);

  // Check if customer profile exists when user is a customer (and not a vendor)
  useEffect(() => {
    // If user is a vendor, don't check for customer profile at all
    if (userRole === "vendor") {
      setHasBuyerProfile(true); // Mark as not needed
      return;
    }

    // Only check customer profile if user is actually a customer
    const checkCustomerProfile = async () => {
      if (userRole === "customer" && user?.id) {
        try {
          const response = await fetch("/api/buyer");
          if (response.ok) {
            const result = await response.json();
            setHasBuyerProfile(result.success && result.data);
            if (!result.success || !result.data) {
              setIsOnboardingOpen(true);
            }
          } else {
            setHasBuyerProfile(false);
            setIsOnboardingOpen(true);
          }
        } catch (error) {
          console.error("Error checking customer profile:", error);
          setHasBuyerProfile(false);
          setIsOnboardingOpen(true);
        }
      }
    };

    // Only check if user is customer
    if (userRole === "customer" && user?.id && hasBuyerProfile === null) {
      checkCustomerProfile();
    }
  }, [userRole, user?.id, hasBuyerProfile]);

  const { updateRole, refetch: refetchUserData } = useUserData();

  const handleRoleSelect = async (role: "customer" | "vendor") => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();
      if (result.success) {
        updateRole(role);
        // Refetch to get latest data
        await refetchUserData();
        // If vendor, check for vendor profile (questionnaire will open if needed)
        if (role === "vendor") {
          setHasVendorProfile(null); // Reset to trigger check
        } else if (role === "customer") {
          setHasBuyerProfile(null); // Reset to trigger check
        }
      } else {
        alert("Error saving role: " + result.error);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Error saving role. Please try again.");
    }
  };

  const handleVendorQuestionnaireSubmit = async (data: VendorQuestionnaireData) => {
    try {
      const response = await fetch("/api/vendor/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setHasVendorProfile(true);
        setIsOnboardingOpen(false);
        // Redirect to vendor page
        const userEmail = user?.emailAddresses[0]?.emailAddress || "";
        if (userEmail === "hitesh.ms24@gmail.com") {
          router.push("/vendor/seed-medicodio");
        } else if (user?.id) {
          router.push(`/vendor/${user.id}`);
        }
      } else {
        throw new Error(result.error || "Failed to save vendor questionnaire");
      }
    } catch (error) {
      console.error("Error submitting vendor questionnaire:", error);
      throw error;
    }
  };

  const handleBuyerQuestionnaireSubmit = async (data: BuyerQuestionnaireData) => {
    try {
      const response = await fetch("/api/buyer/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setHasBuyerProfile(true);
        setIsOnboardingOpen(false);
        // Redirect to solutions hub
        router.push("/solutions-hub");
      } else {
        throw new Error(result.error || "Failed to save buyer questionnaire");
      }
    } catch (error) {
      console.error("Error submitting buyer questionnaire:", error);
      throw error;
    }
  };


  // Show loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not signed in, show children (normal page)
  if (!user) {
    return <>{children}</>;
  }

  // If user has a role and:
  // - If vendor: must have vendor profile (don't check customer profile)
  // - If customer: must have customer profile (don't check vendor profile)
  // - If superadmin: can proceed without profiles (they can access both)
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userRole === "superadmin";
  
  if (userRole) {
    if (isSuperAdmin) {
      // Superadmin can always proceed
      return <>{children}</>;
    } else if (userRole === "vendor") {
      // Vendor only needs vendor profile
      if (hasVendorProfile === true) {
        return <>{children}</>;
      }
    } else if (userRole === "customer") {
      // Customer only needs customer profile
      if (hasBuyerProfile === true) {
        return <>{children}</>;
      }
    }
  }

  // Show onboarding flow (role selection and questionnaire)
  return (
    <>
      {children}
      
      {/* Unified Onboarding Flow */}
      <OnboardingFlow
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onRoleSelect={handleRoleSelect}
        onVendorQuestionnaireSubmit={handleVendorQuestionnaireSubmit}
        onCustomerQuestionnaireSubmit={handleBuyerQuestionnaireSubmit}
      />
    </>
  );
}

