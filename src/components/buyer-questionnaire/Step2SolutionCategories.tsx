"use client";

import { BuyerStepProps } from "./types";
import { CheckboxGroup } from "../questionnaire/CheckboxGroup";
import { AI_SOLUTIONS_OPTIONS } from "../questionnaire/constants";

export const Step2SolutionCategories = ({ formData, updateField, errors = {}, touchedFields = new Set() }: BuyerStepProps) => {
  const getFieldError = (field: string) => {
    return touchedFields.has(field) ? errors[field] : undefined;
  };

  const handleCategoryChange = (value: string, checked: boolean) => {
    const current = formData.solutionCategories || [];
    if (checked) {
      updateField("solutionCategories", [...current, value]);
    } else {
      updateField("solutionCategories", current.filter((item) => item !== value));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Solution Categories</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Select the types of AI solutions you're looking for
        </p>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
            <h4 className="text-lg font-semibold text-zinc-900">What are you looking for?</h4>
            <p className="text-xs text-zinc-600 mt-1">Select all that apply</p>
          </div>
          <div className="p-6">
            <CheckboxGroup
              label=""
              options={AI_SOLUTIONS_OPTIONS}
              selectedValues={formData.solutionCategories || []}
              onChange={handleCategoryChange}
              otherValue={formData.solutionCategoriesOther || ""}
              onOtherValueChange={(value) => updateField("solutionCategoriesOther", value)}
              columns={2}
            />
          </div>
        </div>
        
        {formData.solutionCategories && formData.solutionCategories.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{formData.solutionCategories.length}</span> categor{formData.solutionCategories.length !== 1 ? "ies" : "y"} selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

