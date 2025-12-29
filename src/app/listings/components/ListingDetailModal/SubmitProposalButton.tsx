"use client";

interface SubmitProposalButtonProps {
  onClick: () => void;
}

export function SubmitProposalButton({ onClick }: SubmitProposalButtonProps) {
  return (
    <div className="flex justify-center pt-8">
      <button
        onClick={onClick}
        type="button"
        className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100"
      >
        Submit Proposal
      </button>
    </div>
  );
}

