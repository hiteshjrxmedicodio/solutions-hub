"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Requirements" },
  { id: 3, name: "Business Details" },
  { id: 4, name: "Contact Information" },
  { id: 5, name: "Review & Submit" },
];

export function CreateListingModal({ isOpen, onClose }: CreateListingModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
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
    if (user && isOpen) {
      setFormData((prev) => ({
        ...prev,
        contactName: prev.contactName || user.firstName || "",
        contactEmail: prev.contactEmail || user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setTempFeature("");
      setTempTechnicalReq("");
      setTempIntegrationReq("");
    }
  }, [isOpen]);

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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title.trim() && formData.description.trim());
      case 2:
        return true; // Requirements are optional
      case 3:
        return true; // Business details are optional
      case 4:
        return !!(formData.contactName.trim() && formData.contactEmail.trim());
      case 5:
        return true; // Review step
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
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
        onClose();
        router.push(`/listings/${data.data._id}`);
        router.refresh();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Create New Listing</h2>
            <p className="text-sm text-zinc-600 mt-1">Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      currentStep > step.id
                        ? "bg-blue-600 text-white"
                        : currentStep === step.id
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`ml-2 text-xs font-medium hidden sm:block ${
                    currentStep >= step.id ? "text-zinc-900" : "text-zinc-500"
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-zinc-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={(e) => { e.preventDefault(); currentStep === STEPS.length ? handleSubmit() : handleNext(); }}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
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
            )}

            {/* Step 2: Requirements */}
            {currentStep === 2 && (
              <div className="space-y-4">
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
            )}

            {/* Step 3: Business Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
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
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="space-y-4">
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
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <FormField label="Additional Notes">
                  <Textarea
                    value={formData.additionalNotes}
                    onChange={(e) => updateField("additionalNotes", e.target.value)}
                    rows={4}
                    placeholder="Any additional information..."
                  />
                </FormField>

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

                {/* Summary */}
                <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-zinc-900 mb-3">Summary</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Title:</span> {formData.title || "Not set"}</p>
                    <p><span className="font-medium">Category:</span> {formData.category.length > 0 ? formData.category.join(", ") : "Not set"}</p>
                    <p><span className="font-medium">Priority:</span> {PRIORITIES.find(p => p.value === formData.priority)?.label || "Not set"}</p>
                    <p><span className="font-medium">Budget:</span> {formData.budgetRange}</p>
                    <p><span className="font-medium">Timeline:</span> {formData.timeline}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-zinc-200 mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Previous
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              {currentStep < STEPS.length ? (
                <button
                  type="submit"
                  disabled={!validateStep(currentStep)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Listing"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

