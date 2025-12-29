"use client";

interface InfoCardProps {
  isSuperAdmin: boolean;
  viewMode: "customer" | "vendor";
  userRole?: string;
}

export function InfoCard({ isSuperAdmin, viewMode, userRole }: InfoCardProps) {
  const getMessage = () => {
    if (isSuperAdmin && viewMode === "vendor") {
      return "View vendor analytics, track proposals, and monitor market interest in your solution categories.";
    }
    if (userRole === "buyer" || (isSuperAdmin && viewMode === "customer")) {
      return "Manage your project listings, view proposals, and track your projects from here.";
    }
    if (userRole === "seller") {
      return "Manage your vendor profile, browse listings, and track your proposals from here.";
    }
    return "Get started by completing your profile setup.";
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-blue-600 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Welcome to Your Dashboard</h3>
          <p className="text-blue-800 text-sm">{getMessage()}</p>
        </div>
      </div>
    </div>
  );
}

