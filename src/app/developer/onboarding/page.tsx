"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { VendorQuestionnaireData } from "@/components/vendor-questionnaire/types";
import { BuyerQuestionnaireData } from "@/components/buyer-questionnaire/types";

export default function OnboardingPhasePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const userRole = user?.publicMetadata?.role as string | undefined;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userRole === "superadmin";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user && !isSuperAdmin) {
      router.push("/solutions-hub");
    }
  }, [isLoaded, user, isSuperAdmin, router]);

  const handleRoleSelect = async (role: "customer" | "vendor") => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();
      if (result.success) {
        // OnboardingFlow will handle the transition
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
        setIsOnboardingOpen(false);
        alert("Vendor questionnaire completed successfully!");
      } else {
        throw new Error(result.error || "Failed to save vendor questionnaire");
      }
    } catch (error) {
      console.error("Error submitting vendor questionnaire:", error);
      alert("Error submitting vendor questionnaire. Please try again.");
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
        setIsOnboardingOpen(false);
        alert("Customer questionnaire completed successfully!");
      } else {
        throw new Error(result.error || "Failed to save buyer questionnaire");
      }
    } catch (error) {
      console.error("Error submitting buyer questionnaire:", error);
      alert("Error submitting buyer questionnaire. Please try again.");
    }
  };

  const handleStartOnboarding = () => {
    setIsOnboardingOpen(true);
  };

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

  if (!user || !isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white overflow-y-auto" style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex pt-24">
        <main className={`flex-1 mr-[280px] p-8 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">
              Onboarding Phase
            </h1>
            <p className="text-zinc-600">
              Start the onboarding process to complete required questionnaires
            </p>
          </div>

          {/* Start Onboarding Button */}
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                  Start Onboarding
                </h2>
                <p className="text-zinc-600 max-w-md mx-auto">
                  Click the button below to begin the onboarding process. You'll be asked to select your role (vendor or customer) and then complete the appropriate questionnaire.
                </p>
              </div>
              <button
                onClick={handleStartOnboarding}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Onboarding Phase
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Unified Onboarding Flow */}
      <OnboardingFlow
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onRoleSelect={handleRoleSelect}
        onVendorQuestionnaireSubmit={handleVendorQuestionnaireSubmit}
        onCustomerQuestionnaireSubmit={handleBuyerQuestionnaireSubmit}
      />
    </div>
  );
}
