"use client";

import { DashboardCard } from "./DashboardCard";

interface DashboardHeaderProps {
  userName: string;
  isSuperAdmin: boolean;
  viewMode: "customer" | "vendor";
  onViewModeChange: (mode: "customer" | "vendor") => void;
}

export function DashboardHeader({ userName, isSuperAdmin, viewMode, onViewModeChange }: DashboardHeaderProps) {
  return (
    <DashboardCard className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Dashboard</h1>
          <p className="text-zinc-600">Welcome back, {userName}!</p>
        </div>
        {/* Role Switcher for Super Admin */}
        {isSuperAdmin && (
          <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("customer")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "customer"
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-blue-50"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => onViewModeChange("vendor")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "vendor"
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-blue-50"
              }`}
            >
              Vendor
            </button>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

