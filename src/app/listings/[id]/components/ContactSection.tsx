import type { Listing } from "./types";

interface ContactSectionProps {
  listing: Listing;
}

export function ContactSection({ listing }: ContactSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Contact</h2>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-zinc-700">Name: </span>
          <span className="text-zinc-600">{listing.contactName}</span>
        </div>
        {listing.contactTitle && (
          <div>
            <span className="font-medium text-zinc-700">Title: </span>
            <span className="text-zinc-600">{listing.contactTitle}</span>
          </div>
        )}
        <div>
          <span className="font-medium text-zinc-700">Email: </span>
          <a href={`mailto:${listing.contactEmail}`} className="text-blue-600 hover:underline">
            {listing.contactEmail}
          </a>
        </div>
        {listing.contactPhone && (
          <div>
            <span className="font-medium text-zinc-700">Phone: </span>
            <a href={`tel:${listing.contactPhone}`} className="text-blue-600 hover:underline">
              {listing.contactPhone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

