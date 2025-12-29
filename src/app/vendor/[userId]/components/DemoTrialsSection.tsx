"use client";

interface DemoTrialsSectionProps {
  demoLink?: string;
  trialLink?: string;
  onboardingProcess?: string;
  supportSLAs?: string;
}

export function DemoTrialsSection({ 
  demoLink, 
  trialLink, 
  onboardingProcess,
  supportSLAs 
}: DemoTrialsSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">Demo & Trials</h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {demoLink && (
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Live Demo</h3>
            <p className="text-sm text-zinc-600 mb-3">Experience our solution in action</p>
            <a 
              href={demoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              View Demo →
            </a>
          </div>
        )}
        
        {trialLink && (
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Free Trial</h3>
            <p className="text-sm text-zinc-600 mb-3">Try our solution risk-free</p>
            <a 
              href={trialLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Start Free Trial →
            </a>
          </div>
        )}
      </div>

      {onboardingProcess && (
        <div className="mt-4 pt-4 border-t border-zinc-200">
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Onboarding Process</h3>
          <p className="text-sm text-zinc-700 whitespace-pre-line">{onboardingProcess}</p>
        </div>
      )}

      {supportSLAs && (
        <div className="mt-4 pt-4 border-t border-zinc-200">
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Support SLAs</h3>
          <p className="text-sm text-zinc-700 whitespace-pre-line">{supportSLAs}</p>
        </div>
      )}
    </div>
  );
}

