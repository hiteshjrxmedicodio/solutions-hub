"use client";

import { OnboardingFlow } from "./OnboardingFlow";

// This component is now a wrapper around OnboardingFlow for backward compatibility
interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: "customer" | "vendor") => Promise<void>;
}

export function RoleSelection({ isOpen, onClose, onSelect }: RoleSelectionProps) {
  // For backward compatibility, we need to handle the transition
  // But OnboardingFlow expects different props, so we'll create a simple wrapper
  return (
    <OnboardingFlow
      isOpen={isOpen}
      onClose={onClose}
      onRoleSelect={onSelect}
      onVendorQuestionnaireSubmit={async () => {}}
      onCustomerQuestionnaireSubmit={async () => {}}
    />
  );
}

