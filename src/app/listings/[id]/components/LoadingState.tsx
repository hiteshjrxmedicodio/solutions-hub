"use client";

import { Sidebar } from "@/components/Sidebar";

interface LoadingStateProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  onSidebarClose: () => void;
  isSidebarCollapsed: boolean;
  onSidebarCollapseToggle: () => void;
}

export function LoadingState({
  isSidebarOpen,
  onSidebarToggle,
  onSidebarClose,
  isSidebarCollapsed,
  onSidebarCollapseToggle,
}: LoadingStateProps) {
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-zinc-600">Loading listing...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

