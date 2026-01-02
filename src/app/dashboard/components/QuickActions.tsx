"use client";

import { DashboardCard } from "./DashboardCard";

interface QuickActionsProps {
  userRole?: string;
  isSuperAdmin: boolean;
  viewMode: "customer" | "vendor";
  userEmail: string;
  userId?: string;
  onCreateListingClick: () => void;
  actingAs?: "customer" | "vendor" | null;
}

export function QuickActions({
  userRole,
  isSuperAdmin,
  viewMode,
  userEmail,
  userId,
  onCreateListingClick,
  actingAs,
}: QuickActionsProps) {
  const isCustomer = userRole === "customer" || (isSuperAdmin && viewMode === "customer");
  const isVendor = userRole === "vendor" || (isSuperAdmin && viewMode === "vendor");

  if (!isCustomer && !isVendor) return null;

  return (
    <DashboardCard className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {/* Create New Listing - Available for both customers and vendors */}
        <button
          onClick={onCreateListingClick}
          className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
            <path d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-zinc-900">Create New Listing</span>
        </button>

        {/* View All Listings - Available only for vendors */}
        {isVendor && (
          <a
            href="/listings"
            className="flex items-center gap-3 p-3 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-teal-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="text-zinc-900">View All Listings</span>
          </a>
        )}

        {/* Browse Solutions - Available for both customers and vendors */}
        <a
          href="/solutions-hub"
          className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-600">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span className="text-zinc-900">Browse Solutions</span>
        </a>

        {/* View Profile - Single profile button based on acting role */}
        {(() => {
          // Determine profile URL and styling based on acting role
          let profileHref = "/profile";
          let profileBg = "bg-blue-50 hover:bg-blue-100";
          let profileIcon = (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          );
          let profileText = "View Profile";
          let activeLabel = null;

          if (isSuperAdmin && userId) {
            if (actingAs === "vendor") {
              profileHref = "/vendor/medicodio";
              profileBg = "bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200";
              profileIcon = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              );
              profileText = "View Profile";
              activeLabel = <span className="ml-auto text-xs text-blue-600 font-medium">Active</span>;
            } else if (actingAs === "customer") {
              profileHref = `/customer/${userId}`;
              profileBg = "bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200";
              profileIcon = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-teal-600">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              );
              profileText = "View Profile";
              activeLabel = <span className="ml-auto text-xs text-teal-600 font-medium">Active</span>;
            } else {
              // Super admin without actingAs - default to vendor profile
              profileHref = "/vendor/medicodio";
              profileBg = "bg-blue-50 hover:bg-blue-100";
              profileIcon = (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              );
              profileText = "View Profile";
            }
          } else {
            // Regular user
            profileHref = userEmail === "hitesh.ms24@gmail.com" ? "/vendor/medicodio" : isVendor ? `/vendor/${userId}` : (userId ? `/customer/${userId}` : `/profile`);
            profileBg = "bg-blue-50 hover:bg-blue-100";
            profileIcon = (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            );
            profileText = "View Profile";
          }

          return (
            <a
              href={profileHref}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${profileBg} ${actingAs ? "font-semibold" : ""}`}
            >
              {profileIcon}
              <span className="text-zinc-900">{profileText}</span>
              {activeLabel}
            </a>
          );
        })()}
      </div>
    </DashboardCard>
  );
}

