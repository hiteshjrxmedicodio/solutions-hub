import type { Listing } from "./types";

interface InstitutionContextProps {
  listing: Listing;
}

export function InstitutionContext({ listing }: InstitutionContextProps) {
  if (!listing.institutionName && !listing.medicalSpecialties?.length && !listing.currentSystems?.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
      <h2 className="text-2xl font-bold text-zinc-900 mb-3">Institution Context</h2>
      
      {listing.institutionName && (
        <div className="mb-2">
          <span className="text-sm font-semibold text-zinc-800">Institution: </span>
          <span className="text-zinc-700">{listing.institutionName}</span>
          {listing.institutionType && (
            <span className="text-zinc-500"> ({listing.institutionType})</span>
          )}
        </div>
      )}
      
      {listing.medicalSpecialties && listing.medicalSpecialties.length > 0 && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-zinc-800 mb-1.5">Medical Specialties</h3>
          <div className="flex flex-wrap gap-1.5">
            {listing.medicalSpecialties.map((specialty, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium border border-zinc-200">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {listing.currentSystems && listing.currentSystems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 mb-1.5">Current Systems</h3>
          <div className="flex flex-wrap gap-1.5">
            {listing.currentSystems.map((system, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium border border-zinc-200">
                {system}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

