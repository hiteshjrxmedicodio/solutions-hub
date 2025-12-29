"use client";

import { StyledSelect } from "@/components/questionnaire/StyledSelect";
import { SolutionCard } from "../types";

interface QuickStartSectionProps {
  newListings: SolutionCard[];
  selectedListingTitle: string;
  onListingSelect: (title: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function QuickStartSection({
  newListings,
  selectedListingTitle,
  onListingSelect,
  onGenerate,
  isGenerating,
}: QuickStartSectionProps) {
  // Hide the section completely when there are no listings
  // Users can still create posts manually in the Post Content section below
  if (newListings.length === 0) {
    return null;
  }

  const selectedListing = newListings.find(
    (l) => l.title === selectedListingTitle
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-blue-600"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-900 mb-1">
            Start from a Listing
          </h3>
          <p className="text-sm text-zinc-600 mb-2">
            Select a recent listing to auto-generate post content
          </p>
          <StyledSelect
            value={selectedListingTitle}
            onValueChange={onListingSelect}
            options={newListings.map((listing) => listing.title)}
            placeholder="Choose a listing to get started..."
            className=""
          />
        </div>
      </div>
      {selectedListingTitle && selectedListing && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-zinc-900 text-sm">
                {selectedListingTitle}
              </h4>
              <button
                onClick={() => onListingSelect("")}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-zinc-600 line-clamp-2">
              {selectedListing.description}
            </p>
            <button
              onClick={onGenerate}
              disabled={!selectedListingTitle || isGenerating}
              className="mt-3 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

