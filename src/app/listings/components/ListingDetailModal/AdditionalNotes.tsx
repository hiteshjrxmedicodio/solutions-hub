import type { Listing } from "./types";

interface AdditionalNotesProps {
  listing: Listing;
}

export function AdditionalNotes({ listing }: AdditionalNotesProps) {
  if (!listing.additionalNotes) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
      <h2 className="text-sm font-bold text-zinc-900 mb-2">Additional Notes</h2>
      <p className="text-xs text-zinc-700 whitespace-pre-wrap leading-snug">{listing.additionalNotes}</p>
    </div>
  );
}

