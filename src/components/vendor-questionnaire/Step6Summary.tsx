"use client";

import { VendorStepProps } from "./types";
import { US_STATES, COUNTRIES } from "../questionnaire/constants";

export const Step6Summary = ({ formData }: VendorStepProps) => {
  const getStateName = (stateCode: string) => {
    const state = US_STATES.find(s => s === stateCode || (typeof s === 'object' && s.value === stateCode));
    return typeof state === 'string' ? state : state?.label || stateCode;
  };

  const getCountryName = (countryCode: string) => {
    const country = COUNTRIES.find(c => c === countryCode || (typeof c === 'object' && c.value === countryCode));
    return typeof country === 'string' ? country : country?.label || countryCode;
  };

  const getCompanyType = () => {
    if (formData.companyType === "Other") {
      return formData.companyTypeOther || formData.companyType;
    }
    return formData.companyType;
  };

  const getLocation = () => {
    const state = getStateName(formData.location.state);
    const country = formData.location.country === "Other" 
      ? (formData.location.countryOther || formData.location.country)
      : getCountryName(formData.location.country);
    return `${state}, ${country}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Review Your Information</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Please review all the information you've provided. You can go back to make changes if needed.
        </p>
      </div>

      <div className="space-y-5">
        {/* Company Overview */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
            <h4 className="text-lg font-semibold text-zinc-900">Company Overview</h4>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Company Name</p>
                <p className="text-sm text-zinc-900 font-medium">{formData.companyName || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Company Type</p>
                <p className="text-sm text-zinc-900 font-medium">{getCompanyType() || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Location</p>
                <p className="text-sm text-zinc-900 font-medium">{getLocation() || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Website</p>
                <p className="text-sm text-zinc-900 font-medium">{formData.website || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
            <h4 className="text-lg font-semibold text-zinc-900">
              Product Information
              {formData.products && formData.products.length > 0 && (
                <span className="ml-2 text-sm font-normal text-zinc-500">
                  ({formData.products.length} {formData.products.length === 1 ? "product" : "products"})
                </span>
              )}
            </h4>
          </div>
          <div className="p-6 space-y-6">
            {formData.products && formData.products.length > 0 ? (
              formData.products.map((product, index) => (
                <div key={index} className={index > 0 ? "pt-6 border-t border-zinc-100" : ""}>
                  <div className="mb-4">
                    <p className="text-xs font-medium text-zinc-500 mb-1">Product {index + 1}</p>
                    <p className="text-sm font-semibold text-zinc-900">{product.name || "—"}</p>
                  </div>
                  {product.url && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-zinc-500 mb-1.5">Product URL</p>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                      >
                        {product.url}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1.5">Product Overview</p>
                    <p className="text-sm text-zinc-900 leading-relaxed whitespace-pre-wrap">{product.overview || "—"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No products added</p>
            )}
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
            <h4 className="text-lg font-semibold text-zinc-900">Integrations Required</h4>
          </div>
          <div className="p-6 space-y-4">
            {formData.integrationCategories && Object.keys(formData.integrationCategories).length > 0 ? (
              Object.entries(formData.integrationCategories).map(([category, integrations]) => {
                if (!Array.isArray(integrations) || integrations.length === 0) return null;
                const categoryLabels: Record<string, string> = {
                  EHRs: "EHR",
                  Payments: "Payments",
                  Forms: "Forms",
                  Communication: "Communications",
                  Analytics: "Analytics"
                };
                return (
                  <div key={category} className="space-y-2">
                    <p className="text-xs font-medium text-zinc-500">{categoryLabels[category] || category} Integrations</p>
                    <div className="flex flex-wrap gap-2">
                      {integrations.map((integration) => (
                        <span
                          key={integration}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200"
                        >
                          {integration}
                        </span>
                      ))}
                    </div>
                    {formData.otherIntegrationsByCategory?.[category] && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-zinc-500 mb-2">Other {categoryLabels[category] || category} Integrations</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.otherIntegrationsByCategory[category].split(",").map((tag, index) => {
                            const trimmedTag = tag.trim();
                            if (!trimmedTag) return null;
                            return (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200"
                              >
                                {trimmedTag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : formData.integrationsRequired && formData.integrationsRequired.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.integrationsRequired.map((integration) => (
                  <span
                    key={integration}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No integrations selected</p>
            )}
            {formData.otherIntegrations && (
              <div className="pt-2 border-t border-zinc-100">
                <p className="text-xs font-medium text-zinc-500 mb-2">Other Integrations</p>
                <div className="flex flex-wrap gap-2">
                  {formData.otherIntegrations.split(",").map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200"
                      >
                        {trimmedTag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
            <h4 className="text-lg font-semibold text-zinc-900">Contact Information</h4>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Contact Name</p>
                <p className="text-sm text-zinc-900 font-medium">{formData.primaryContact.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Title</p>
                <p className="text-sm text-zinc-900 font-medium">{formData.primaryContact.title || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Email</p>
                <p className="text-sm text-zinc-900 font-medium">{formData.primaryContact.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1.5">Phone</p>
                <p className="text-sm text-zinc-900 font-medium">{formData.primaryContact.phone || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
            <h4 className="text-lg font-semibold text-zinc-900">Compliance and Certifications</h4>
          </div>
          <div className="p-6">
            {formData.complianceCertifications && formData.complianceCertifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.complianceCertifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg border border-teal-200"
                  >
                    {cert}
                  </span>
                ))}
                {formData.complianceCertificationsOther && (
                  <span className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg border border-teal-200">
                    {formData.complianceCertificationsOther}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No certifications selected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

