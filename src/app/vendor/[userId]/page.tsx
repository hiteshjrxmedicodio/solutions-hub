"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
import { VendorBanner } from "./components/VendorBanner";
import { VendorTabs } from "./components/VendorTabs";
import { ProductListSection } from "./components/ProductListSection";
import { ComplianceSection } from "./components/ComplianceSection";
import { OverviewTabContent } from "./components/OverviewTabContent";
import { ContactTabContent } from "./components/ContactTabContent";
import { UpdatesTabContent } from "./components/UpdatesTabContent";
import { TestimonialsTabContent } from "./components/TestimonialsTabContent";
import { SolvedProjectsTabContent } from "./components/SolvedProjectsTabContent";

interface VendorData {
  userId: string;
  companyName: string;
  companyType?: string;
  website?: string;
  foundedYear?: number;
  location?: {
    state: string;
    country: string;
  };
  companySize?: string;
  missionStatement?: string;
  headquarters?: string;
  solutionName?: string;
  solutionDescription?: string;
  productDescription?: string;
  solutionCategory?: string[];
  targetSpecialties?: string[];
  specialtiesPerformance?: Array<{
    specialty: string;
    performanceData: string;
  }>;
  targetInstitutionTypes?: string[];
  deploymentOptions?: string[];
  integrationCapabilities?: string[];
  technologyStack?: string[];
  integrations?: Array<{
    name: string;
    logoUrl?: string;
    apiCompatible?: boolean;
    workflowTools?: string[];
  }>;
  complianceCertifications?: string[];
  certificationDocuments?: Array<{
    certification: string;
    documentUrl?: string;
    logoUrl?: string;
    issuedDate?: Date;
    expiryDate?: Date;
  }>;
  pricingModel?: string;
  pricingRange?: string;
  pricingPlans?: Array<{
    tierName: string;
    price: string;
    features: string[];
    contractTerms?: string[];
  }>;
  freemiumOptions?: string;
  roiCalculator?: string;
  customerTestimonials?: Array<{
    customerName: string;
    customerTitle?: string;
    customerLogo?: string;
    testimonial: string;
    metrics?: string;
    verified?: boolean;
  }>;
  demoLink?: string;
  trialLink?: string;
  onboardingProcess?: string;
  supportSLAs?: string;
  teamMembers?: Array<{
    name: string;
    title: string;
    bio?: string;
    photoUrl?: string;
    expertise?: string[];
    linkedinUrl?: string;
  }>;
  keyMetrics?: {
    codingAccuracy?: string;
    firstPassRate?: string;
    throughputGains?: string;
    costSavings?: string;
    [key: string]: string | undefined;
  };
  verified?: boolean;
  verificationHistory?: Array<{
    customerUserId: string;
    customerName: string;
    verifiedAt: Date;
    testimonialId?: string;
  }>;
  updates?: Array<{
    title: string;
    content: string;
    date: Date;
    type: 'release' | 'feature' | 'announcement' | 'roadmap';
    linkedinPosted?: boolean;
  }>;
  futureRoadmap?: string;
  primaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  secondaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  products?: Array<{
    name: string;
    description: string;
    category?: string[];
    features?: string[];
    demoLink?: string;
    trialLink?: string;
  }>;
}

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export default function VendorDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { user, isLoaded: userLoaded } = useUser();
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [enabledSections, setEnabledSections] = useState<string[]>([
    "overview",
    "updates",
    "testimonials",
    "contact",
    "solved",
  ]);
  const [enabledSubSections, setEnabledSubSections] = useState<string[]>([
    "overview.product-description",
    "overview.how-we-help",
    "overview.key-metrics",
    "overview.prerequisites",
    "overview.specialties",
    "overview.integrations",
    "updates.updates-list",
    "updates.roadmap",
    "testimonials.testimonials-list",
    "contact.book-demo",
    "contact.company-overview",
    "contact.contact-info",
    "contact.team-leadership",
    "solved.solved-projects-list",
  ]);

  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL;
  // Special case: medicodio and seed-medicodio are linked to hitesh.ms24@gmail.com
  const isMedicodio = userId === "medicodio" || userId === "seed-medicodio";
  const isVendorOwner = user?.id === userId || (isMedicodio && isSuperAdmin);

  useEffect(() => {
    async function fetchVendor() {
      try {
        setLoading(true);
        setError(null);
        
        // Special case: medicodio and seed-medicodio use a special endpoint
        let endpoint;
        if (isMedicodio && isSuperAdmin) {
          endpoint = `/api/vendor/special/medicodio`;
        } else if (isVendorOwner || isSuperAdmin) {
          // If vendor is viewing their own page OR superadmin, use private endpoint (allows unapproved profiles)
          endpoint = `/api/vendor/${userId}`;
        } else {
        // Otherwise, use public endpoint (only approved profiles)
          endpoint = `/api/vendor/public/${userId}`;
        }
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          // Handle 404 more gracefully
          if (response.status === 404) {
            setError("Vendor profile not found. The vendor may not have completed their profile yet.");
          } else if (response.status === 401) {
            setError("You don't have permission to view this vendor profile.");
          } else {
            setError(data.error || "Failed to load vendor profile");
          }
          setVendor(null);
          return;
        }
        
        if (data.success && data.data) {
          setVendor(data.data);
        } else {
          setError(data.error || "Vendor profile not found");
          setVendor(null);
        }
      } catch (err) {
        console.error("Error fetching vendor:", err);
        setError(err instanceof Error ? err.message : "Failed to load vendor profile");
        setVendor(null);
      } finally {
        setLoading(false);
      }
    }

    if (userId && userLoaded) {
      fetchVendor();
    }
  }, [userId, userLoaded, isVendorOwner, isMedicodio, isSuperAdmin]);

  const handleUpdate = async (section: string, data: any) => {
    if (!vendor || !isSuperAdmin) return;

    try {
      const response = await fetch("/api/vendor/admin/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorUserId: vendor.userId,
          updates: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update vendor");
      }

      const result = await response.json();
      if (result.success) {
        // Refresh vendor data
        let refreshResponse;
        if (isMedicodio && isSuperAdmin) {
          refreshResponse = await fetch(`/api/vendor/special/medicodio`);
        } else {
          refreshResponse = await fetch(`/api/vendor/public/${userId}`);
        }
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setVendor(refreshData.data);
          }
        }
      }
    } catch (err) {
      console.error("Error updating vendor:", err);
      throw err;
    }
  };

  const handleSectionSave = async (field: string, value: any) => {
    if (!vendor || (!isVendorOwner && !isSuperAdmin)) return;

    try {
      let response;
      if (isSuperAdmin) {
        // Use admin endpoint for super admin
        response = await fetch("/api/vendor/admin/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorUserId: vendor.userId,
            updates: { [field]: value },
          }),
        });
      } else if (isVendorOwner) {
        // Use regular vendor endpoint for vendor owners
        response = await fetch(`/api/vendor/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: value }),
        });
      } else {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const result = await response.json();
      if (result.success) {
        // Refresh vendor data
        let refreshResponse;
        if (isMedicodio && isSuperAdmin) {
          refreshResponse = await fetch(`/api/vendor/special/medicodio`);
        } else if (isVendorOwner) {
          refreshResponse = await fetch(`/api/vendor/${userId}`);
        } else {
          refreshResponse = await fetch(`/api/vendor/public/${userId}`);
        }
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setVendor(refreshData.data);
          }
        }
      }
    } catch (err) {
      console.error("Error saving section:", err);
      throw err;
    }
  };

  const handleProductAdd = async (product: any) => {
    if (!vendor) return;

    try {
      const currentProducts = vendor.products || [];
      const updatedProducts = [...currentProducts, product];

      let response;
      if (isSuperAdmin) {
        // Use admin endpoint for super admin
        response = await fetch("/api/vendor/admin/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorUserId: vendor.userId,
            updates: { products: updatedProducts },
          }),
        });
      } else if (isVendorOwner) {
        // Use regular vendor endpoint for vendor owners
        response = await fetch(`/api/vendor/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: updatedProducts }),
        });
      } else {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const result = await response.json();
      if (result.success) {
        // Refresh vendor data
        let refreshResponse;
        if (isMedicodio && isSuperAdmin) {
          refreshResponse = await fetch(`/api/vendor/special/medicodio`);
        } else if (isVendorOwner) {
          refreshResponse = await fetch(`/api/vendor/${userId}`);
        } else {
          refreshResponse = await fetch(`/api/vendor/public/${userId}`);
        }
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setVendor(refreshData.data);
          }
        }
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product. Please try again.");
    }
  };


  if (loading || !userLoaded) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex overflow-y-auto" style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
          <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} max-w-7xl mx-auto px-6 py-16 pt-8 flex items-center justify-center`}>
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-zinc-600">Loading vendor profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    // If vendor is viewing their own page and profile doesn't exist, show helpful message
    if (isVendorOwner) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex overflow-y-auto" style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} max-w-7xl mx-auto px-6 py-16 pt-8 flex items-center justify-center`}>
            <div className="text-center max-w-2xl">
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">Create Your Vendor Profile</h1>
              <p className="text-zinc-600 mb-6">
                You haven't created your vendor profile yet. Click the button below to get started and showcase your AI solutions to healthcare institutions.
              </p>
              <button
                onClick={() => {
                  // Open vendor questionnaire - this will be handled by the vendor page itself
                  window.location.reload();
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                Create Vendor Profile
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex overflow-y-auto" style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} max-w-7xl mx-auto px-6 py-16 pt-8`}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 font-semibold">Error: {error || "Vendor not found"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex overflow-y-auto" style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
      {/* Banner */}
      <VendorBanner
        companyName={vendor.companyName}
        solutionCategory={vendor.solutionCategory}
        website={vendor.website}
        solutionDescription={vendor.solutionDescription}
        productDescription={vendor.productDescription}
        missionStatement={vendor.missionStatement}
      />

      {/* Main Content - Three Column Layout with Specific Widths */}
      <div className="w-full pb-12">
        <div className="w-full px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Middle Section - Main Content - 68% (adjusted to accommodate narrower Products) */}
            <div className="w-full lg:w-[68%] flex-shrink-0">
              {/* Navigation Tabs - Below white card */}
              <div className="mb-6 mt-6">
                <VendorTabs 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab}
                  isVendorOwner={isVendorOwner}
                  isSuperAdmin={isSuperAdmin}
                  enabledSections={enabledSections}
                  enabledSubSections={enabledSubSections}
                  onToggleSection={(sectionId) => {
                    setEnabledSections((prev) => {
                      const newSections = prev.includes(sectionId)
                        ? prev.filter((id) => id !== sectionId) // Remove section
                        : [...prev, sectionId]; // Add section
                      
                      // If the active tab was disabled, switch to the first available tab
                      if (activeTab === sectionId && !newSections.includes(sectionId)) {
                        if (newSections.length > 0) {
                          setActiveTab(newSections[0]);
                        }
                      }
                      
                      return newSections;
                    });
                  }}
                  onToggleSubSection={(sectionId, subSectionId) => {
                    const subSectionKey = `${sectionId}.${subSectionId}`;
                    setEnabledSubSections((prev) => {
                      if (prev.includes(subSectionKey)) {
                        return prev.filter((id) => id !== subSectionKey);
                      } else {
                        return [...prev, subSectionKey];
                      }
                    });
                  }}
                />
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {/* Overview Tab */}
                {enabledSections.includes("overview") && activeTab === "overview" && (
                  <OverviewTabContent
                    productDescription={vendor.productDescription}
                    solutionDescription={vendor.solutionDescription}
                    targetSpecialties={vendor.targetSpecialties}
                    specialtiesPerformance={vendor.specialtiesPerformance}
                    keyMetrics={vendor.keyMetrics}
                    deploymentOptions={vendor.deploymentOptions}
                    integrationCapabilities={vendor.integrationCapabilities}
                    targetInstitutionTypes={vendor.targetInstitutionTypes}
                    technologyStack={vendor.technologyStack}
                    integrations={vendor.integrations}
                    enabledSubSections={enabledSubSections}
                    isEditable={isVendorOwner || isSuperAdmin}
                    onSave={handleSectionSave}
                  />
                )}

                {/* Updates Tab */}
                {enabledSections.includes("updates") && activeTab === "updates" && (
                  <UpdatesTabContent
                    updates={vendor.updates}
                    futureRoadmap={vendor.futureRoadmap}
                    enabledSubSections={enabledSubSections}
                    isEditable={isVendorOwner || isSuperAdmin}
                    onSave={handleSectionSave}
                  />
                )}

                {/* Testimonials Tab */}
                {enabledSections.includes("testimonials") && activeTab === "testimonials" && (
                  <TestimonialsTabContent
                    testimonials={vendor.customerTestimonials}
                    vendorUserId={vendor.userId}
                    companyName={vendor.companyName}
                    isVendorOwner={user?.id === vendor.userId || (isMedicodio && isSuperAdmin)}
                    enabledSubSections={enabledSubSections}
                    onRefresh={async () => {
                      let refreshResponse;
                      if (isMedicodio && isSuperAdmin) {
                        refreshResponse = await fetch(`/api/vendor/special/medicodio`);
                      } else {
                        refreshResponse = await fetch(`/api/vendor/public/${userId}`);
                      }
                      if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        if (refreshData.success && refreshData.data) {
                          setVendor(refreshData.data);
                        }
                      }
                    }}
                  />
                )}

                {/* Contact Tab */}
                {enabledSections.includes("contact") && activeTab === "contact" && (
                  <ContactTabContent
                    companyName={vendor.companyName}
                    companyType={vendor.companyType}
                    website={vendor.website}
                    foundedYear={vendor.foundedYear}
                    location={vendor.location}
                    companySize={vendor.companySize}
                    missionStatement={vendor.missionStatement}
                    headquarters={vendor.headquarters}
                    primaryContact={vendor.primaryContact}
                    secondaryContact={vendor.secondaryContact}
                    demoLink={vendor.demoLink}
                    trialLink={vendor.trialLink}
                    teamMembers={vendor.teamMembers}
                    enabledSubSections={enabledSubSections}
                    isEditable={isVendorOwner || isSuperAdmin}
                    onSave={handleSectionSave}
                  />
                )}

                {/* Solved Projects Tab */}
                {enabledSections.includes("solved") && activeTab === "solved" && (
                  <SolvedProjectsTabContent
                    vendorUserId={vendor.userId}
                    enabledSubSections={enabledSubSections}
                  />
                )}
              </div>
            </div>

            {/* Right Sidebar - Products and Compliance & Certifications - 32% (reduced by 20% from 40%) */}
            <aside className="w-full lg:w-[32%] flex-shrink-0">
              <div className="space-y-6 mt-6">
                {/* Products */}
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 pr-12 mr-4 hover:shadow-md transition-shadow max-w-[calc(100%-1rem)]">
                  <ProductListSection
                    products={vendor.products}
                    solutionName={vendor.solutionName}
                    companyName={vendor.companyName}
                    productDescription={vendor.productDescription}
                    solutionDescription={vendor.solutionDescription}
                    solutionCategory={vendor.solutionCategory}
                    demoLink={vendor.demoLink}
                    trialLink={vendor.trialLink}
                    onProductAdd={isVendorOwner || isSuperAdmin ? handleProductAdd : undefined}
                  />
                </div>
                
                {/* Compliance & Certifications */}
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 pr-12 mr-4 hover:shadow-md transition-shadow max-w-[calc(100%-1rem)]">
                  <ComplianceSection 
                    complianceCertifications={vendor.complianceCertifications}
                    certificationDocuments={vendor.certificationDocuments}
                  />
                </div>
              </div>
            </aside>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
