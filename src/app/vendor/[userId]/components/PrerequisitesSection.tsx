"use client";

interface PrerequisitesSectionProps {
  deploymentOptions?: string[];
  integrationCapabilities?: string[];
  targetInstitutionTypes?: string[];
  technologyStack?: string[];
}

export function PrerequisitesSection({
  deploymentOptions,
  integrationCapabilities,
  targetInstitutionTypes,
  technologyStack,
}: PrerequisitesSectionProps) {
  const hasData = 
    (deploymentOptions && deploymentOptions.length > 0) ||
    (integrationCapabilities && integrationCapabilities.length > 0) ||
    (targetInstitutionTypes && targetInstitutionTypes.length > 0) ||
    (technologyStack && technologyStack.length > 0);

  if (!hasData) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-500 text-sm italic">No prerequisites information available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deployment Options */}
      {deploymentOptions && deploymentOptions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            Deployment Options
          </h3>
          <div className="flex flex-wrap gap-2">
            {deploymentOptions.map((option, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg"
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Target Institution Types */}
      {targetInstitutionTypes && targetInstitutionTypes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            Target Institution Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {targetInstitutionTypes.map((type, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-lg"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technology Stack */}
      {technologyStack && technologyStack.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {technologyStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Integration Capabilities */}
      {integrationCapabilities && integrationCapabilities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
            Integration Capabilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {integrationCapabilities.map((capability, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

