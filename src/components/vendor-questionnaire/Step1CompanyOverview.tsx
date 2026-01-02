"use client";

import { VendorStepProps } from "./types";
import { FormField, Input } from "../questionnaire/FormField";
import { US_STATES, COUNTRIES } from "../questionnaire/constants";
import { Dropdown } from "@/components/ui/Dropdown";

const COMPANY_TYPES = ["Startup", "SME", "Enterprise", "Other"];

export const Step1CompanyOverview = ({ formData, updateField, updateNestedField, errors = {}, touchedFields = new Set() }: VendorStepProps) => {
  const getFieldError = (field: string) => {
    return touchedFields.has(field) ? errors[field] : undefined;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Company Overview</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Provide basic information about your company to get started
        </p>
      </div>

      <div className="space-y-5">
        <FormField 
          label="Company Name" 
          required
          error={getFieldError("companyName")}
        >
          <Input
            type="text"
            name="companyName"
            data-field="companyName"
            value={formData.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="Enter your company's legal or trading name"
            required
            error={!!getFieldError("companyName")}
            className="w-full"
          />
        </FormField>

        <FormField 
          label="Company Type" 
          required
          error={getFieldError("companyType") || getFieldError("companyTypeOther")}
        >
          <Dropdown
            name="companyType"
            data-field="companyType"
            value={formData.companyType}
            onChange={(value) => {
              if (value === "Other") {
                updateField("companyType", "Other");
              } else {
                updateField("companyType", value);
                updateField("companyTypeOther", "");
              }
            }}
            options={COMPANY_TYPES}
            placeholder="Select company type"
            required
            error={!!getFieldError("companyType")}
            searchable={false}
          />
        </FormField>
        
        {formData.companyType === "Other" && (
          <FormField 
            label="Company Type (Other)"
            error={getFieldError("companyTypeOther")}
          >
            <Input
              type="text"
              name="companyTypeOther"
              data-field="companyTypeOther"
              value={formData.companyTypeOther || ""}
              onChange={(e) => updateField("companyTypeOther", e.target.value)}
              placeholder="Please specify your company type"
              error={!!getFieldError("companyTypeOther")}
            />
          </FormField>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField 
            label="State" 
            required
            error={getFieldError("location.state")}
          >
            <Dropdown
              name="location.state"
              data-field="location.state"
              value={formData.location.state}
              onChange={(value) => updateNestedField("location", "state", value)}
              options={US_STATES}
              placeholder="Select state"
              required
              error={!!getFieldError("location.state")}
              searchable={true}
            />
          </FormField>

          <FormField 
            label="Country" 
            required
            error={getFieldError("location.country") || getFieldError("location.countryOther")}
          >
            <Dropdown
              name="location.country"
              data-field="location.country"
              value={formData.location.country}
              onChange={(value) => {
                if (value === "Other") {
                  updateNestedField("location", "country", "Other");
                } else {
                  updateNestedField("location", "country", value);
                  updateNestedField("location", "countryOther", "");
                }
              }}
              options={COUNTRIES}
              placeholder="Select country"
              required
              error={!!getFieldError("location.country")}
              searchable={true}
            />
          </FormField>
        </div>
        
        {formData.location.country === "Other" && (
          <FormField 
            label="Country (Other)"
            error={getFieldError("location.countryOther")}
          >
            <Input
              type="text"
              name="location.countryOther"
              data-field="location.countryOther"
              value={formData.location.countryOther || ""}
              onChange={(e) => updateNestedField("location", "countryOther", e.target.value)}
              placeholder="Please specify your country"
              error={!!getFieldError("location.countryOther")}
            />
          </FormField>
        )}

        <FormField 
          label="Website" 
          required
          error={getFieldError("website")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <Input
              type="url"
              name="website"
              data-field="website"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://example.com (include https:// or http://)"
              required
              error={!!getFieldError("website")}
              className="pl-12"
            />
          </div>
        </FormField>
      </div>
    </div>
  );
};

