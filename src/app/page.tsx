"use client";

import { OnboardingGuard } from "@/components/OnboardingGuard";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserData } from "@/contexts/UserContext";

function HomeContent() {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user && !isLoadingUserData && userData) {
      const userEmail = user.emailAddresses[0]?.emailAddress || "";
      // Special case: Link hitesh.ms24@gmail.com to seed-medicodio vendor page
      if (userEmail === "hitesh.ms24@gmail.com") {
        router.push("/vendor/seed-medicodio");
      } else if (userData.role === "seller" && user.id) {
        router.push(`/vendor/${user.id}`);
      } else if (userData.role === "buyer") {
        router.push("/solutions-hub");
      }
    }
  }, [isLoaded, user, userData, isLoadingUserData, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to profile
  }

  // Show landing page for non-authenticated users
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-zinc-900 mb-6">
          Astro Vault
        </h1>
        <p className="text-xl text-zinc-600 mb-8 max-w-2xl">
          Connect healthcare institutions with cutting-edge AI solutions
        </p>
        <div className="flex gap-4">
          <a
            href="/sign-in"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            Sign In
          </a>
          <a
            href="/sign-up"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
          >
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <OnboardingGuard>
      <HomeContent />
    </OnboardingGuard>
  );
}
