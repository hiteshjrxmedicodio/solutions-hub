"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUserData } from "@/contexts/UserContext";
import { RoleSelection } from "./RoleSelection";
import { InstitutionQuestionnaire } from "./InstitutionQuestionnaire";
import { VendorQuestionnaire } from "./vendor-questionnaire/VendorQuestionnaire";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData } = useUserData();
  const router = useRouter();
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);

  const userRole = userData?.role;
  const isLoading = !isLoaded || isLoadingUserData;

  // Check if role selection is needed
  useEffect(() => {
    if (!isLoading && user && userData && !userRole) {
      setIsRoleSelectionOpen(true);
    }
  }, [isLoading, user, userData, userRole]);

  const { updateRole, refetch: refetchUserData } = useUserData();

  const handleRoleSelect = async (role: "buyer" | "seller") => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();
      if (result.success) {
        updateRole(role);
        setIsRoleSelectionOpen(false);
        // Automatically open questionnaire after role selection
        setIsQuestionnaireOpen(true);
        // Refetch to get latest data
        await refetchUserData();
      } else {
        alert("Error saving role: " + result.error);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Error saving role. Please try again.");
    }
  };

  const handleQuestionnaireSave = async (data: any) => {
    if (!userRole || !user?.id) return;

    try {
      const endpoint = userRole === "buyer" ? "/api/institution" : "/api/vendor";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setIsQuestionnaireOpen(false);
        // Refetch user data to update cache
        await refetchUserData();
        // Redirect to profile page after questionnaire completion
        router.push("/profile");
      } else {
        alert("Error saving profile: " + result.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
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

  // If user has a role and questionnaire is not open, show children (normal page)
  if (userRole && !isQuestionnaireOpen) {
    return <>{children}</>;
  }

  // Show onboarding flow (role selection and questionnaire)
  return (
    <>
      {children}
      
      {/* Role Selection Modal */}
      <RoleSelection
        isOpen={isRoleSelectionOpen}
        onClose={() => setIsRoleSelectionOpen(false)}
        onSelect={handleRoleSelect}
      />

      {/* Institution Questionnaire - Only for buyers */}
      {userRole === "buyer" && (
        <InstitutionQuestionnaire
          isOpen={isQuestionnaireOpen}
          onClose={() => setIsQuestionnaireOpen(false)}
          onSave={handleQuestionnaireSave}
          initialData={{}}
        />
      )}

      {/* Vendor Questionnaire - Only for sellers */}
      {userRole === "seller" && (
        <VendorQuestionnaire
          isOpen={isQuestionnaireOpen}
          onClose={() => setIsQuestionnaireOpen(false)}
          onSave={handleQuestionnaireSave}
          initialData={{}}
        />
      )}
    </>
  );
}

