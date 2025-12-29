"use client";

interface DashboardHeaderCardProps {
  viewMode: "customer" | "vendor";
  stats?: {
    activeListings?: number;
    proposalsReceived?: number;
    inProgress?: number;
    completed?: number;
  };
  onCreateRequest?: () => void;
  showCreateButton?: boolean;
}

/**
 * DashboardHeaderCard Component
 * 
 * A contextual header card for the dashboard that provides:
 * - Dynamic insights based on user stats
 * - Actionable call-to-action
 * - Create Request button for customers
 * - No duplication of header information
 */
export function DashboardHeaderCard({
  viewMode,
  stats,
  onCreateRequest,
  showCreateButton = true,
}: DashboardHeaderCardProps) {
  const getContent = () => {
    if (viewMode === "customer") {
      const activeCount = stats?.activeListings || 0;
      const proposalsCount = stats?.proposalsReceived || 0;
      
      if (activeCount === 0 && proposalsCount === 0) {
        return {
          message: "Get started by creating your first project request and connect with vendors who can help.",
          highlight: "Create your first listing to begin",
        };
      } else if (activeCount > 0 && proposalsCount === 0) {
        return {
          message: `You have ${activeCount} active ${activeCount === 1 ? "listing" : "listings"} waiting for proposals.`,
          highlight: "Share your listings to attract vendors",
        };
      } else if (proposalsCount > 0) {
        return {
          message: `You've received ${proposalsCount} ${proposalsCount === 1 ? "proposal" : "proposals"} across your listings.`,
          highlight: "Review proposals to find the best match",
        };
      } else {
        return {
          message: "Manage your project listings, review proposals, and track progress from your dashboard.",
          highlight: "Stay organized and connected",
        };
      }
    } else {
      // Vendor mode
      const activeProjects = stats?.inProgress || 0;
      const completedProjects = stats?.completed || 0;
      
      if (activeProjects === 0 && completedProjects === 0) {
        return {
          message: "Browse available project requests and submit proposals to start working with customers.",
          highlight: "Explore opportunities in your categories",
        };
      } else if (activeProjects > 0) {
        return {
          message: `You have ${activeProjects} active ${activeProjects === 1 ? "project" : "projects"} in progress.`,
          highlight: "Keep delivering great results",
        };
      } else {
        return {
          message: `You've completed ${completedProjects} ${completedProjects === 1 ? "project" : "projects"}.`,
          highlight: "Build your reputation and grow",
        };
      }
    }
  };

  const content = getContent();

  return (
    <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 rounded-2xl border border-zinc-200 shadow-sm p-8 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-zinc-600 text-lg mb-2">{content.message}</p>
          <p className="text-zinc-500 text-sm">{content.highlight}</p>
        </div>
        {viewMode === "customer" && showCreateButton && onCreateRequest && (
          <button
            onClick={onCreateRequest}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-2.5 transform hover:scale-105 active:scale-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create Request
          </button>
        )}
      </div>
    </div>
  );
}

