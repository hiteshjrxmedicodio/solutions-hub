"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
import { InstitutionInfo } from "./components/InstitutionInfo";
import { BuyerQuestionnaire } from "@/components/buyer-questionnaire/BuyerQuestionnaire";
import { BuyerQuestionnaireData } from "@/components/buyer-questionnaire/types";

interface CustomerData {
  userId: string;
  institutionName: string;
  institutionType?: string;
  location?: {
    state: string;
    country: string;
  };
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  selectedAISolutions?: string[];
  priority?: string;
}

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export default function CustomerDetailPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { user, isLoaded: userLoaded } = useUser();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL || user?.publicMetadata?.role === "superadmin";
  const isCustomerOwner = user?.id === userId || isSuperAdmin;

  useEffect(() => {
    async function fetchCustomer() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/buyer/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer profile");
        }

        const data = await response.json();
        if (data.success && data.data) {
          // Extract priority from additionalNotes if it exists
          const institution = data.data;
          let priority = "";
          if (institution.additionalNotes && institution.additionalNotes.startsWith("Priority: ")) {
            priority = institution.additionalNotes.replace("Priority: ", "");
          }
          
          setCustomer({
            ...institution,
            priority,
          });
        } else {
          // Profile doesn't exist yet
          setProfileNotFound(true);
          // For super admin, automatically open edit mode
          if (isSuperAdmin && isCustomerOwner) {
            setIsEditMode(true);
          }
          setError(null); // Don't show error, just show empty state with questionnaire
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
        // For super admin, if profile doesn't exist, show questionnaire instead of error
        if (isSuperAdmin && isCustomerOwner) {
          setError(null);
          setProfileNotFound(true);
          setIsEditMode(true);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load customer profile");
        }
      } finally {
        setLoading(false);
      }
    }

    if (userLoaded && user) {
      fetchCustomer();
    }
  }, [userLoaded, user, isSuperAdmin, isCustomerOwner]);

  const handleSave = async (data: BuyerQuestionnaireData) => {
    try {
      const response = await fetch("/api/buyer/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        // Extract priority from additionalNotes
        const institution = result.data;
        let priority = "";
        if (institution.additionalNotes && institution.additionalNotes.startsWith("Priority: ")) {
          priority = institution.additionalNotes.replace("Priority: ", "");
        }
        
        setCustomer({
          ...institution,
          priority,
        });
        setIsEditMode(false);
        setError(null); // Clear any previous errors
        setProfileNotFound(false); // Clear profile not found flag
      } else {
        throw new Error(result.error || "Failed to save profile");
      }
    } catch (err) {
      console.error("Error saving customer profile:", err);
      alert(err instanceof Error ? err.message : "Failed to save profile");
    }
  };

  // Convert customer data to BuyerQuestionnaireData format
  const getInitialQuestionnaireData = (): Partial<BuyerQuestionnaireData> | undefined => {
    if (!customer) return undefined;
    return {
      institutionName: customer.institutionName,
      institutionType: customer.institutionType,
      location: customer.location,
      solutionCategories: customer.selectedAISolutions || [],
      priority: customer.priority || "",
      primaryContact: customer.primaryContact,
    };
  };

  if (!userLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-zinc-600">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Handle cancel for questionnaire modal
  const handleQuestionnaireClose = () => {
    setIsEditMode(false);
    if (isSuperAdmin && profileNotFound) {
      // Redirect to vendor profile if super admin cancels creating profile
      window.location.href = "/vendor/seed-medicodio";
    }
  };

  // If profile doesn't exist and we're not in edit mode, show create button
  if ((error || !customer || profileNotFound) && !isEditMode) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-zinc-600 mb-4">
                {error ? error : "Customer profile not found"}
              </p>
              {isCustomerOwner && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-lg"
                >
                  Create Customer Profile
                </button>
              )}
            </div>
          </div>

          {/* Customer Questionnaire Modal for creating new profile */}
          {isEditMode && isCustomerOwner && (
            <BuyerQuestionnaire
              isOpen={isEditMode}
              onClose={handleQuestionnaireClose}
              onSubmit={handleSave}
              initialData={undefined}
            />
          )}
        </main>
      </div>
    );
  }

  // Only render profile content if customer exists
  // If customer is null at this point, show fallback UI
  if (!customer) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-zinc-600 mb-4">Customer profile not found</p>
              {isCustomerOwner && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-lg"
                >
                  Create Customer Profile
                </button>
              )}
            </div>
          </div>
          {isEditMode && isCustomerOwner && (
            <BuyerQuestionnaire
              isOpen={isEditMode}
              onClose={handleQuestionnaireClose}
              onSubmit={handleSave}
              initialData={undefined}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        {/* Main Content - Two Column Layout */}
        <div className="w-full pt-8 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-end mb-6">
              {isCustomerOwner && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sticky top-8">
                  {/* Institution Logo/Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {customer.institutionName && (
                      <div className="text-3xl font-bold text-white">
                        {customer.institutionName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Institution Name */}
                  <h1 className="text-2xl font-bold text-zinc-900 text-center mb-2">
                    {customer.institutionName}
                  </h1>
                  
                  {customer.institutionType && (
                    <p className="text-sm text-zinc-600 text-center mb-6">
                      {customer.institutionType}
                    </p>
                  )}

                  {/* Location */}
                  {customer.location && (
                    <div className="flex items-center justify-center gap-2 text-sm text-zinc-600 mb-6">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{customer.location.state}, {customer.location.country}</span>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="border-t border-zinc-200 pt-6">
                    <h3 className="text-sm font-semibold text-zinc-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{customer.primaryContact.name}</p>
                        <p className="text-xs text-zinc-600">{customer.primaryContact.title}</p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="break-all">{customer.primaryContact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{customer.primaryContact.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Information/Requirements */}
              <div className="lg:col-span-2">
                <InstitutionInfo customer={customer} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Customer Questionnaire Modal */}
      {isEditMode && isCustomerOwner && (
        <BuyerQuestionnaire
          isOpen={isEditMode}
          onClose={handleQuestionnaireClose}
          onSubmit={handleSave}
          initialData={getInitialQuestionnaireData()}
        />
      )}
    </div>
  );
}

