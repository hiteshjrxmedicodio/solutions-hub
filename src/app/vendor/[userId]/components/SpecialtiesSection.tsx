"use client";

interface SpecialtiesSectionProps {
  specialties: string[];
  specialtiesPerformance?: Array<{
    specialty: string;
    performanceData: string;
  }>;
}

export function SpecialtiesSection({
  specialties,
  specialtiesPerformance,
}: SpecialtiesSectionProps) {
  const specialtiesList = specialties || [];

  const getPerformanceData = (specialty: string) => {
    return specialtiesPerformance?.find(p => p.specialty === specialty)?.performanceData;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900">Specialties Covered</h2>
        {specialtiesList.length > 0 && (
          <span className="text-sm text-zinc-500">
            {specialtiesList.length} {specialtiesList.length === 1 ? "specialty" : "specialties"}
          </span>
        )}
      </div>

      {/* Specialties Grid */}
      {specialtiesList.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialtiesList.map((specialty, idx) => {
            const performanceData = getPerformanceData(specialty);
            return (
              <div 
                key={idx}
                className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{specialty}</h3>
                {performanceData && (
                  <p className="text-sm text-zinc-600 mt-2">
                    <span className="font-medium">Performance: </span>
                    {performanceData}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm italic">No specialties available.</p>
        </div>
      )}
    </div>
  );
}

