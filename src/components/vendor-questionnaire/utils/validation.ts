import { VendorQuestionnaireData } from "../types";

export function validateStep(step: number, formData: VendorQuestionnaireData): { isValid: boolean; errors: Record<string, string> } {
  const stepErrors: Record<string, string> = {};

  switch (step) {
    case 1:
      if (!formData.companyName?.trim()) {
        stepErrors.companyName = "Company name is required";
      }
      if (!formData.companyType) {
        stepErrors.companyType = "Company type is required";
      }
      if (formData.companyType === "Other" && !formData.companyTypeOther?.trim()) {
        stepErrors.companyTypeOther = "Please specify company type";
      }
      if (!formData.location.state) {
        stepErrors["location.state"] = "State is required";
      }
      if (!formData.location.country) {
        stepErrors["location.country"] = "Country is required";
      }
      if (formData.location.country === "Other" && !formData.location.countryOther?.trim()) {
        stepErrors["location.countryOther"] = "Please specify country";
      }
      if (!formData.website?.trim()) {
        stepErrors.website = "Website is required";
      } else {
        const website = formData.website.trim();
        const simplePattern = /.+\..+/; // At least one dot (basic domain check)
        if (!simplePattern.test(website)) {
          stepErrors.website = "Please enter a valid website URL";
        }
      }
      break;
    case 2:
      if (!formData.products || formData.products.length === 0) {
        stepErrors.products = "At least one product is required";
      } else {
        formData.products.forEach((product, index) => {
          if (!product.name?.trim()) {
            stepErrors[`products.${index}.name`] = "Product name is required";
          }
          if (!product.overview?.trim()) {
            stepErrors[`products.${index}.overview`] = "Product overview is required";
          } else if (product.overview.trim().length < 50) {
            stepErrors[`products.${index}.overview`] = "Product overview must be at least 50 characters";
          }
        });
      }
      break;
    case 3:
      const hasSelectedIntegrations = formData.integrationCategories && 
        Object.values(formData.integrationCategories).some((integrations: any) => 
          Array.isArray(integrations) && integrations.length > 0
        );
      const hasOtherIntegrations = formData.otherIntegrationsByCategory && 
        Object.values(formData.otherIntegrationsByCategory).some((other: any) => 
          typeof other === 'string' && other.trim().length > 0
        );
      
      if (!hasSelectedIntegrations && !hasOtherIntegrations) {
        stepErrors.integrations = "Please select at least one integration or add other integrations";
      }
      break;
    case 4:
      if (!formData.primaryContact.name?.trim()) {
        stepErrors["primaryContact.name"] = "Contact name is required";
      }
      if (!formData.primaryContact.title?.trim()) {
        stepErrors["primaryContact.title"] = "Contact title is required";
      }
      if (!formData.primaryContact.email?.trim()) {
        stepErrors["primaryContact.email"] = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryContact.email)) {
        stepErrors["primaryContact.email"] = "Please enter a valid email address";
      }
      if (!formData.primaryContact.phone?.trim()) {
        stepErrors["primaryContact.phone"] = "Phone number is required";
      }
      break;
    case 5:
      // Compliance is optional - no validation errors
      break;
    case 6:
      // Summary step - always valid when reached
      break;
  }

  return {
    isValid: Object.keys(stepErrors).length === 0,
    errors: stepErrors,
  };
}

