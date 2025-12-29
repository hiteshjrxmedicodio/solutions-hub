"use client";

import { ProductDescriptionSection } from "./ProductDescriptionSection";
import { SpecialtiesSection } from "./SpecialtiesSection";
import { IntegrationsSection } from "./IntegrationsSection";
import { PricingSection } from "./PricingSection";
import { CompanyOverviewSection } from "./CompanyOverviewSection";
import { ComplianceSection } from "./ComplianceSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { EditableSection } from "./EditableSection";

interface EnhancedOverviewTabContentProps {
  // Company Overview
  companyName: string;
  companyType?: string;
  website?: string;
  foundedYear?: number;
  location?: {
    state: string;
    country: string;
  };
  companySize?: string;
  missionStatement?: string;
  headquarters?: string;
  
  // Product Description
  productDescription?: string;
  solutionDescription?: string;
  
  // Specialties
  targetSpecialties?: string[];
  specialtiesPerformance?: Array<{
    specialty: string;
    performanceData: string;
  }>;
  
  // Integrations
  integrations?: Array<{
    name: string;
    logoUrl?: string;
    apiCompatible?: boolean;
    workflowTools?: string[];
  }>;
  
  // Pricing
  pricingModel?: string;
  pricingRange?: string;
  pricingPlans?: Array<{
    tierName: string;
    price: string;
    features: string[];
    contractTerms?: string[];
  }>;
  freemiumOptions?: string;
  roiCalculator?: string;
  
  // Testimonials
  customerTestimonials?: Array<{
    customerName: string;
    customerTitle?: string;
    customerLogo?: string;
    testimonial: string;
    metrics?: string;
    verified?: boolean;
  }>;
  
  // Compliance
  complianceCertifications?: string[];
  certificationDocuments?: Array<{
    certification: string;
    documentUrl?: string;
    logoUrl?: string;
    issuedDate?: Date;
    expiryDate?: Date;
  }>;
  
  // Editing
  isEditable?: boolean;
  vendorUserId?: string;
  onUpdate?: (section: string, data: any) => Promise<void>;
}

export function EnhancedOverviewTabContent({
  companyName,
  companyType,
  website,
  foundedYear,
  location,
  companySize,
  missionStatement,
  headquarters,
  productDescription,
  solutionDescription,
  targetSpecialties,
  specialtiesPerformance,
  integrations,
  pricingModel,
  pricingRange,
  pricingPlans,
  freemiumOptions,
  roiCalculator,
  customerTestimonials,
  complianceCertifications,
  certificationDocuments,
  isEditable = false,
  vendorUserId,
  onUpdate,
}: EnhancedOverviewTabContentProps) {
  return (
    <div className="space-y-6">
      {/* Company Overview - Now in main content */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
        <EditableSection
          title="Company Overview"
          isEditable={isEditable}
          sectionKey="companyOverview"
          initialData={{
            companyName,
            companyType,
            website,
            foundedYear,
            location,
            companySize,
            missionStatement,
            headquarters,
          }}
          onSave={onUpdate ? async (data) => {
            await onUpdate("companyOverview", data);
          } : undefined}
        >
          <CompanyOverviewSection 
            companyName={companyName}
            companyType={companyType}
            website={website}
            foundedYear={foundedYear}
            location={location}
            companySize={companySize}
            missionStatement={missionStatement}
            headquarters={headquarters}
          />
        </EditableSection>
      </div>

      {/* Product Description */}
      {(productDescription || solutionDescription) && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <EditableSection
            title="Product Description"
            isEditable={isEditable}
            sectionKey="productDescription"
            initialData={{ productDescription, solutionDescription }}
            onSave={onUpdate ? (data) => onUpdate("productDescription", data) : undefined}
          >
            <ProductDescriptionSection 
              productDescription={productDescription}
              solutionDescription={solutionDescription}
            />
          </EditableSection>
        </div>
      )}

      {/* Specialties Covered */}
      {targetSpecialties && targetSpecialties.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <EditableSection
            title="Specialties"
            isEditable={isEditable}
            sectionKey="specialties"
            initialData={{ targetSpecialties, specialtiesPerformance }}
            onSave={onUpdate ? (data) => onUpdate("specialties", data) : undefined}
          >
            <SpecialtiesSection 
              specialties={targetSpecialties}
              specialtiesPerformance={specialtiesPerformance}
            />
          </EditableSection>
        </div>
      )}

      {/* Integrations */}
      {integrations && integrations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <EditableSection
            title="Integrations"
            isEditable={isEditable}
            sectionKey="integrations"
            initialData={{ integrations }}
            onSave={onUpdate ? (data) => onUpdate("integrations", data) : undefined}
          >
            <IntegrationsSection integrations={integrations} />
          </EditableSection>
        </div>
      )}

      {/* Pricing & Plans */}
      {(pricingModel || pricingPlans || freemiumOptions) && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <EditableSection
            title="Pricing"
            isEditable={isEditable}
            sectionKey="pricing"
            initialData={{ pricingModel, pricingRange, pricingPlans, freemiumOptions, roiCalculator }}
            onSave={onUpdate ? (data) => onUpdate("pricing", data) : undefined}
          >
            <PricingSection 
              pricingModel={pricingModel}
              pricingRange={pricingRange}
              pricingPlans={pricingPlans}
              freemiumOptions={freemiumOptions}
              roiCalculator={roiCalculator}
            />
          </EditableSection>
        </div>
      )}

      {/* Compliance & Certifications - Now in main content */}
      {(complianceCertifications || certificationDocuments) && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <EditableSection
            title="Compliance & Certifications"
            isEditable={isEditable}
            sectionKey="compliance"
            initialData={{ complianceCertifications, certificationDocuments }}
            onSave={onUpdate ? (data) => onUpdate("compliance", data) : undefined}
          >
            <ComplianceSection 
              complianceCertifications={complianceCertifications}
              certificationDocuments={certificationDocuments}
            />
          </EditableSection>
        </div>
      )}

      {/* Customer Testimonials - Now in main content */}
      {customerTestimonials && customerTestimonials.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <EditableSection
            title="Customer Testimonials"
            isEditable={isEditable}
            sectionKey="testimonials"
            initialData={{ customerTestimonials }}
            onSave={onUpdate ? (data) => onUpdate("testimonials", data) : undefined}
          >
            <TestimonialsSection testimonials={customerTestimonials} />
          </EditableSection>
        </div>
      )}
    </div>
  );
}

