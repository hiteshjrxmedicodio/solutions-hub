"use client";

interface SubmitProposalButtonProps {
  onClick: () => void;
}

export function SubmitProposalButton({ onClick }: SubmitProposalButtonProps) {
  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6 mb-8">
      <button
        onClick={onClick}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium"
      >
        Submit Proposal
      </button>
    </div>
  );
}

