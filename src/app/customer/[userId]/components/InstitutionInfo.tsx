"use client";

interface CustomerData {
  userId: string;
  institutionName: string;
  institutionType?: string;
  location?: {
    state: string;
    country: string;
  };
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  selectedAISolutions?: string[];
  priority?: string;
}

interface InstitutionInfoProps {
  customer: CustomerData;
}

export function InstitutionInfo({ customer }: InstitutionInfoProps) {
  return (
    <div className="space-y-6">
      {/* Solution Categories */}
      {customer.selectedAISolutions && customer.selectedAISolutions.length > 0 && (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Solution Categories</h2>
          <p className="text-sm text-zinc-600 mb-4">AI solutions of interest:</p>
          <div className="flex flex-wrap gap-2">
            {customer.selectedAISolutions.map((solution, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
              >
                {solution}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Priority */}
      {customer.priority && (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Solution Priority</h2>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
              customer.priority.toLowerCase() === 'high' || customer.priority.toLowerCase() === 'urgent'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : customer.priority.toLowerCase() === 'medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {customer.priority}
            </div>
            <p className="text-sm text-zinc-600">
              {customer.priority.toLowerCase() === 'high' || customer.priority.toLowerCase() === 'urgent'
                ? 'Urgent need for solution implementation'
                : customer.priority.toLowerCase() === 'medium'
                ? 'Moderate priority for solution'
                : 'Exploring options, no immediate urgency'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

