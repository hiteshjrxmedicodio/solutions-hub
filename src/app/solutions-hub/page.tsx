"use client";

import { SolutionsGrid } from "./components/SolutionsGrid";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function SolutionsHubContent() {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData } = useUserData();

  // Show loading while checking user data
  if (!isLoaded || isLoadingUserData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <SolutionsGrid />;
}

export default function SolutionsHubPage() {
  return (
    <OnboardingGuard>
      <SolutionsHubContent />
    </OnboardingGuard>
  );
}
