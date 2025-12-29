"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { Sidebar } from "@/components/Sidebar";
import { FormField, Input, Textarea } from "@/components/questionnaire/FormField";

const CATEGORIES = [
  "AI Diagnostics",
  "Medical Coding",
  "Clinical Decision Support",
  "Patient Engagement",
  "Revenue Cycle Management",
  "Telemedicine",
  "Population Health",
  "Data Analytics",
  "Electronic Health Records",
  "Workflow Automation",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const BUDGET_RANGES = [
  "$0 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $500,000",
  "$500,000 - $1,000,000",
  "$1,000,000+",
  "Not specified",
];

const TIMELINES = [
  "Immediate",
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "12+ months",
  "Exploring options",
];

const CONTRACT_TYPES = [
  "Monthly",
  "Annual",
  "Multi-year",
  "Pay-as-you-go",
  "One-time",
  "Other",
];

const DEPLOYMENT_OPTIONS = [
  "Cloud",
  "On-premise",
  "Hybrid",
  "No preference",
];

const COMPLIANCE_OPTIONS = [
  "HIPAA",
  "HITECH",
  "GDPR",
  "SOC 2",
  "HITRUST",
  "ISO 27001",
  "Other",
];

interface ListingFormData {
  title: string;
  description: string;
  category: string[];
  priority: string;
  requiredFeatures: string[];
  preferredFeatures: string[];
  technicalRequirements: string[];
  integrationRequirements: string[];
  complianceRequirements: string[];
  budgetRange: string;
  timeline: string;
  contractType: string[];
  deploymentPreference: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle: string;
  additionalNotes: string;
  status: string;
}

function CreateListingContent() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    description: "",
    category: [],
    priority: "medium",
    requiredFeatures: [],
    preferredFeatures: [],
    technicalRequirements: [],
    integrationRequirements: [],
    complianceRequirements: [],
    budgetRange: "Not specified",
    timeline: "Exploring options",
    contractType: [],
    deploymentPreference: [],
    contactName: user?.firstName || "",
    contactEmail: user?.emailAddresses[0]?.emailAddress || "",
    contactPhone: "",
    contactTitle: "",
    additionalNotes: "",
    status: "draft",
  });

  const [tempFeature, setTempFeature] = useState("");
  const [tempTechnicalReq, setTempTechnicalReq] = useState("");
  const [tempIntegrationReq, setTempIntegrationReq] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactName: prev.contactName || user.firstName || "",
        contactEmail: prev.contactEmail || user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user]);

  const updateField = (field: keyof ListingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof ListingFormData, item: string) => {
    if (item.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), item.trim()],
      }));
    }
  };

  const removeArrayItem = (field: keyof ListingFormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const toggleArrayItem = (field: keyof ListingFormData, value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/listings/${data.data._id}`);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} pt-8 pb-12 px-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-zinc-300 p-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Create New Listing</h1>
            <p className="text-zinc-600 mb-6">
              Describe your product requirements and connect with vendors
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
                  Basic Information
                </h2>
                
                <FormField label="Title" required>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g., AI-Powered Medical Coding Solution"
                    required
                  />
                </FormField>

                <FormField label="Description" required>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={6}
                    placeholder="Describe what you're looking for in detail..."
                    required
                  />
                </FormField>

                <FormField label="Category">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleArrayItem("category", cat)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          formData.category.includes(cat)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Priority">
                  <select
                    value={formData.priority}
                    onChange={(e) => updateField("priority", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
                  Requirements
                </h2>

                <FormField label="Required Features">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tempFeature}
                        onChange={(e) => setTempFeature(e.target.value)}
                        placeholder="Add a required feature"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("requiredFeatures", tempFeature);
                            setTempFeature("");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addArrayItem("requiredFeatures", tempFeature);
                          setTempFeature("");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.requiredFeatures.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-300 flex items-center gap-2"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeArrayItem("requiredFeatures", idx)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormField>

                <FormField label="Preferred Features">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tempFeature}
                        onChange={(e) => setTempFeature(e.target.value)}
                        placeholder="Add a preferred feature"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("preferredFeatures", tempFeature);
                            setTempFeature("");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addArrayItem("preferredFeatures", tempFeature);
                          setTempFeature("");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.preferredFeatures.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm border border-green-300 flex items-center gap-2"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeArrayItem("preferredFeatures", idx)}
                            className="hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormField>

                <FormField label="Technical Requirements">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tempTechnicalReq}
                        onChange={(e) => setTempTechnicalReq(e.target.value)}
                        placeholder="Add a technical requirement"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("technicalRequirements", tempTechnicalReq);
                            setTempTechnicalReq("");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addArrayItem("technicalRequirements", tempTechnicalReq);
                          setTempTechnicalReq("");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technicalRequirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300 flex items-center gap-2"
                        >
                          {req}
                          <button
                            type="button"
                            onClick={() => removeArrayItem("technicalRequirements", idx)}
                            className="hover:text-zinc-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormField>

                <FormField label="Integration Requirements">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tempIntegrationReq}
                        onChange={(e) => setTempIntegrationReq(e.target.value)}
                        placeholder="e.g., Epic, Cerner, etc."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("integrationRequirements", tempIntegrationReq);
                            setTempIntegrationReq("");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addArrayItem("integrationRequirements", tempIntegrationReq);
                          setTempIntegrationReq("");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.integrationRequirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300 flex items-center gap-2"
                        >
                          {req}
                          <button
                            type="button"
                            onClick={() => removeArrayItem("integrationRequirements", idx)}
                            className="hover:text-zinc-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </FormField>

                <FormField label="Compliance Requirements">
                  <div className="flex flex-wrap gap-2">
                    {COMPLIANCE_OPTIONS.map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => toggleArrayItem("complianceRequirements", comp)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          formData.complianceRequirements.includes(comp)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
                  Business Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Budget Range">
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => updateField("budgetRange", e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {BUDGET_RANGES.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Timeline">
                    <select
                      value={formData.timeline}
                      onChange={(e) => updateField("timeline", e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TIMELINES.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Contract Type">
                  <div className="flex flex-wrap gap-2">
                    {CONTRACT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleArrayItem("contractType", type)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          formData.contractType.includes(type)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Deployment Preference">
                  <div className="flex flex-wrap gap-2">
                    {DEPLOYMENT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleArrayItem("deploymentPreference", option)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          formData.deploymentPreference.includes(option)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Contact Name" required>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => updateField("contactName", e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Contact Title">
                    <Input
                      value={formData.contactTitle}
                      onChange={(e) => updateField("contactTitle", e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Contact Email" required>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateField("contactEmail", e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Contact Phone">
                    <Input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => updateField("contactPhone", e.target.value)}
                    />
                  </FormField>
                </div>
              </div>

              {/* Additional Notes */}
              <FormField label="Additional Notes">
                <Textarea
                  value={formData.additionalNotes}
                  onChange={(e) => updateField("additionalNotes", e.target.value)}
                  rows={4}
                  placeholder="Any additional information..."
                />
              </FormField>

              {/* Status */}
              <FormField label="Status">
                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active (Publish Now)</option>
                </select>
              </FormField>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Listing"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <OnboardingGuard>
      <CreateListingContent />
    </OnboardingGuard>
  );
}

