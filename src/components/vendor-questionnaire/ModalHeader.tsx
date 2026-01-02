"use client";

interface ModalHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  onClose: () => void;
}

export function ModalHeader({ title, currentStep, totalSteps, stepName, onClose }: ModalHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-zinc-200 bg-white flex items-center justify-between flex-shrink-0">
      <div className="flex-1">
        <h2 id="vendor-questionnaire-title" className="text-2xl font-bold text-zinc-900">{title}</h2>
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
  );
}

