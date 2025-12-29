"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUserData } from "@/contexts/UserContext";
import { RoleSelection } from "./RoleSelection";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData } = useUserData();
  const router = useRouter();
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);

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
        // Refetch to get latest data
        await refetchUserData();
        // Redirect based on role after role selection
        const userEmail = user?.emailAddresses[0]?.emailAddress || "";
        // Special case: Link hitesh.ms24@gmail.com to seed-medicodio vendor page
        if (userEmail === "hitesh.ms24@gmail.com") {
          router.push("/vendor/seed-medicodio");
        } else if (role === "seller" && user?.id) {
          router.push(`/vendor/${user.id}`);
        } else if (role === "buyer") {
          router.push("/solutions-hub");
        }
      } else {
        alert("Error saving role: " + result.error);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Error saving role. Please try again.");
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

  // If user has a role, show children (normal page)
  if (userRole) {
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
    </>
  );
}

