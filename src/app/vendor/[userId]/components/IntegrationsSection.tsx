"use client";
import Image from "next/image";

interface Integration {
  name: string;
  logoUrl?: string;
  apiCompatible?: boolean;
  workflowTools?: string[];
}

interface IntegrationsSectionProps {
  integrations: Integration[];
  showTitle?: boolean;
}

export function IntegrationsSection({ integrations, showTitle = true }: IntegrationsSectionProps) {
  const integrationsList = integrations || [];

  return (
    <div>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-zinc-900">Integrations</h2>
          {integrationsList.length > 0 && (
            <span className="text-sm text-zinc-500">
              {integrationsList.length} {integrationsList.length === 1 ? "integration" : "integrations"}
            </span>
          )}
        </div>
      )}
      {!showTitle && integrationsList.length > 0 && (
        <div className="flex items-center justify-end mb-4">
          <span className="text-sm text-zinc-500">
            {integrationsList.length} {integrationsList.length === 1 ? "integration" : "integrations"}
          </span>
        </div>
      )}

      {/* Integrations Grid */}
      {integrationsList.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {integrationsList.map((integration, idx) => (
            <div
              key={idx}
              className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors flex flex-col items-center text-center"
            >
              {integration.logoUrl ? (
                <div className="mb-3 h-16 w-full flex items-center justify-center">
                  <Image
                    src={integration.logoUrl}
                    alt={integration.name}
                    width={120}
                    height={60}
                    className="object-contain max-h-16 max-w-full"
                  />
                </div>
              ) : (
                <h3 className="text-lg font-semibold text-zinc-900 mb-3">
                  {integration.name}
                </h3>
              )}

              <p className="text-sm text-zinc-700 mb-2">{integration.name}</p>

              {integration.apiCompatible && (
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-2">
                  API Compatible
                </span>
              )}

              {integration.workflowTools &&
                integration.workflowTools.length > 0 && (
                  <div className="mt-2 w-full">
                    <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">
                      Workflow Tools
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {integration.workflowTools.map((tool, toolIdx) => (
                        <span
                          key={toolIdx}
                          className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs rounded"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm italic">No integrations available.</p>
        </div>
      )}
    </div>
  );
}
