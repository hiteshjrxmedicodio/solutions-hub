"use client";

import { VendorStepProps } from "./types";
import { FormField, Input } from "../questionnaire/FormField";

export const Step2ContactInfo = ({ formData, updateField, updateNestedField, errors = {}, touchedFields = new Set() }: VendorStepProps) => {
  const getFieldError = (field: string) => {
    return touchedFields.has(field) ? errors[field] : undefined;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Contact Information</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Provide your contact details so we can reach out to you
        </p>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-zinc-900">Primary Contact</h4>
                <p className="text-xs text-zinc-600 mt-0.5">Main point of contact for business inquiries</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              <FormField 
                label="Name" 
                required
                error={getFieldError("primaryContact.name")}
              >
                <Input
                  type="text"
                  name="primaryContact.name"
                  data-field="primaryContact.name"
                  value={formData.primaryContact.name}
                  onChange={(e) => updateNestedField("primaryContact", "name", e.target.value)}
                  placeholder="Full name"
                  required
                  error={!!getFieldError("primaryContact.name")}
                />
              </FormField>

              <FormField 
                label="Title" 
                required
                error={getFieldError("primaryContact.title")}
              >
                <Input
                  type="text"
                  name="primaryContact.title"
                  data-field="primaryContact.title"
                  value={formData.primaryContact.title}
                  onChange={(e) => updateNestedField("primaryContact", "title", e.target.value)}
                  placeholder="e.g., CEO, Sales Director"
                  required
                  error={!!getFieldError("primaryContact.title")}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-start">
              <FormField 
                label="Email" 
                required
                error={getFieldError("primaryContact.email")}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Input
                    type="email"
                    name="primaryContact.email"
                    data-field="primaryContact.email"
                    value={formData.primaryContact.email}
                    onChange={(e) => updateNestedField("primaryContact", "email", e.target.value)}
                    placeholder="contact@example.com"
                    required
                    error={!!getFieldError("primaryContact.email")}
                    className="pl-12"
                  />
                </div>
              </FormField>

              <FormField 
                label="Phone" 
                required
                error={getFieldError("primaryContact.phone")}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <Input
                    type="tel"
                    name="primaryContact.phone"
                    data-field="primaryContact.phone"
                    value={formData.primaryContact.phone}
                    onChange={(e) => updateNestedField("primaryContact", "phone", e.target.value)}
                    placeholder="+1 (555) 000-0000 (include country code if international)"
                    required
                    error={!!getFieldError("primaryContact.phone")}
                    className="pl-12"
                  />
                </div>
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

