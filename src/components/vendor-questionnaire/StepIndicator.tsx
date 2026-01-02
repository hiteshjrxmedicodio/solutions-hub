"use client";

interface Step {
  id: number;
  name: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  isStepCompleted: (step: number) => boolean;
  totalSteps: number;
}

export function StepIndicator({ steps, currentStep, isStepCompleted, totalSteps }: StepIndicatorProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-200 flex-shrink-0">
      <div className="flex items-start" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step.id);
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
              {index < steps.length - 1 && (
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
  );
}

