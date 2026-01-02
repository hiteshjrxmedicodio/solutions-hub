"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { BuyerQuestionnaireData } from "./types";
import { Step1InstitutionDetails } from "./Step1InstitutionDetails";
import { Step2SolutionCategories } from "./Step2SolutionCategories";
import { Step3Priority } from "./Step3Priority";
import { Step4ContactInfo } from "./Step4ContactInfo";

const STEPS = [
  { id: 1, name: "Institution Details", description: "Basic institution information" },
  { id: 2, name: "Solution Categories", description: "What you're looking for" },
  { id: 3, name: "Priority", description: "Urgency level" },
  { id: 4, name: "Contact Information", description: "How to reach you" },
];

interface BuyerQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BuyerQuestionnaireData) => Promise<void>;
  initialData?: Partial<BuyerQuestionnaireData>;
}

const TOTAL_STEPS = 4;

const getInitialFormData = (): BuyerQuestionnaireData => ({
  institutionName: "",
  institutionType: "",
  location: {
    state: "",
    country: "",
  },
  solutionCategories: [],
  priority: "",
  primaryContact: {
    name: "",
    title: "",
    email: "",
    phone: "",
  },
});

export function BuyerQuestionnaire({ isOpen, onClose, onSubmit, initialData }: BuyerQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);

  const getFormDataWithInitial = useCallback((): BuyerQuestionnaireData => {
    if (!initialData) return getInitialFormData();
    return {
      institutionName: initialData.institutionName || "",
      institutionType: initialData.institutionType || "",
      institutionTypeOther: initialData.institutionTypeOther,
      location: {
        state: initialData.location?.state || "",
        country: initialData.location?.country || "",
        countryOther: initialData.location?.countryOther,
      },
      solutionCategories: initialData.solutionCategories || [],
      solutionCategoriesOther: initialData.solutionCategoriesOther,
      priority: initialData.priority || "",
      primaryContact: {
        name: initialData.primaryContact?.name || "",
        title: initialData.primaryContact?.title || "",
        email: initialData.primaryContact?.email || "",
        phone: initialData.primaryContact?.phone || "",
      },
    };
  }, [initialData]);

  const [formData, setFormData] = useState<BuyerQuestionnaireData>(getFormDataWithInitial());

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getFormDataWithInitial());
      setCurrentStep(1);
      setErrors({});
      setTouchedFields(new Set());
    }
  }, [isOpen, getFormDataWithInitial]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector<HTMLElement>(
        'input, select, textarea'
      );
      firstInput?.focus();
    }
  }, [isOpen, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const updateField = useCallback((field: keyof BuyerQuestionnaireData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Clear error when field is updated
      if (errors[field as string]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[field as string];
          return newErrors;
        });
      }
      return updated;
    });
    setTouchedFields((prev) => new Set(prev).add(field as string));
  }, [errors]);

  const updateNestedField = useCallback((field: string, nestedField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof BuyerQuestionnaireData] as any),
        [nestedField]: value,
      },
    }));
    const fieldKey = `${field}.${nestedField}`;
    if (errors[fieldKey]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
    setTouchedFields((prev) => new Set(prev).add(fieldKey));
  }, [errors]);

  const validateStep = useCallback((step: number): { isValid: boolean; errors: Record<string, string> } => {
    const stepErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.institutionName?.trim()) {
          stepErrors.institutionName = "Institution name is required";
        }
        if (!formData.institutionType) {
          stepErrors.institutionType = "Institution type is required";
        }
        if (formData.institutionType === "Other" && !formData.institutionTypeOther?.trim()) {
          stepErrors.institutionTypeOther = "Please specify institution type";
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
        break;
      case 2:
        if (!formData.solutionCategories || formData.solutionCategories.length === 0) {
          stepErrors.solutionCategories = "Please select at least one solution category";
        }
        break;
      case 3:
        if (!formData.priority) {
          stepErrors.priority = "Priority level is required";
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
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors,
    };
  }, [formData]);

  const handleNext = useCallback(() => {
    const validation = validateStep(currentStep);
    if (validation.isValid && currentStep < TOTAL_STEPS) {
      setErrors({});
      setTouchedFields(new Set()); // Reset touched fields when moving to next step
      setCurrentStep((prev) => prev + 1);
      // Scroll to top of form content
      setTimeout(() => {
        modalRef.current?.querySelector('.form-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      // Mark all fields in this step as touched to show errors
      const fieldsToTouch = Object.keys(validation.errors);
      setTouchedFields((prev) => {
        const newSet = new Set(prev);
        fieldsToTouch.forEach(field => newSet.add(field));
        return newSet;
      });
      setErrors(validation.errors);
      // Focus first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        setTimeout(() => {
          const field = modalRef.current?.querySelector<HTMLElement>(
            `[name="${firstErrorField}"], [data-field="${firstErrorField}"]`
          );
          field?.focus();
          field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [currentStep, validateStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => {
        modalRef.current?.querySelector('.form-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData(getInitialFormData());
      setCurrentStep(1);
      setErrors({});
      setTouchedFields(new Set());
      onClose();
    } catch (error) {
      console.error("Error submitting buyer questionnaire:", error);
      setErrors({ submit: error instanceof Error ? error.message : "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, formData, validateStep, onSubmit, onClose]);

  const isStepValid = useMemo(() => {
    const validation = validateStep(currentStep);
    return validation.isValid;
  }, [currentStep, validateStep]);

  if (!isOpen) return null;

  const renderStep = () => {
    const stepProps = {
      formData,
      updateField,
      updateNestedField,
      errors,
      touchedFields,
    };

    switch (currentStep) {
      case 1:
        return <Step1InstitutionDetails {...stepProps} />;
      case 2:
        return <Step2SolutionCategories {...stepProps} />;
      case 3:
        return <Step3Priority {...stepProps} />;
      case 4:
        return <Step4ContactInfo {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="buyer-questionnaire-title">
      {/* Full screen backdrop blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        aria-hidden="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      />
      {/* Modal content */}
      <div 
        ref={modalRef}
        className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col m-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex-1">
            <h2 id="buyer-questionnaire-title" className="text-2xl font-bold text-zinc-900">Customer Profile</h2>
            <p className="text-sm text-zinc-600 mt-1">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close questionnaire"
            type="button"
          >
            <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-200 flex-shrink-0">
          <div className="flex items-start" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center flex-1 relative">
                  {/* Step Circle and Label */}
                  <div className="flex flex-col items-center flex-1 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md scale-105"
                          : isCurrent
                          ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg ring-4 ring-blue-200 scale-110"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium text-center transition-colors whitespace-nowrap ${
                      isCurrent ? "text-blue-600 font-semibold" : isCompleted ? "text-zinc-700" : "text-zinc-400"
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  
                  {/* Connecting Line - positioned between circles */}
                  {index < STEPS.length - 1 && (
                    <div className="absolute left-1/2 top-5 w-full h-1 -translate-y-1/2 -z-0" style={{ marginLeft: '1.25rem' }}>
                      <div className={`h-full transition-all duration-500 ${
                        isCompleted 
                          ? "bg-gradient-to-r from-blue-600 to-teal-600" 
                          : "bg-zinc-200"
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto form-content">
          <div className="px-6 py-6">
            {/* Error message for submit */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                </div>
              </div>
            )}

            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-zinc-200 px-6 py-4 flex items-center gap-4 shadow-lg">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2.5 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-all font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Go back to step ${currentStep - 1}`}
              >
                Previous
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-all font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                aria-label={`Continue to step ${currentStep + 1}`}
              >
                Next
                <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-teal-600"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Profile"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

