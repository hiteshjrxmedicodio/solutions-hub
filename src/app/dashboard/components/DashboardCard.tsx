"use client";

import { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

/**
 * DashboardCard Component
 * 
 * A reusable card component for dashboard sections with consistent styling
 * Matches the card style used in ListingDetailModal for visual consistency
 */
export function DashboardCard({ 
  children, 
  className = "", 
  onClick,
  hover = false 
}: DashboardCardProps) {
  const baseClasses = "bg-white rounded-xl border border-zinc-200 shadow-sm p-4";
  const hoverClasses = hover || onClick ? "hover:shadow-md transition-shadow cursor-pointer" : "";
  const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`.trim();

  return (
    <div 
      className={combinedClasses}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}

