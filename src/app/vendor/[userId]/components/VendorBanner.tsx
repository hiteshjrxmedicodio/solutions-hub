"use client";

interface VendorBannerProps {
  companyName: string;
  solutionCategory?: string[];
  website?: string;
  solutionDescription?: string;
  productDescription?: string;
  missionStatement?: string;
}

export function VendorBanner({
  companyName,
  solutionCategory,
  website,
  solutionDescription,
  productDescription,
  missionStatement,
}: VendorBannerProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" style={{ height: '30vh' }}>
      {/* Decorative pattern on right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Banner Content - Categories */}
      <div className="relative z-10 h-full flex items-end pb-8 px-6 max-w-7xl mx-auto">
        <div className="text-white space-y-2">
          {solutionCategory && solutionCategory.length > 0 && (
            <ul className="flex flex-wrap gap-4 text-sm">
              {solutionCategory
                .filter(cat => !cat.toLowerCase().includes('ai scribing') && !cat.toLowerCase().includes('ai scribe'))
                .slice(0, 2)
                .map((cat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    {cat}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* White Card Overlay on Banner - Aligned to the left with main content */}
      <div className="absolute bottom-0 z-20 w-full">
        <div className="w-full px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Middle section (68%) - White Card - Aligned to left */}
            <div className="w-full lg:w-[68%] flex-shrink-0">
              <div className="bg-white rounded-t-lg rounded-b-none shadow-lg border border-zinc-200 p-6">
                <div className="flex items-center gap-6">
                  {/* Company Logo */}
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    {companyName && (
                      <div className="text-4xl font-bold text-white">
                        {companyName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Company Name and Overview */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-zinc-900 mb-3">{companyName}</h1>
                    {(solutionDescription || productDescription || missionStatement) && (
                      <p className="text-sm text-zinc-700">
                        {solutionDescription || productDescription || missionStatement}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Spacer for right sidebar (32%) - Products and Compliance */}
            <div className="hidden lg:block w-[32%] flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

