import { useMemo } from "react";
import type { Listing } from "./types";

interface RequirementsSectionProps {
  listing: Listing;
}

/**
 * RequirementsSection Component
 * 
 * Displays all requirement categories with proper semantic HTML
 * Uses memoization to avoid unnecessary re-renders
 */
export function RequirementsSection({ listing }: RequirementsSectionProps) {
  // Memoize requirement checks to optimize rendering
  const hasRequirements = useMemo(() => {
    return (
      listing.requiredFeatures.length > 0 ||
      listing.preferredFeatures.length > 0 ||
      listing.technicalRequirements.length > 0 ||
      listing.integrationRequirements.length > 0 ||
      listing.complianceRequirements.length > 0
    );
  }, [
    listing.requiredFeatures.length,
    listing.preferredFeatures.length,
    listing.technicalRequirements.length,
    listing.integrationRequirements.length,
    listing.complianceRequirements.length,
  ]);

  if (!hasRequirements) {
    return null;
  }

  // Helper to generate stable keys for list items
  const getItemKey = (item: string, index: number) => `${item.slice(0, 20)}-${index}`;

  return (
    <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4" aria-labelledby="requirements-heading">
      <h2 id="requirements-heading" className="text-2xl font-bold text-zinc-900 mb-2">
        Requirements
      </h2>

      {listing.requiredFeatures.length > 0 && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-zinc-800 mb-1">Required Features</h3>
          <ul className="list-disc list-inside text-zinc-700 space-y-0.5" role="list">
            {listing.requiredFeatures.map((feature, idx) => (
              <li key={getItemKey(feature, idx)} className="text-base">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listing.preferredFeatures.length > 0 && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-zinc-800 mb-1">Preferred Features</h3>
          <ul className="list-disc list-inside text-zinc-700 space-y-0.5" role="list">
            {listing.preferredFeatures.map((feature, idx) => (
              <li key={getItemKey(feature, idx)} className="text-base">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listing.technicalRequirements.length > 0 && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-zinc-800 mb-1">Technical Requirements</h3>
          <ul className="list-disc list-inside text-zinc-700 space-y-0.5" role="list">
            {listing.technicalRequirements.map((req, idx) => (
              <li key={getItemKey(req, idx)} className="text-base">
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listing.integrationRequirements.length > 0 && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-zinc-800 mb-1">Integration Requirements</h3>
          <ul className="list-disc list-inside text-zinc-700 space-y-0.5" role="list">
            {listing.integrationRequirements.map((req, idx) => (
              <li key={getItemKey(req, idx)} className="text-base">
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {listing.complianceRequirements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 mb-1">Compliance Requirements</h3>
          <div className="flex flex-wrap gap-2" role="list">
            {listing.complianceRequirements.map((req, idx) => (
              <span
                key={getItemKey(req, idx)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                role="listitem"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

