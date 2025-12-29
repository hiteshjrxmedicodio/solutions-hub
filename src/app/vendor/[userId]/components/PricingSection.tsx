"use client";

interface PricingPlan {
  tierName: string;
  price: string;
  features: string[];
  contractTerms?: string[];
}

interface PricingSectionProps {
  pricingModel?: string;
  pricingRange?: string;
  pricingPlans?: PricingPlan[];
  freemiumOptions?: string;
  roiCalculator?: string;
}

export function PricingSection({
  pricingModel,
  pricingRange,
  pricingPlans,
  freemiumOptions,
  roiCalculator,
}: PricingSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Pricing & Plans</h2>
      
      <div className="space-y-6">
        {(pricingModel || pricingRange) && (
          <div className="grid md:grid-cols-2 gap-6">
            {pricingModel && (
              <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Pricing Model</span>
                <p className="text-xl text-zinc-900 mt-2">{pricingModel}</p>
              </div>
            )}
            {pricingRange && (
              <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">Pricing Range</span>
                <p className="text-xl text-zinc-900 mt-2">{pricingRange}</p>
              </div>
            )}
          </div>
        )}

        {pricingPlans && pricingPlans.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white rounded-lg border-2 border-zinc-200 hover:border-blue-500 transition-colors"
              >
                <h3 className="text-2xl font-semibold text-zinc-900 mb-2">{plan.tierName}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">{plan.price}</p>
                
                {plan.contractTerms && plan.contractTerms.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-zinc-500 uppercase mb-2">Contract Terms</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.contractTerms.map((term, termIdx) => (
                        <span 
                          key={termIdx}
                          className="px-3 py-1 bg-zinc-100 text-zinc-700 text-sm rounded-full"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {plan.features && plan.features.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-zinc-500 uppercase mb-2">Features</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="text-zinc-700 flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {freemiumOptions && (
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">Freemium Options</h3>
            <p className="text-zinc-700 whitespace-pre-line">{freemiumOptions}</p>
          </div>
        )}

        {roiCalculator && (
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-zinc-900 mb-3">ROI Calculator</h3>
            {roiCalculator.startsWith('http') ? (
              <a 
                href={roiCalculator} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Calculate ROI →
              </a>
            ) : (
              <p className="text-zinc-700">{roiCalculator}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

