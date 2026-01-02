"use client";

import { BuyerStepProps } from "./types";
import { FormField, Input } from "../questionnaire/FormField";
import { INSTITUTION_TYPES, US_STATES, COUNTRIES } from "../questionnaire/constants";
import { Dropdown } from "@/components/ui/Dropdown";

export const Step1InstitutionDetails = ({ formData, updateField, updateNestedField, errors = {}, touchedFields = new Set() }: BuyerStepProps) => {
  const getFieldError = (field: string) => {
    return touchedFields.has(field) ? errors[field] : undefined;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Institution Details</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Tell us about your healthcare institution
        </p>
      </div>

      <div className="space-y-5">
        <FormField 
          label="Institution Name" 
          required
          error={getFieldError("institutionName")}
        >
          <Input
            type="text"
            name="institutionName"
            data-field="institutionName"
            value={formData.institutionName}
            onChange={(e) => updateField("institutionName", e.target.value)}
            placeholder="Enter your institution's legal or trading name"
            required
            error={!!getFieldError("institutionName")}
            className="w-full"
          />
        </FormField>

        <FormField 
          label="Institution Type" 
          required
          error={getFieldError("institutionType") || getFieldError("institutionTypeOther")}
        >
          <Dropdown
            name="institutionType"
            data-field="institutionType"
            value={formData.institutionType}
            onChange={(value) => {
              if (value === "Other") {
                updateField("institutionType", "Other");
              } else {
                updateField("institutionType", value);
                updateField("institutionTypeOther", "");
              }
            }}
            options={INSTITUTION_TYPES}
            placeholder="Select institution type"
            required
            error={!!getFieldError("institutionType")}
            searchable={false}
          />
        </FormField>
        
        {formData.institutionType === "Other" && (
          <FormField 
            label="Institution Type (Other)"
            error={getFieldError("institutionTypeOther")}
          >
            <Input
              type="text"
              name="institutionTypeOther"
              data-field="institutionTypeOther"
              value={formData.institutionTypeOther || ""}
              onChange={(e) => updateField("institutionTypeOther", e.target.value)}
              placeholder="Please specify your institution type"
              error={!!getFieldError("institutionTypeOther")}
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
      </div>
    </div>
  );
};

