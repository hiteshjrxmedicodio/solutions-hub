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
      </div>
    </DashboardCard>
  );
}

