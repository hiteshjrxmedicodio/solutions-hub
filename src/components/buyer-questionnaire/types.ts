export interface BuyerQuestionnaireData {
  // Institution Details
  institutionName: string;
  institutionType: string;
  institutionTypeOther?: string;
  location: {
    state: string;
    country: string;
    countryOther?: string;
  };

  // Solution Categories
  solutionCategories: string[];
  solutionCategoriesOther?: string;

  // Priority
  priority: string;

  // Contact Information
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
}

export interface BuyerStepProps {
  formData: BuyerQuestionnaireData;
  updateField: (field: keyof BuyerQuestionnaireData, value: any) => void;
  updateNestedField: (field: string, nestedField: string, value: any) => void;
  errors?: Record<string, string>;
  touchedFields?: Set<string>;
}

