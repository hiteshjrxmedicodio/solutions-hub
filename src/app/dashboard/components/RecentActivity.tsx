"use client";

import { DashboardCard } from "./DashboardCard";

export function RecentActivity() {
  return (
    <DashboardCard className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="text-sm text-zinc-500 text-center py-8">
          No recent activity to display
        </div>
      </div>
    </DashboardCard>
  );
}

