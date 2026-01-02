import type { Listing } from "./types";

interface BusinessDetailsProps {
  listing: Listing;
}

export function BusinessDetails({ listing }: BusinessDetailsProps) {
  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Business Details</h2>
      <div className="space-y-3 text-sm">
        {listing.contractType.length > 0 && (
          <div>
            <span className="font-medium text-zinc-700">Contract Type: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {listing.contractType.map((type, idx) => (
                <span key={idx} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
        {listing.deploymentPreference.length > 0 && (
          <div>
            <span className="font-medium text-zinc-700">Deployment: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {listing.deploymentPreference.map((pref, idx) => (
                <span key={idx} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

