"use client";

interface SubmitProposalButtonProps {
  onClick: () => void;
}

export function SubmitProposalButton({ onClick }: SubmitProposalButtonProps) {
  return (
    <div className="flex justify-center py-4">
      <button
        onClick={onClick}
        type="button"
        className="w-full max-w-md px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100 text-base"
      >
        Submit Proposal
      </button>
    </div>
  );
}

