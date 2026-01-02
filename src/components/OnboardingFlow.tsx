"use client";

import { useState, useEffect, useRef } from "react";
import { VendorQuestionnaire } from "./vendor-questionnaire/VendorQuestionnaire";
import { VendorQuestionnaireData } from "./vendor-questionnaire/types";
import { BuyerQuestionnaire } from "./buyer-questionnaire/BuyerQuestionnaire";
import { BuyerQuestionnaireData } from "./buyer-questionnaire/types";

type OnboardingStep = "role-selection" | "vendor-questionnaire" | "customer-questionnaire";

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: "customer" | "vendor") => Promise<void>;
  onVendorQuestionnaireSubmit: (data: VendorQuestionnaireData) => Promise<void>;
  onCustomerQuestionnaireSubmit: (data: BuyerQuestionnaireData) => Promise<void>;
}

export function OnboardingFlow({
  isOpen,
  onClose,
  onRoleSelect,
  onVendorQuestionnaireSubmit,
  onCustomerQuestionnaireSubmit,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("role-selection");
  const [selectedRole, setSelectedRole] = useState<"customer" | "vendor" | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const roleContentRef = useRef<HTMLDivElement>(null);
  const questionnaireRef = useRef<HTMLDivElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("role-selection");
      setSelectedRole(null);
      setIsTransitioning(false);
      setIsLoading(false);
      if (modalRef.current) {
        modalRef.current.classList.remove("max-w-4xl");
        modalRef.current.classList.add("max-w-3xl");
      }
    }
  }, [isOpen]);

  const handleRoleConfirm = async () => {
    if (selectedRole) {
      setIsTransitioning(true);
      
      // Fade out role selection content
      if (roleContentRef.current) {
        roleContentRef.current.style.opacity = "0";
      }
      
      // Wait for fade out, then show loading spinner
      setTimeout(async () => {
        setIsLoading(true);
        
        // Save role (async operation)
        await onRoleSelect(selectedRole);
        
        // Update step - this will trigger questionnaire to render
        if (selectedRole === "vendor") {
          setCurrentStep("vendor-questionnaire");
        } else {
          setCurrentStep("customer-questionnaire");
        }
        
        // Hide loading and show questionnaire
        setTimeout(() => {
          setIsLoading(false);
          setIsTransitioning(false);
        }, 300);
      }, 250);
    }
  };

  const handleVendorSubmit = async (data: VendorQuestionnaireData) => {
    await onVendorQuestionnaireSubmit(data);
    onClose();
  };

  const handleCustomerSubmit = async (data: BuyerQuestionnaireData) => {
    await onCustomerQuestionnaireSubmit(data);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  // Render role selection content
  const renderRoleSelection = () => (
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Customer Option */}
        <button
          onClick={() => setSelectedRole("customer")}
          disabled={isTransitioning}
          className={`p-6 rounded-xl border transition-all duration-200 text-left ${
            selectedRole === "customer"
              ? "border-blue-500 bg-blue-50"
              : "border-zinc-200 bg-white hover:border-blue-300 hover:bg-zinc-50"
          } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selectedRole === "customer" ? "bg-blue-500" : "bg-zinc-100"
            }`}>
              <svg className={`w-5 h-5 ${selectedRole === "customer" ? "text-white" : "text-zinc-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Looking for Solutions</h3>
          </div>
          <p className="text-sm text-zinc-600">
            I'm looking for AI solutions to improve patient care and operations.
          </p>
        </button>

        {/* Vendor Option */}
        <button
          onClick={() => setSelectedRole("vendor")}
          disabled={isTransitioning}
          className={`p-6 rounded-xl border transition-all duration-200 text-left ${
            selectedRole === "vendor"
              ? "border-teal-500 bg-teal-50"
              : "border-zinc-200 bg-white hover:border-teal-300 hover:bg-zinc-50"
          } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selectedRole === "vendor" ? "bg-teal-500" : "bg-zinc-100"
            }`}>
              <svg className={`w-5 h-5 ${selectedRole === "vendor" ? "text-white" : "text-zinc-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Selling Solutions</h3>
          </div>
          <p className="text-sm text-zinc-600">
            I'm here to sell AI solutions for healthcare institutions.
          </p>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
        <button
          onClick={handleClose}
          disabled={isTransitioning}
          className="px-6 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleRoleConfirm}
          disabled={!selectedRole || isTransitioning}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Single Modal Container - stays open and resizes */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true">
        {/* Backdrop - stays consistent */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          aria-hidden="true"
          onClick={handleClose}
        />
        
        {/* Role Selection Modal */}
        <div
          ref={modalRef}
          className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col m-4 transition-all duration-500 ease-in-out"
          onClick={(e) => e.stopPropagation()}
          style={{
            opacity: currentStep === "role-selection" ? 1 : 0,
            pointerEvents: currentStep === "role-selection" ? "auto" : "none",
            transition: "max-width 0.5s ease-in-out, opacity 0.3s ease-in-out"
          }}
        >
          {/* Role Selection Content */}
          <div 
            ref={roleContentRef}
            className="flex flex-col h-full transition-opacity duration-300"
            style={{ opacity: isTransitioning ? 0 : 1 }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-zinc-900">Welcome to Astro Vault</h2>
                <p className="text-sm text-zinc-600 mt-1">Choose your role to get started</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close"
                type="button"
              >
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Role Selection Content */}
            <div className="flex-1 overflow-y-auto">
              {renderRoleSelection()}
            </div>
          </div>

          {/* Loading Spinner - shown during transition */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-sm text-zinc-600">Loading questionnaire...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Questionnaire Modals - positioned identically, crossfade */}
      {currentStep === "vendor-questionnaire" && (
        <div
          style={{
            opacity: !isTransitioning ? 1 : 0,
            transition: "opacity 0.3s ease-in-out"
          }}
        >
          <VendorQuestionnaire
            isOpen={!isTransitioning}
            onClose={handleClose}
            onSubmit={handleVendorSubmit}
          />
        </div>
      )}

      {currentStep === "customer-questionnaire" && (
        <div
          style={{
            opacity: !isTransitioning ? 1 : 0,
            transition: "opacity 0.3s ease-in-out"
          }}
        >
          <BuyerQuestionnaire
            isOpen={!isTransitioning}
            onClose={handleClose}
            onSubmit={handleCustomerSubmit}
          />
        </div>
      )}
    </>
  );
}

