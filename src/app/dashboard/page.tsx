"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
import { ProfileIncompleteBanner } from "./components/ProfileIncompleteBanner";

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData, actingAs } = useUserData();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"customer" | "vendor">("customer");
  const [vendorStats, setVendorStats] = useState<any>(null);
  const [loadingVendorStats, setLoadingVendorStats] = useState(false);
  const [customerStats, setCustomerStats] = useState<any>(null);
  const [loadingCustomerStats, setLoadingCustomerStats] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [vendorData, setVendorData] = useState<any>(null);

  const userRole = userData?.role;
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userRole === "superadmin";
  // Use actingAs role if set, otherwise use actual role
  // Memoize effectiveRole to prevent dependency array issues
  const effectiveRole = useMemo(() => actingAs || userRole, [actingAs, userRole]);

  // Sync viewMode with actingAs when it changes
  useEffect(() => {
    if (actingAs) {
      setViewMode(actingAs);
    } else if (isSuperAdmin && !actingAs) {
      // Reset to customer view when not acting as any role
      setViewMode("customer");
    }
  }, [actingAs, isSuperAdmin]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Create dummy customer profile for super admin if it doesn't exist
  useEffect(() => {
    if (isSuperAdmin && user?.id && isLoaded && !isLoadingUserData) {
      // Check if customer profile exists, if not create dummy one
      fetch("/api/dashboard/customer-stats")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data.profileCompletionPercentage === 0) {
            // Profile doesn't exist or is incomplete, create dummy profile
            fetch("/api/customer/create-dummy", { method: "POST" })
              .then((res) => res.json())
              .then((result) => {
                if (result.success) {
                  console.log("Dummy customer profile created for super admin");
                  // Refresh customer stats
                  fetch("/api/dashboard/customer-stats")
                    .then((res) => res.json())
                    .then((stats) => {
                      if (stats.success) {
                        setCustomerStats(stats.data);
                      }
                    });
                }
              })
              .catch((err) => console.error("Error creating dummy customer profile:", err));
          }
        })
        .catch((err) => console.error("Error checking customer profile:", err));
    }
  }, [isSuperAdmin, user?.id, isLoaded, isLoadingUserData]);

  // Fetch vendor stats when in vendor mode or when user is a vendor
  useEffect(() => {
    const shouldFetchVendorStats = (isSuperAdmin && viewMode === "vendor" && user?.id) || (effectiveRole === "vendor" && user?.id);
    if (shouldFetchVendorStats) {
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
  }, [isSuperAdmin, viewMode, effectiveRole, user?.id, selectedCategory]);

  // Fetch customer stats when in customer mode
  useEffect(() => {
    if ((effectiveRole === "customer" || (isSuperAdmin && viewMode === "customer")) && user?.id) {
      setLoadingCustomerStats(true);
      fetch("/api/dashboard/customer-stats")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCustomerStats(data.data);
          }
        })
        .catch((err) => console.error("Error fetching customer stats:", err))
        .finally(() => setLoadingCustomerStats(false));
    }
  }, [isSuperAdmin, viewMode, effectiveRole, user?.id]);

  // Create dummy customer profile for super admin if it doesn't exist
  useEffect(() => {
    if (isSuperAdmin && user?.id && isLoaded && !isLoadingUserData) {
      // Check if customer profile exists, if not create dummy one
      fetch("/api/dashboard/customer-stats")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data.profileCompletionPercentage === 0) {
            // Profile doesn't exist or is incomplete, create dummy profile
            fetch("/api/customer/create-dummy", { method: "POST" })
              .then((res) => res.json())
              .then((result) => {
                if (result.success) {
                  console.log("Dummy customer profile created for super admin");
                  // Refresh customer stats
                  fetch("/api/dashboard/customer-stats")
                    .then((res) => res.json())
                    .then((stats) => {
                      if (stats.success) {
                        setCustomerStats(stats.data);
                      }
                    });
                }
              })
              .catch((err) => console.error("Error creating dummy customer profile:", err));
          }
        })
        .catch((err) => console.error("Error checking customer profile:", err));
    }
  }, [isSuperAdmin, user?.id, isLoaded, isLoadingUserData]);

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
    vendorStats,
    loadingCustomerStats,
    customerStats
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

          {/* Profile Incomplete Banner */}
          {effectiveRole === "vendor" && vendorStats && (
            <ProfileIncompleteBanner
              profileCompletionPercentage={vendorStats.profileCompletionPercentage || 0}
              profileType="vendor"
              userId={user?.id}
              userEmail={userEmail}
              isSuperAdmin={isSuperAdmin}
              actingAs={actingAs}
            />
          )}
          {(effectiveRole === "customer" || (isSuperAdmin && viewMode === "customer")) && customerStats && (
            <ProfileIncompleteBanner
              profileCompletionPercentage={customerStats.profileCompletionPercentage || 0}
              profileType="customer"
              userId={user?.id}
              userEmail={userEmail}
              isSuperAdmin={isSuperAdmin}
              actingAs={actingAs}
            />
          )}

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
                  userRole={effectiveRole || undefined}
                  isSuperAdmin={isSuperAdmin}
                  viewMode={viewMode}
                  userEmail={userEmail}
                  userId={user?.id}
                  onCreateListingClick={() => setIsCreateModalOpen(true)}
                  actingAs={actingAs}
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

