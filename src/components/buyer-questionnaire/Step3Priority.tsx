"use client";

import { BuyerStepProps } from "./types";
import { FormField } from "../questionnaire/FormField";
import { Dropdown } from "@/components/ui/Dropdown";

const PRIORITY_OPTIONS = [
  "High - Need solution urgently",
  "Medium - Looking to implement within 3-6 months",
  "Low - Exploring options for future",
  "Not sure yet"
];

export const Step3Priority = ({ formData, updateField, errors = {}, touchedFields = new Set() }: BuyerStepProps) => {
  const getFieldError = (field: string) => {
    return touchedFields.has(field) ? errors[field] : undefined;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Solution Priority</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          How urgent is your need for a solution?
        </p>
      </div>

      <div className="space-y-5">
        <FormField 
          label="Priority Level" 
          required
          error={getFieldError("priority")}
        >
          <Dropdown
            name="priority"
            data-field="priority"
            value={formData.priority}
            onChange={(value) => updateField("priority", value)}
            options={PRIORITY_OPTIONS}
            placeholder="Select priority level"
            required
            error={!!getFieldError("priority")}
            searchable={false}
          />
        </FormField>
      </div>
    </div>
  );
};

