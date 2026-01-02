import { VendorQuestionnaireData } from "../types";
import { validateStep } from "./validation";

export function isStepCompleted(
  step: number,
  formData: VendorQuestionnaireData,
  step0Completed: boolean
): boolean {
  // Step 0 is optional - only show checkmark if user has actually completed it (parsed URL or skipped)
  if (step === 0) {
    return step0Completed;
  }
  
  // Step 5 (Compliance) is optional - only show checkmark if user has filled something
  if (step === 5) {
    const hasCompliance = (formData.complianceCertifications && formData.complianceCertifications.length > 0) ||
      (formData.complianceCertificationsOther && formData.complianceCertificationsOther.trim().length > 0);
    return hasCompliance;
  }
  
  // Step 6 (Summary) - only show checkmark when ALL previous steps that show checkmarks are completed
  if (step === 6) {
    // Check Step 0: must be completed (parsed or skipped)
    if (!step0Completed) {
      return false;
    }
    
    // Check all required steps (1-4)
    const step1Valid = validateStep(1, formData).isValid;
    const step2Valid = validateStep(2, formData).isValid;
    const step3Valid = validateStep(3, formData).isValid;
    const step4Valid = validateStep(4, formData).isValid;
    
    // All required steps must be valid
    if (!step1Valid || !step2Valid || !step3Valid || !step4Valid) {
      return false;
    }
    
    return true;
  }
  
  // For all other steps, use validation
  const validation = validateStep(step, formData);
  return validation.isValid;
}

