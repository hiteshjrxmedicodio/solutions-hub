"use client";

import { DashboardCard } from "./DashboardCard";

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface QuickStatsProps {
  stats: Stat[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <DashboardCard key={index} hover>
          <div className="flex items-center justify-between mb-2">
            <div className="text-zinc-600">{stat.icon}</div>
            <span className="text-2xl font-bold text-zinc-900">{stat.value}</span>
          </div>
          <p className="text-sm text-zinc-600">{stat.label}</p>
        </DashboardCard>
      ))}
    </div>
  );
}

