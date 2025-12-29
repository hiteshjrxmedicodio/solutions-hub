import type { Listing } from "./types";

interface BusinessDetailsProps {
  listing: Listing;
}

export function BusinessDetails({ listing }: BusinessDetailsProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-3 flex-1 flex flex-col">
      <h2 className="text-lg font-bold text-zinc-900 mb-2">Business Details</h2>
      <div className="space-y-2 text-xs">
        {listing.contractType.length > 0 && (
          <div>
            <span className="font-semibold text-zinc-800">Contract Type: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {listing.contractType.map((type, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
        {listing.deploymentPreference.length > 0 && (
          <div>
            <span className="font-semibold text-zinc-800">Deployment: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {listing.deploymentPreference.map((pref, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-medium">
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

