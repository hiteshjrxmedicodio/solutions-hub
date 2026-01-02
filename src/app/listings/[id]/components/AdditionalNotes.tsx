import type { Listing } from "./types";

interface AdditionalNotesProps {
  listing: Listing;
}

export function AdditionalNotes({ listing }: AdditionalNotesProps) {
  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Additional Notes</h2>
      {listing.additionalNotes ? (
        <p className="text-zinc-600 whitespace-pre-wrap">{listing.additionalNotes}</p>
      ) : (
        <p className="text-zinc-500 italic">No additional notes provided.</p>
      )}
    </div>
  );
}

