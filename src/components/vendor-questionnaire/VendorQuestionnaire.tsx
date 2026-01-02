"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { VendorQuestionnaireData } from "./types";
import { Step0UrlInput } from "./Step0UrlInput";
import { Step1CompanyOverview } from "./Step1CompanyOverview";
import { Step2ContactInfo } from "./Step2ContactInfo";
import { Step3ProductInfo } from "./Step3ProductInfo";
import { Step4Integrations } from "./Step4Integrations";
import { Step5Compliance } from "./Step5Compliance";
import { Step6Summary } from "./Step6Summary";
import { StepIndicator } from "./StepIndicator";
import { ModalHeader } from "./ModalHeader";
import { NavigationButtons } from "./NavigationButtons";
import { validateStep } from "./utils/validation";
import { isStepCompleted as checkStepCompleted } from "./utils/stepCompletion";
import { getInitialFormData, mergeInitialData } from "./utils/formData";
import { useUrlParsing } from "./hooks/useUrlParsing";

const STEPS = [
  { id: 0, name: "Parse Website", description: "Optional: Auto-fill from URL" },
  { id: 1, name: "Company Overview", description: "Basic company information" },
  { id: 2, name: "Product Information", description: "Tell us about your product" },
  { id: 3, name: "Integrations", description: "Integration capabilities" },
  { id: 4, name: "Contact Information", description: "How to reach you" },
  { id: 5, name: "Compliance", description: "Certifications & compliance" },
  { id: 6, name: "Summary", description: "Review your information" },
];

interface VendorQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VendorQuestionnaireData) => Promise<void>;
  initialData?: Partial<VendorQuestionnaireData>;
}

const TOTAL_STEPS = 7;

export function VendorQuestionnaire({ isOpen, onClose, onSubmit, initialData }: VendorQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);
  const [step0Completed, setStep0Completed] = useState(false);
  const [formData, setFormData] = useState<VendorQuestionnaireData>(getInitialFormData());

  // URL parsing hook
  const { isParsing, parseError, handleUrlSubmit } = useUrlParsing(
    setFormData,
    setStep0Completed,
    setCurrentStep,
    modalRef
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setCurrentStep(0);
      setErrors({});
      setTouchedFields(new Set());
      setStep0Completed(false);
    }
  }, [isOpen]);

  // Update form data when initialData changes (for progressive filling from streaming)
  useEffect(() => {
    if (isOpen && initialData && Object.keys(initialData).length > 0) {
      setFormData((current) => mergeInitialData(current, initialData));
    }
  }, [isOpen, initialData]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector<HTMLElement>('input, select, textarea');
      firstInput?.focus();
    }
  }, [isOpen, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const updateField = useCallback((field: keyof VendorQuestionnaireData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
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
        ...(prev[field as keyof VendorQuestionnaireData] as any),
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

  const handleSkip = useCallback(() => {
    setStep0Completed(true);
    setCurrentStep(1);
    setTimeout(() => {
      modalRef.current?.querySelector('.form-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      setStep0Completed(true);
      setCurrentStep(1);
      setTimeout(() => {
        modalRef.current?.querySelector('.form-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }

    const validation = validateStep(currentStep, formData);
    if (validation.isValid && currentStep < TOTAL_STEPS - 1) {
      setErrors({});
      setTouchedFields(new Set());
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => {
        modalRef.current?.querySelector('.form-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      const fieldsToTouch = Object.keys(validation.errors);
      setTouchedFields((prev) => {
        const newSet = new Set(prev);
        fieldsToTouch.forEach(field => newSet.add(field));
        return newSet;
      });
      setErrors(validation.errors);
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
  }, [currentStep, formData]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => {
        modalRef.current?.querySelector('.form-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (currentStep !== TOTAL_STEPS) {
      const validation = validateStep(currentStep, formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData(getInitialFormData());
      setCurrentStep(0);
      setErrors({});
      setTouchedFields(new Set());
      onClose();
    } catch (error) {
      console.error("Error submitting vendor questionnaire:", error);
      setErrors({ submit: error instanceof Error ? error.message : "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, formData, onSubmit, onClose, TOTAL_STEPS]);

  const isStepValid = useMemo(() => {
    // Step 0 doesn't need validation - always valid
    if (currentStep === 0) {
      return true;
    }
    const validation = validateStep(currentStep, formData);
    return validation.isValid;
  }, [currentStep, formData]);

  const isStepCompleted = useCallback((step: number): boolean => {
    return checkStepCompleted(step, formData, step0Completed);
  }, [formData, step0Completed]);

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
      case 0:
        return (
          <Step0UrlInput
            onUrlSubmit={handleUrlSubmit}
            onSkip={handleSkip}
            isParsing={isParsing}
            parseError={parseError}
          />
        );
      case 1:
        return <Step1CompanyOverview {...stepProps} />;
      case 2:
        return <Step3ProductInfo {...stepProps} />;
      case 3:
        return <Step4Integrations {...stepProps} />;
      case 4:
        return <Step2ContactInfo {...stepProps} />;
      case 5:
        return <Step5Compliance {...stepProps} />;
      case 6:
        return <Step6Summary {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="vendor-questionnaire-title">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        aria-hidden="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div 
        ref={modalRef}
        className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col m-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          title="Vendor Profile"
          currentStep={currentStep}
          totalSteps={STEPS.length}
          stepName={STEPS[currentStep]?.name}
          onClose={onClose}
        />

        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          isStepCompleted={isStepCompleted}
          totalSteps={TOTAL_STEPS}
        />

        <div className="flex-1 overflow-y-auto form-content">
          <div className="px-6 py-6">
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
        </div>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={STEPS.length}
          isStepValid={isStepValid}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
