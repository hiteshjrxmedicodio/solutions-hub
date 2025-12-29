"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserData } from "@/contexts/UserContext";
import { Sidebar } from "@/components/Sidebar";
import { CreateListingModal } from "@/app/listings/components/CreateListingModal";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { DashboardHeader } from "./components/DashboardHeader";
import { QuickStats } from "./components/QuickStats";
import { VendorDashboard } from "./components/VendorDashboard";
import { QuickActions } from "./components/QuickActions";
import { RecentActivity } from "./components/RecentActivity";
import { NotificationCenter } from "./components/NotificationCenter";
import { generateQuickStats } from "./components/QuickStatsGenerator";

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData } = useUserData();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"customer" | "vendor">("customer");
  const [vendorStats, setVendorStats] = useState<any>(null);
  const [loadingVendorStats, setLoadingVendorStats] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const userRole = userData?.role;
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Fetch vendor stats when in vendor mode
  useEffect(() => {
    if (isSuperAdmin && viewMode === "vendor" && user?.id) {
      setLoadingVendorStats(true);
      const url = selectedCategory !== "all" 
        ? `/api/dashboard/vendor-stats?category=${encodeURIComponent(selectedCategory)}`
        : "/api/dashboard/vendor-stats";
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setVendorStats(data.data);
          }
        })
        .catch((err) => console.error("Error fetching vendor stats:", err))
        .finally(() => setLoadingVendorStats(false));
    }
  }, [isSuperAdmin, viewMode, user?.id, selectedCategory]);

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

  if (!user) {
    return null;
  }

  const quickStats = generateQuickStats(
    isSuperAdmin,
    viewMode,
    userRole || undefined,
    loadingVendorStats,
    vendorStats
  );

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 overflow-y-auto h-screen ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-8">
          <DashboardHeader
            userName={user.firstName || userEmail.split("@")[0]}
            isSuperAdmin={isSuperAdmin}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <QuickStats stats={quickStats} />

          {/* Vendor Mode Stats for Super Admin */}
          {isSuperAdmin && viewMode === "vendor" && vendorStats && (
            <VendorDashboard
              vendorStats={vendorStats}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}

          {/* Quick Actions, Recent Activity, and Notifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
            {/* Left Column: Quick Actions and Recent Activity stacked */}
            <div className="flex flex-col gap-6">
              <div className="h-[320px]">
                <QuickActions
                  userRole={userRole || undefined}
                  isSuperAdmin={isSuperAdmin}
                  viewMode={viewMode}
                  userEmail={userEmail}
                  userId={user?.id}
                  onCreateListingClick={() => setIsCreateModalOpen(true)}
                />
              </div>
              <div className="h-[320px]">
                <RecentActivity />
              </div>
            </div>
            
            {/* Right Column: Notification Center (full height = Quick Actions + Recent Activity + gap) */}
            <div className="h-[664px]">
              <NotificationCenter userId={user?.id} />
            </div>
          </div>
        </div>
      </main>
      <CreateListingModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <OnboardingGuard>
      <DashboardContent />
    </OnboardingGuard>
  );
}

