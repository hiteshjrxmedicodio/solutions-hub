import type { Listing } from "./types";

interface RequirementsSectionProps {
  listing: Listing;
}

export function RequirementsSection({ listing }: RequirementsSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Requirements</h2>
      
      {listing.requiredFeatures.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Required Features</h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-600">
            {listing.requiredFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      
      {listing.preferredFeatures.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Preferred Features</h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-600">
            {listing.preferredFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      
      {listing.technicalRequirements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Technical Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-600">
            {listing.technicalRequirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}
      
      {listing.integrationRequirements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Integration Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-600">
            {listing.integrationRequirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}
      
      {listing.complianceRequirements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Compliance Requirements</h3>
          <div className="flex flex-wrap gap-2">
            {listing.complianceRequirements.map((req, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-300">
                {req}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

