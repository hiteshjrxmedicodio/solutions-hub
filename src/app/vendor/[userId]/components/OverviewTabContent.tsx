"use client";

import { useState } from "react";
import { ProductDescriptionSection } from "./ProductDescriptionSection";
import { SpecialtiesSection } from "./SpecialtiesSection";
import { IntegrationsSection } from "./IntegrationsSection";
import { KeyMetricsSection } from "./KeyMetricsSection";
import { PrerequisitesSection } from "./PrerequisitesSection";
import { HowWeHelpSection } from "./HowWeHelpSection";

interface Integration {
  name: string;
  logoUrl?: string;
  apiCompatible?: boolean;
  workflowTools?: string[];
}

interface OverviewTabContentProps {
  // Product Description
  productDescription?: string;
  solutionDescription?: string;
  
  // Specialties
  targetSpecialties?: string[];
  specialtiesPerformance?: Array<{
    specialty: string;
    performanceData: string;
  }>;
  
  // Key Metrics
  keyMetrics?: {
    codingAccuracy?: string;
    firstPassRate?: string;
    throughputGains?: string;
    costSavings?: string;
    [key: string]: string | undefined;
  };
  
  // Prerequisites
  deploymentOptions?: string[];
  integrationCapabilities?: string[];
  targetInstitutionTypes?: string[];
  technologyStack?: string[];
  
  // Integrations
  integrations?: Integration[];
  
  // Enabled subsections
  enabledSubSections?: string[];
  
  // Editing
  isEditable?: boolean;
  onSave?: (field: string, value: any) => Promise<void>;
}

// Helper component for How We Help with header
function HowWeHelpSectionWithHeader({
  solutionDescription,
  isEditable,
  onSave,
}: {
  solutionDescription?: string;
  isEditable?: boolean;
  onSave?: (field: string, value: any) => Promise<void>;
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900">How We Help Customers</h2>
        {isEditable && (
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors"
            title={isEditMode ? "Cancel editing" : "Edit"}
          >
            <svg className={`w-5 h-5 ${isEditMode ? 'text-green-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isEditMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              )}
            </svg>
          </button>
        )}
      </div>
      <HowWeHelpSection 
        solutionDescription={solutionDescription}
        isEditable={isEditable}
        onSave={onSave}
        isEditMode={isEditMode}
        onEditModeChange={setIsEditMode}
      />
    </div>
  );
}

export function OverviewTabContent({
  productDescription,
  solutionDescription,
  targetSpecialties,
  specialtiesPerformance,
  keyMetrics,
  deploymentOptions,
  integrationCapabilities,
  targetInstitutionTypes,
  technologyStack,
  integrations,
  enabledSubSections = [],
  isEditable = false,
  onSave,
}: OverviewTabContentProps) {
  const isSubSectionEnabled = (subSectionId: string) => {
    return enabledSubSections.includes(`overview.${subSectionId}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Product Description */}
      {isSubSectionEnabled("product-description") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <ProductDescriptionSection 
            productDescription={productDescription}
            solutionDescription={solutionDescription}
            isEditable={isEditable}
            onSave={onSave}
          />
        </div>
      )}

      {/* 2. How We Help Customers */}
      {isSubSectionEnabled("how-we-help") && (
        <HowWeHelpSectionWithHeader
          solutionDescription={solutionDescription}
          isEditable={isEditable}
          onSave={onSave}
        />
      )}

      {/* 3. Key Metrics */}
      {isSubSectionEnabled("key-metrics") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <KeyMetricsSection 
            keyMetrics={keyMetrics}
            isEditable={isEditable}
            onSave={onSave}
          />
        </div>
      )}

      {/* 4. Prerequisites */}
      {isSubSectionEnabled("prerequisites") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">Prerequisites</h2>
            {isEditable && (
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            )}
          </div>
          <PrerequisitesSection
            deploymentOptions={deploymentOptions}
            integrationCapabilities={integrationCapabilities}
            targetInstitutionTypes={targetInstitutionTypes}
            technologyStack={technologyStack}
          />
        </div>
      )}

      {/* 5. Specialties Covered */}
      {isSubSectionEnabled("specialties") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <SpecialtiesSection 
            specialties={targetSpecialties || []}
            specialtiesPerformance={specialtiesPerformance}
          />
        </div>
      )}

      {/* 6. Integrations Required */}
      {isSubSectionEnabled("integrations") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900">Integrations Required</h2>
            {isEditable && (
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            )}
          </div>
          <IntegrationsSection integrations={integrations || []} showTitle={false} />
        </div>
      )}
    </div>
  );
}
