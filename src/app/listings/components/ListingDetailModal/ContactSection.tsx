import type { Listing } from "./types";
import { formatPhoneForTel } from "./utils/formatPhone";

interface ContactSectionProps {
  listing: Listing;
}

/**
 * ContactSection Component
 * Displays contact information with proper accessibility and security attributes
 */
export function ContactSection({ listing }: ContactSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-3 flex-1 flex flex-col">
      <h2 className="text-sm font-bold text-zinc-900 mb-2">Contact</h2>
      <div className="space-y-1.5 text-xs flex-1" role="list">
        {listing.contactName && (
          <div role="listitem">
            <span className="font-semibold text-zinc-800">Name: </span>
            <span className="text-zinc-700">{listing.contactName}</span>
          </div>
        )}
        {listing.contactTitle && (
          <div role="listitem">
            <span className="font-semibold text-zinc-800">Title: </span>
            <span className="text-zinc-700">{listing.contactTitle}</span>
          </div>
        )}
        {listing.contactEmail ? (
          <div role="listitem">
            <span className="font-semibold text-zinc-800">Email: </span>
            <a
              href={`mailto:${listing.contactEmail}`}
              className="text-blue-600 hover:underline font-medium break-all focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Send email to ${listing.contactEmail}`}
            >
              {listing.contactEmail}
            </a>
          </div>
        ) : (
          <div role="listitem">
            <span className="font-semibold text-zinc-800">Email: </span>
            <span className="text-zinc-500 italic" aria-label="Email not provided">
              Not provided
            </span>
          </div>
        )}
        {listing.contactPhone ? (
          <div role="listitem">
            <span className="font-semibold text-zinc-800">Phone: </span>
            <a
              href={`tel:${formatPhoneForTel(listing.contactPhone)}`}
              className="text-blue-600 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={`Call ${listing.contactPhone}`}
            >
              {listing.contactPhone}
            </a>
          </div>
        ) : (
          <div role="listitem">
            <span className="font-semibold text-zinc-800">Phone: </span>
            <span className="text-zinc-500 italic" aria-label="Phone not provided">
              Not provided
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

