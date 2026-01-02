"use client";

import { useState, useEffect } from "react";
import { VendorStepProps } from "./types";
import { FormField, Input } from "../questionnaire/FormField";
import { IntegrationMultiSelect } from "./IntegrationMultiSelect";

// Integration categories with icons
const INTEGRATION_CATEGORIES = [
  { id: "EHRs", label: "EHR", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )},
  { id: "Payments", label: "Payments", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )},
  { id: "Forms", label: "Forms", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { id: "Communication", label: "Communications", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )},
  { id: "Analytics", label: "Analytics", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )},
];


export const Step4Integrations = ({ formData, updateField }: VendorStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("EHRs");
  const [categoryIntegrations, setCategoryIntegrations] = useState<Record<string, string[]>>(
    formData.integrationCategories || {}
  );
  const [availableIntegrations, setAvailableIntegrations] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Initialize category integrations if not present
  useEffect(() => {
    if (!formData.integrationCategories) {
      setCategoryIntegrations({});
    } else {
      setCategoryIntegrations(formData.integrationCategories);
    }
  }, [formData.integrationCategories]);

  // Fetch integrations for selected category
  useEffect(() => {
    if (!availableIntegrations[selectedCategory] && !loading[selectedCategory]) {
      setLoading(prev => ({ ...prev, [selectedCategory]: true }));
      
      const fetchIntegrations = async () => {
        try {
          const response = await fetch(`/api/integrations?category=${selectedCategory}`);
          const result = await response.json();
          if (result.success && result.data) {
            const integrationNames = result.data.map((integration: any) => integration.name);
            setAvailableIntegrations(prev => ({ ...prev, [selectedCategory]: integrationNames }));
          } else {
            setAvailableIntegrations(prev => ({ ...prev, [selectedCategory]: [] }));
          }
        } catch (error) {
          console.error(`Error fetching integrations for ${selectedCategory}:`, error);
          setAvailableIntegrations(prev => ({ ...prev, [selectedCategory]: [] }));
        } finally {
          setLoading(prev => ({ ...prev, [selectedCategory]: false }));
        }
      };
      
      fetchIntegrations();
    }
  }, [selectedCategory, availableIntegrations, loading]);

  const handleIntegrationToggle = (category: string, integration: string) => {
    const currentIntegrations = categoryIntegrations[category] || [];
    const isSelected = currentIntegrations.includes(integration);
    
    const updated = {
      ...categoryIntegrations,
      [category]: isSelected
        ? currentIntegrations.filter(i => i !== integration)
        : [...currentIntegrations, integration],
    };
    
    setCategoryIntegrations(updated);
    updateField("integrationCategories", updated);
  };

  const currentCategoryIntegrations = categoryIntegrations[selectedCategory] || [];
  const currentAvailableIntegrations = availableIntegrations[selectedCategory] || [];

  const totalSelected = Object.values(categoryIntegrations).reduce(
    (sum, integrations) => sum + integrations.length,
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2 mb-6">
        <h3 className="text-2xl font-bold text-zinc-900">Integrations Required</h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Select integration categories and specific integrations your product supports
        </p>
      </div>

      <div className="space-y-5">
        {/* Category Tabs */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {INTEGRATION_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              const categoryCount = categoryIntegrations[category.id]?.length || 0;
              
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                    transition-all duration-200
                    ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }
                  `}
                >
                  <span className={isSelected ? "text-white" : "text-zinc-600"}>
                    {category.icon}
                  </span>
                  <span>{category.label}</span>
                  {categoryCount > 0 && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${isSelected ? "bg-blue-500 text-white" : "bg-zinc-200 text-zinc-700"}
                    `}>
                      {categoryCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Integrations for Selected Category */}
        <div className="bg-gradient-to-br from-blue-50 to-teal-50/30 rounded-xl border border-blue-200/50 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900">
                {INTEGRATION_CATEGORIES.find(c => c.id === selectedCategory)?.label} Integrations
              </h4>
              <p className="text-xs text-zinc-600">Select all that apply</p>
            </div>
          </div>
          
          {loading[selectedCategory] ? (
            <div className="text-center py-8 text-zinc-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm">Loading integrations...</p>
            </div>
          ) : currentAvailableIntegrations.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <p className="text-sm">No integrations available for this category</p>
            </div>
          ) : (
            <IntegrationMultiSelect
              options={currentAvailableIntegrations}
              selectedValues={currentCategoryIntegrations}
              onSelectionChange={(selected) => {
                const updated = {
                  ...categoryIntegrations,
                  [selectedCategory]: selected,
                };
                setCategoryIntegrations(updated);
                updateField("integrationCategories", updated);
              }}
              placeholder={`Search and select ${INTEGRATION_CATEGORIES.find(c => c.id === selectedCategory)?.label} integrations...`}
            />
          )}
        </div>

        {/* Other Integrations Field - Per Category */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50/30 rounded-xl border border-purple-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Other {INTEGRATION_CATEGORIES.find(c => c.id === selectedCategory)?.label} Integrations
              </h4>
              <p className="text-xs text-zinc-600">Add additional {INTEGRATION_CATEGORIES.find(c => c.id === selectedCategory)?.label.toLowerCase()} integrations as comma-separated tags</p>
            </div>
          </div>
          <FormField
            label=""
          >
            <Input
              type="text"
              value={formData.otherIntegrationsByCategory?.[selectedCategory] || ""}
              onChange={(e) => {
                const updated = {
                  ...(formData.otherIntegrationsByCategory || {}),
                  [selectedCategory]: e.target.value,
                };
                updateField("otherIntegrationsByCategory", updated);
              }}
              placeholder={`Enter ${INTEGRATION_CATEGORIES.find(c => c.id === selectedCategory)?.label.toLowerCase()} integration names separated by commas`}
              className="w-full"
            />
          </FormField>
          {formData.otherIntegrationsByCategory?.[selectedCategory] && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.otherIntegrationsByCategory[selectedCategory].split(",").map((tag, index) => {
                const trimmedTag = tag.trim();
                if (!trimmedTag) return null;
                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg border border-purple-200"
                  >
                    {trimmedTag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        {totalSelected > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{totalSelected}</span> integration{totalSelected !== 1 ? "s" : ""} selected across all categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
