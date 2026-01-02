"use client";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  isStepValid,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationButtonsProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-zinc-200 px-6 py-4 flex items-center gap-4 shadow-lg">
      {currentStep > 0 && (
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2.5 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-all font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Go back to step ${currentStep}`}
        >
          Previous
        </button>
      )}
      <div className="flex-1" />
      {currentStep < totalSteps - 1 && currentStep > 0 ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          aria-label={`Continue to step ${currentStep + 2}`}
        >
          Next
          <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : currentStep === totalSteps - 1 ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
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
      ) : null}
    </div>
  );
}

