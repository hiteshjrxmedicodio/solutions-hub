"use client";

import { useState, useCallback } from "react";

interface ProposalFormData {
  proposalText: string;
}

interface ProposalFormProps {
  onSubmit: (data: ProposalFormData) => Promise<void>;
  onCancel: () => void;
}

/**
 * ProposalForm Component
 * 
 * Form for vendors to submit proposals with:
 * - Client-side validation
 * - Proper form accessibility
 * - Loading states
 * - Error handling
 */
export function ProposalForm({ onSubmit, onCancel }: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    proposalText: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof ProposalFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null); // Clear error on input change
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.proposalText.trim()) {
      setError("Please provide a proposal description");
      return;
    }

    if (formData.proposalText.trim().length < 50) {
      setError("Proposal description must be at least 50 characters");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        proposalText: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit proposal";
      setError(errorMessage);
      console.error("Error submitting proposal:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = useCallback(() => {
    setFormData({
      proposalText: "",
    });
    setError(null);
    onCancel();
  }, [onCancel]);

  return (
    <div className="w-full pt-7">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 w-full"
        noValidate
      >
        {error && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Proposal Description - Full Width */}
        <div className="mb-5">
          <label htmlFor="proposal-text" className="block text-sm font-semibold text-zinc-800 mb-2">
            Proposal Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="proposal-text"
            value={formData.proposalText}
            onChange={handleChange("proposalText")}
            rows={8}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
            placeholder="Describe how your solution meets their requirements..."
            required
            minLength={50}
            aria-describedby={error ? "proposal-error" : undefined}
            aria-invalid={!!error}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Minimum 50 characters ({formData.proposalText.length}/50)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !formData.proposalText.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-busy={submitting}
          >
            {submitting ? "Submitting..." : "Submit Proposal"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-3 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

