import type { Listing } from "./types";

interface InstitutionContextProps {
  listing: Listing;
}

export function InstitutionContext({ listing }: InstitutionContextProps) {
  if (!listing.institutionName && !listing.medicalSpecialties?.length && !listing.currentSystems?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-300 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Institution Context</h2>
      
      {listing.institutionName && (
        <div className="mb-4">
          <span className="text-sm font-medium text-zinc-700">Institution: </span>
          <span className="text-zinc-600">{listing.institutionName}</span>
          {listing.institutionType && (
            <span className="text-zinc-500"> ({listing.institutionType})</span>
          )}
        </div>
      )}
      
      {listing.medicalSpecialties && listing.medicalSpecialties.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Medical Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {listing.medicalSpecialties.map((specialty, idx) => (
              <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {listing.currentSystems && listing.currentSystems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 mb-2">Current Systems</h3>
          <div className="flex flex-wrap gap-2">
            {listing.currentSystems.map((system, idx) => (
              <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300">
                {system}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

