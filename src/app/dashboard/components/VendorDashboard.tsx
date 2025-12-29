"use client";

import { ActiveProjects } from "./ActiveProjects";
import { CompletedProjects } from "./CompletedProjects";
import { VendorFilterSidebar } from "./VendorFilterSidebar";

interface VendorStats {
  listingsInVendorCategories: number;
  categoryViews: number;
  activeAcceptedProposalsList: Array<{
    id: string;
    title: string;
    category?: string[];
    status: string;
  }>;
  acceptedProposalsCount: number;
  proposalsByStatus: {
    pending: number;
    accepted: number;
    rejected: number;
  };
  vendorCategories: string[];
  vendorProductName: string;
  vendorCompanyName: string;
}

interface VendorDashboardProps {
  vendorStats: VendorStats;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function VendorDashboard({ vendorStats, selectedCategory, onCategoryChange }: VendorDashboardProps) {
  const productName = vendorStats.vendorProductName || vendorStats.vendorCompanyName || "N/A";

  // Separate active and completed projects
  const activeProjects = vendorStats.activeAcceptedProposalsList.filter(
    (project) => project.status === "in_progress"
  );
  const completedProjects = vendorStats.activeAcceptedProposalsList.filter(
    (project) => project.status === "completed"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
      <ActiveProjects projects={activeProjects} />
      <CompletedProjects projects={completedProjects} />
      <VendorFilterSidebar
        productName={productName}
        categories={vendorStats.vendorCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
}

