"use client";

import { VendorStepProps } from "./types";
import { CheckboxGroup } from "../questionnaire/CheckboxGroup";
import { COMPLIANCE_OPTIONS } from "../questionnaire/constants";

export const Step5Compliance = ({ formData, updateField }: VendorStepProps) => {
  const handleComplianceChange = (value: string, checked: boolean) => {
    const current = formData.complianceCertifications || [];
    if (checked) {
      updateField("complianceCertifications", [...current, value]);
    } else {
      updateField("complianceCertifications", current.filter((item) => item !== value));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Compliance and Certifications</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Select all compliance certifications and standards your product meets or adheres to
        </p>
      </div>

      <div className="space-y-5">
        <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50/30 rounded-xl border border-teal-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900">Compliance Standards</h4>
              <p className="text-xs text-zinc-600">Select all applicable certifications</p>
            </div>
          </div>
          <CheckboxGroup
            label=""
            options={COMPLIANCE_OPTIONS}
            selectedValues={formData.complianceCertifications || []}
            onChange={handleComplianceChange}
            otherValue={formData.complianceCertificationsOther || ""}
            onOtherValueChange={(value) => updateField("complianceCertificationsOther", value)}
            columns={2}
          />
        </div>
        
        {formData.complianceCertifications && formData.complianceCertifications.length > 0 && (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-sm text-teal-800">
              <span className="font-semibold">{formData.complianceCertifications.length}</span> certification{formData.complianceCertifications.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}

        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs text-zinc-600 leading-relaxed">
                <span className="font-semibold text-zinc-700">Note:</span> This step is optional. You can skip it and add compliance information later in your vendor profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

