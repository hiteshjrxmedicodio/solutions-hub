import { VendorQuestionnaireData } from "../types";

export function getInitialFormData(): VendorQuestionnaireData {
  return {
    companyName: "",
    companyType: "",
    location: {
      state: "",
      country: "",
    },
    website: "",
    primaryContact: {
      name: "",
      title: "",
      email: "",
      phone: "",
    },
    products: [],
    integrationsRequired: [],
    otherIntegrations: "",
    integrationCategories: {},
    otherIntegrationsByCategory: {},
    complianceCertifications: [],
  };
}

export function mergeInitialData(
  current: VendorQuestionnaireData,
  initialData: Partial<VendorQuestionnaireData>
): VendorQuestionnaireData {
  const updated = { ...current };
  
  // Step 1: Company Overview
  if (initialData.companyName !== undefined) updated.companyName = initialData.companyName || "";
  if (initialData.companyType !== undefined) {
    updated.companyType = initialData.companyType || "";
    if (initialData.companyTypeOther !== undefined) {
      updated.companyTypeOther = initialData.companyTypeOther;
    }
  }
  if (initialData.location) {
    if (initialData.location.state !== undefined) updated.location.state = initialData.location.state || "";
    if (initialData.location.country !== undefined) {
      updated.location.country = initialData.location.country || "";
      if (initialData.location.countryOther !== undefined) {
        updated.location.countryOther = initialData.location.countryOther;
      }
    }
  }
  if (initialData.website !== undefined) updated.website = initialData.website || "";
  if (initialData.address !== undefined) updated.address = initialData.address;
  
  // Step 2: Product Information
  if (initialData.products && Array.isArray(initialData.products)) {
    updated.products = initialData.products.map((product: any) => ({
      name: product.name || "",
      overview: product.overview || "",
      url: product.url || ""
    }));
  }
  
  // Step 3: Integrations
  if (initialData.integrationCategories) {
    updated.integrationCategories = { ...(updated.integrationCategories || {}), ...initialData.integrationCategories };
  }
  if (initialData.otherIntegrationsByCategory) {
    updated.otherIntegrationsByCategory = { ...(updated.otherIntegrationsByCategory || {}), ...initialData.otherIntegrationsByCategory };
  }
  if (initialData.otherIntegrations !== undefined) {
    updated.otherIntegrations = initialData.otherIntegrations || "";
  }
  
  // Step 4: Contact Information
  if (initialData.primaryContact) {
    if (initialData.primaryContact.name !== undefined) updated.primaryContact.name = initialData.primaryContact.name || "";
    if (initialData.primaryContact.title !== undefined) updated.primaryContact.title = initialData.primaryContact.title || "";
    if (initialData.primaryContact.email !== undefined) updated.primaryContact.email = initialData.primaryContact.email || "";
    if (initialData.primaryContact.phone !== undefined) updated.primaryContact.phone = initialData.primaryContact.phone || "";
  }
  
  // Step 5: Compliance
  if (initialData.complianceCertifications && Array.isArray(initialData.complianceCertifications)) {
    updated.complianceCertifications = initialData.complianceCertifications;
  }
  if (initialData.complianceCertificationsOther !== undefined) {
    updated.complianceCertificationsOther = initialData.complianceCertificationsOther;
  }
  
  return updated;
}

