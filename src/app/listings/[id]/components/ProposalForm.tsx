"use client";

import { useState, useRef, useEffect } from "react";

interface ProposalFormProps {
  listingId: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function ProposalForm({ listingId, onSubmitSuccess, onCancel }: ProposalFormProps) {
  const [proposalText, setProposalText] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [proposedTimeline, setProposedTimeline] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Scroll to form when it mounts
  useEffect(() => {
    if (formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalText.trim()) {
      alert("Please provide a proposal description");
      return;
    }

    setSubmittingProposal(true);
    try {
      const response = await fetch(`/api/listings/${listingId}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalText,
          proposedPrice,
          proposedTimeline,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Proposal submitted successfully!");
        setProposalText("");
        setProposedPrice("");
        setProposedTimeline("");
        onSubmitSuccess();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error submitting proposal:", err);
      alert("Failed to submit proposal. Please try again.");
    } finally {
      setSubmittingProposal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6 mb-8" ref={formRef}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Proposal Description *
          </label>
          <textarea
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe how your solution meets their requirements..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Proposed Price (optional)
          </label>
          <input
            type="text"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., $50,000 - $100,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Proposed Timeline (optional)
          </label>
          <input
            type="text"
            value={proposedTimeline}
            onChange={(e) => setProposedTimeline(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 3-6 months"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submittingProposal}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium disabled:opacity-50"
          >
            {submittingProposal ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => {
              setProposalText("");
              setProposedPrice("");
              setProposedTimeline("");
              onCancel();
            }}
            className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

