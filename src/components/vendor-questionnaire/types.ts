export interface VendorQuestionnaireData {
  // Section 1: Company Overview
  companyName: string;
  companyType: string;
  companyTypeOther?: string;
  location: {
    state: string;
    country: string;
    countryOther?: string;
  };
  website: string;

  // Section 2: Contact Information
  address?: string; // Optional - can be filled in profile page
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };

  // Section 3: Product Information
  products: Array<{
    name: string;
    overview: string;
    url?: string; // Optional product URL
  }>;

  // Section 4: Integrations Required
  integrationsRequired: string[];
  integrationsRequiredOther?: string;
  otherIntegrations?: string; // Legacy field - kept for backward compatibility
  integrationCategories?: Record<string, string[]>; // Category -> integrations mapping
  otherIntegrationsByCategory?: Record<string, string>; // Category -> other integrations (comma-separated tags)

  // Section 5: Compliance and Certifications
  complianceCertifications: string[];
  complianceCertificationsOther?: string;
}

export interface VendorStepProps {
  formData: VendorQuestionnaireData;
  updateField: (field: keyof VendorQuestionnaireData, value: any) => void;
  updateNestedField: (field: string, nestedField: string, value: any) => void;
  errors?: Record<string, string>;
  touchedFields?: Set<string>;
}

