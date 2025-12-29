"use client";

import { DashboardCard } from "./DashboardCard";

interface QuickActionsProps {
  userRole?: string;
  isSuperAdmin: boolean;
  viewMode: "customer" | "vendor";
  userEmail: string;
  userId?: string;
  onCreateListingClick: () => void;
}

export function QuickActions({
  userRole,
  isSuperAdmin,
  viewMode,
  userEmail,
  userId,
  onCreateListingClick,
}: QuickActionsProps) {
  const isCustomer = userRole === "buyer" || (isSuperAdmin && viewMode === "customer");
  const isVendor = userRole === "seller" || (isSuperAdmin && viewMode === "vendor");

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

        {/* View Profile - Available for both customers and vendors */}
        <a
          href={userEmail === "hitesh.ms24@gmail.com" ? "/vendor/seed-medicodio" : isVendor ? `/vendor/${userId}` : `/profile`}
          className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-zinc-900">View Profile</span>
        </a>
      </div>
    </DashboardCard>
  );
}

