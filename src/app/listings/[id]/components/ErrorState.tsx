"use client";

import { Sidebar } from "@/components/Sidebar";

interface ErrorStateProps {
  error: string | null;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  onSidebarClose: () => void;
  isSidebarCollapsed: boolean;
  onSidebarCollapseToggle: () => void;
}

export function ErrorState({
  error,
  isSidebarOpen,
  onSidebarToggle,
  onSidebarClose,
  isSidebarCollapsed,
  onSidebarCollapseToggle,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={onSidebarToggle}
        onClose={onSidebarClose}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={onSidebarCollapseToggle}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="flex items-center justify-center min-h-screen pt-8">
          <div className="text-red-600">Error: {error || "Listing not found"}</div>
        </div>
      </div>
    </div>
  );
}

