"use client";

import { useState } from "react";
import { AddSectionModal } from "./AddSectionModal";

interface VendorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isVendorOwner?: boolean;
  isSuperAdmin?: boolean;
  enabledSections?: string[];
  enabledSubSections?: string[];
  onToggleSection?: (sectionId: string) => void;
  onToggleSubSection?: (sectionId: string, subSectionId: string) => void;
}

const AVAILABLE_SECTIONS = [
  {
    id: "overview",
    name: "Overview",
    description: "Product description, key metrics, and how you help customers",
    subsections: [
      { id: "product-description", name: "Product Description", description: "Main product description and solution details" },
      { id: "how-we-help", name: "How We Help Customers", description: "How your solution helps customers" },
      { id: "key-metrics", name: "Key Metrics", description: "Performance metrics and KPIs" },
      { id: "prerequisites", name: "Prerequisites", description: "Deployment options, integration capabilities, and requirements" },
      { id: "specialties", name: "Specialties Covered", description: "Medical specialties and performance data" },
      { id: "integrations", name: "Integrations Required", description: "Integration capabilities and requirements" },
    ],
  },
  {
    id: "updates",
    name: "Updates",
    description: "Product updates, releases, and roadmap information",
    subsections: [
      { id: "updates-list", name: "Updates", description: "Product updates, releases, and announcements" },
      { id: "roadmap", name: "Future Roadmap", description: "Planned features and future developments" },
    ],
  },
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Customer reviews and testimonials",
    subsections: [
      { id: "testimonials-list", name: "Customer Testimonials & Reviews", description: "Customer feedback and verified testimonials" },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    description: "Company information and contact details",
    subsections: [
      { id: "book-demo", name: "Book a Demo", description: "Demo booking and trial links" },
      { id: "company-overview", name: "Company Overview", description: "Company information and mission" },
      { id: "contact-info", name: "Contact Information", description: "Primary and secondary contact details" },
      { id: "team-leadership", name: "Team & Leadership", description: "Team members and leadership information" },
    ],
  },
  {
    id: "solved",
    name: "Solved Projects",
    description: "Projects and solutions you've completed",
    subsections: [
      { id: "solved-projects-list", name: "Solved Projects", description: "Projects where your proposals were accepted" },
    ],
  },
];

export function VendorTabs({ 
  activeTab, 
  onTabChange, 
  isVendorOwner = false, 
  isSuperAdmin = false,
  enabledSections = ["overview", "updates", "testimonials", "contact", "solved"],
  enabledSubSections = [],
  onToggleSection,
  onToggleSubSection,
}: VendorTabsProps) {
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const showAddSection = isVendorOwner || isSuperAdmin;

  const handleToggleSection = (sectionId: string) => {
    if (onToggleSection) {
      onToggleSection(sectionId);
    }
  };

  const handleToggleSubSection = (sectionId: string, subSectionId: string) => {
    if (onToggleSubSection) {
      onToggleSubSection(sectionId, subSectionId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 mb-4">
      <div className="flex items-center gap-8 px-6 border-b border-zinc-200 overflow-x-auto">
        {enabledSections.includes("overview") && (
            <button
              onClick={() => onTabChange("overview")}
              className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-blue-600 border-blue-600"
                  : "text-zinc-600 border-transparent hover:text-zinc-900"
              }`}
            >
              Overview
            </button>
        )}
        {enabledSections.includes("updates") && (
            <button
              onClick={() => onTabChange("updates")}
              className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "updates"
                  ? "text-blue-600 border-blue-600"
                  : "text-zinc-600 border-transparent hover:text-zinc-900"
              }`}
            >
              Updates
            </button>
        )}
        {enabledSections.includes("testimonials") && (
            <button
              onClick={() => onTabChange("testimonials")}
              className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "testimonials"
                  ? "text-blue-600 border-blue-600"
                  : "text-zinc-600 border-transparent hover:text-zinc-900"
              }`}
            >
              Testimonials
            </button>
        )}
        {enabledSections.includes("contact") && (
            <button
              onClick={() => onTabChange("contact")}
              className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "contact"
                  ? "text-blue-600 border-blue-600"
                  : "text-zinc-600 border-transparent hover:text-zinc-900"
              }`}
            >
              Contact
            </button>
        )}
        {enabledSections.includes("solved") && (
            <button
              onClick={() => onTabChange("solved")}
              className={`py-4 px-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "solved"
                  ? "text-blue-600 border-blue-600"
                  : "text-zinc-600 border-transparent hover:text-zinc-900"
              }`}
            >
              Solved Projects
            </button>
        )}
        
        {/* Add Section Button - Only visible for vendor owner or super admin */}
        {showAddSection && (
          <div className="ml-auto flex items-center">
              <button
                onClick={() => setShowAddSectionModal(true)}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg transition-colors text-sm font-semibold whitespace-nowrap"
              >
                Add Section
              </button>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        availableSections={AVAILABLE_SECTIONS}
        enabledSections={enabledSections}
        enabledSubSections={enabledSubSections}
        onToggleSection={handleToggleSection}
        onToggleSubSection={handleToggleSubSection}
      />
    </div>
  );
}
