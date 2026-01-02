"use client";

import { useState, useEffect } from "react";
import { FormField, Input } from "@/components/questionnaire/FormField";
import { Dropdown } from "@/components/ui/Dropdown";
import { INSTITUTION_TYPES, US_STATES, COUNTRIES } from "@/components/questionnaire/constants";
import { CheckboxGroup } from "@/components/questionnaire/CheckboxGroup";
import { AI_SOLUTIONS_OPTIONS } from "@/components/questionnaire/constants";

interface CustomerData {
  institutionName: string;
  institutionType: string;
  institutionTypeOther?: string;
  location: {
    state: string;
    country: string;
    countryOther?: string;
  };
  solutionCategories: string[];
  solutionCategoriesOther?: string;
  priority: string;
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
}

interface CustomerQuestionnaireProps {
  initialData?: Partial<CustomerData>;
  onSave: (data: CustomerData) => Promise<void>;
  onCancel: () => void;
}

const PRIORITY_OPTIONS = [
  "High - Need solution urgently",
  "Medium - Looking to implement within 3-6 months",
  "Low - Exploring options for future",
  "Not sure yet"
];

export function CustomerQuestionnaire({ initialData, onSave, onCancel }: CustomerQuestionnaireProps) {
  const [formData, setFormData] = useState<CustomerData>({
    institutionName: initialData?.institutionName || "",
    institutionType: initialData?.institutionType || "",
    location: {
      state: initialData?.location?.state || "",
      country: initialData?.location?.country || "",
    },
    solutionCategories: initialData?.selectedAISolutions || [],
    priority: initialData?.priority || "",
    primaryContact: {
      name: initialData?.primaryContact?.name || "",
      title: initialData?.primaryContact?.title || "",
      email: initialData?.primaryContact?.email || "",
      phone: initialData?.primaryContact?.phone || "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.institutionName.trim()) {
      newErrors.institutionName = "Institution name is required";
    }
    if (!formData.institutionType) {
      newErrors.institutionType = "Institution type is required";
    }
    if (formData.institutionType === "Other" && !formData.institutionTypeOther?.trim()) {
      newErrors.institutionTypeOther = "Please specify institution type";
    }
    if (!formData.location.state) {
      newErrors["location.state"] = "State is required";
    }
    if (!formData.location.country) {
      newErrors["location.country"] = "Country is required";
    }
    if (formData.location.country === "Other" && !formData.location.countryOther?.trim()) {
      newErrors["location.countryOther"] = "Please specify country";
    }
    if (!formData.primaryContact.name.trim()) {
      newErrors["primaryContact.name"] = "Contact name is required";
    }
    if (!formData.primaryContact.title.trim()) {
      newErrors["primaryContact.title"] = "Contact title is required";
    }
    if (!formData.primaryContact.email.trim()) {
      newErrors["primaryContact.email"] = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContact.email)) {
      newErrors["primaryContact.email"] = "Please enter a valid email address";
    }
    if (!formData.primaryContact.phone.trim()) {
      newErrors["primaryContact.phone"] = "Phone number is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error("Error saving customer profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Edit Institution Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institution Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900">Institution Details</h3>
          
          <FormField 
            label="Institution Name" 
            required
            error={errors.institutionName}
          >
            <Input
              type="text"
              value={formData.institutionName}
              onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
              placeholder="e.g., General Hospital"
              required
              error={!!errors.institutionName}
            />
          </FormField>

          <FormField 
            label="Institution Type" 
            required
            error={errors.institutionType || errors.institutionTypeOther}
          >
            <Dropdown
              value={formData.institutionType}
              onChange={(value) => {
                setFormData({
                  ...formData,
                  institutionType: value,
                  institutionTypeOther: value === "Other" ? formData.institutionTypeOther : "",
                });
              }}
              options={INSTITUTION_TYPES}
              placeholder="Select institution type"
              required
              error={!!errors.institutionType}
              searchable={false}
            />
          </FormField>
          
          {formData.institutionType === "Other" && (
            <FormField 
              label="Institution Type (Other)"
              error={errors.institutionTypeOther}
            >
              <Input
                type="text"
                value={formData.institutionTypeOther || ""}
                onChange={(e) => setFormData({ ...formData, institutionTypeOther: e.target.value })}
                placeholder="Please specify"
                error={!!errors.institutionTypeOther}
              />
            </FormField>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField 
              label="State" 
              required
              error={errors["location.state"]}
            >
              <Dropdown
                value={formData.location.state}
                onChange={(value) => setFormData({
                  ...formData,
                  location: { ...formData.location, state: value }
                })}
                options={US_STATES}
                placeholder="Select state"
                required
                error={!!errors["location.state"]}
                searchable={true}
              />
            </FormField>

            <FormField 
              label="Country" 
              required
              error={errors["location.country"] || errors["location.countryOther"]}
            >
              <Dropdown
                value={formData.location.country}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      country: value,
                      countryOther: value === "Other" ? formData.location.countryOther : "",
                    }
                  });
                }}
                options={COUNTRIES}
                placeholder="Select country"
                required
                error={!!errors["location.country"]}
                searchable={true}
              />
            </FormField>
          </div>
          
          {formData.location.country === "Other" && (
            <FormField 
              label="Country (Other)"
              error={errors["location.countryOther"]}
            >
              <Input
                type="text"
                value={formData.location.countryOther || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, countryOther: e.target.value }
                })}
                placeholder="Please specify"
                error={!!errors["location.countryOther"]}
              />
            </FormField>
          )}
        </div>

        {/* Solution Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900">Solution Categories</h3>
          <CheckboxGroup
            label=""
            options={AI_SOLUTIONS_OPTIONS}
            selectedValues={formData.solutionCategories}
            onChange={(value, checked) => {
              const current = formData.solutionCategories || [];
              if (checked) {
                setFormData({ ...formData, solutionCategories: [...current, value] });
              } else {
                setFormData({ ...formData, solutionCategories: current.filter(item => item !== value) });
              }
            }}
            otherValue={formData.solutionCategoriesOther || ""}
            onOtherValueChange={(value) => setFormData({ ...formData, solutionCategoriesOther: value })}
            columns={2}
          />
        </div>

        {/* Priority */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900">Solution Priority</h3>
          <FormField 
            label="Priority Level" 
            required
            error={errors.priority}
          >
            <Dropdown
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
              options={PRIORITY_OPTIONS}
              placeholder="Select priority level"
              required
              error={!!errors.priority}
              searchable={false}
            />
          </FormField>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900">Contact Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField 
              label="Contact Name" 
              required
              error={errors["primaryContact.name"]}
            >
              <Input
                type="text"
                value={formData.primaryContact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  primaryContact: { ...formData.primaryContact, name: e.target.value }
                })}
                placeholder="Full name"
                required
                error={!!errors["primaryContact.name"]}
              />
            </FormField>

            <FormField 
              label="Title" 
              required
              error={errors["primaryContact.title"]}
            >
              <Input
                type="text"
                value={formData.primaryContact.title}
                onChange={(e) => setFormData({
                  ...formData,
                  primaryContact: { ...formData.primaryContact, title: e.target.value }
                })}
                placeholder="Job title"
                required
                error={!!errors["primaryContact.title"]}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField 
              label="Email" 
              required
              error={errors["primaryContact.email"]}
            >
              <Input
                type="email"
                value={formData.primaryContact.email}
                onChange={(e) => setFormData({
                  ...formData,
                  primaryContact: { ...formData.primaryContact, email: e.target.value }
                })}
                placeholder="contact@example.com"
                required
                error={!!errors["primaryContact.email"]}
              />
            </FormField>

            <FormField 
              label="Phone" 
              required
              error={errors["primaryContact.phone"]}
            >
              <Input
                type="tel"
                value={formData.primaryContact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  primaryContact: { ...formData.primaryContact, phone: e.target.value }
                })}
                placeholder="+1 (555) 000-0000"
                required
                error={!!errors["primaryContact.phone"]}
              />
            </FormField>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

