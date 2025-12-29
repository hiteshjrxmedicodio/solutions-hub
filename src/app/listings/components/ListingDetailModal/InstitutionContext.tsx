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
      <h2 className="text-base font-bold text-zinc-900 mb-3">Institution Context</h2>
      
      {listing.institutionName && (
        <div className="mb-3">
          <span className="text-xs font-semibold text-zinc-800">Institution: </span>
          <span className="text-xs text-zinc-700">{listing.institutionName}</span>
          {listing.institutionType && (
            <span className="text-xs text-zinc-500"> ({listing.institutionType})</span>
          )}
        </div>
      )}
      
      <div className="flex gap-3">
        {listing.medicalSpecialties && listing.medicalSpecialties.length > 0 && (
          <div className="flex-1 bg-zinc-50 rounded-lg border border-zinc-200 p-3">
            <h3 className="text-sm font-semibold text-zinc-800 mb-2">Medical Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {listing.medicalSpecialties.map((specialty, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {listing.currentSystems && listing.currentSystems.length > 0 && (
          <div className="flex-1 bg-zinc-50 rounded-lg border border-zinc-200 p-3">
            <h3 className="text-sm font-semibold text-zinc-800 mb-2">Current Systems</h3>
            <div className="flex flex-wrap gap-2">
              {listing.currentSystems.map((system, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                  {system}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

