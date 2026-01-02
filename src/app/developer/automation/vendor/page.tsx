"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "../components/Sidebar";
import { VendorQuestionnaireButton } from "@/components/vendor-questionnaire/VendorQuestionnaireButton";
import { VendorQuestionnaireData } from "@/components/vendor-questionnaire/types";

const VENDOR_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export default function VendorAgentPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = useMemo(
    () => userEmail === SUPER_ADMIN_EMAIL,
    [userEmail]
  );

  // Fetch unread notification count
  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications?filter=unread");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUnreadCount(data.notifications?.length || 0);
          }
        }
      } catch (error) {
        // Silently handle errors
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
  }, [user?.id]);

  // Auth and permission checks
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user && !isSuperAdmin) {
      router.push("/solutions-hub");
    }
  }, [isLoaded, user, isSuperAdmin, router]);

  const handleQuestionnaireSubmit = async (data: VendorQuestionnaireData) => {
    // This would typically save to the database
    // For now, just log and show success
    console.log("Vendor questionnaire submitted:", data);
    alert("Vendor questionnaire submitted successfully!");
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                {VENDOR_ICON}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900">Vendor Agent</h1>
                <p className="text-zinc-600 mt-1">Automate vendor onboarding with AI-powered website parsing</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Vendor Questionnaire</h2>
                <p className="text-zinc-600 text-sm">
                  Open the vendor questionnaire to start onboarding a new vendor.
                </p>
              </div>

              {/* Open Questionnaire Button */}
              <div className="flex justify-center">
                <VendorQuestionnaireButton
                  onSubmit={handleQuestionnaireSubmit}
                  buttonText="Open Vendor Questionnaire"
                  buttonClassName="px-8 py-4 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar - Fixed width 375px with 20px padding = 395px total offset */}
      <aside className="fixed right-0 top-28 bottom-0 w-[375px] flex-shrink-0 pl-5 pr-5 overflow-y-auto z-30">
        <Sidebar unreadCount={unreadCount} />
      </aside>
    </div>
  );
}
