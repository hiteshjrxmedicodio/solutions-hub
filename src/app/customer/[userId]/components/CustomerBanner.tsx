"use client";

interface CustomerBannerProps {
  institutionName: string;
  institutionType?: string;
}

export function CustomerBanner({
  institutionName,
  institutionType,
}: CustomerBannerProps) {
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

      {/* Banner Content */}
      <div className="relative z-10 h-full flex items-end pb-8 px-6 max-w-7xl mx-auto">
        <div className="text-white space-y-2">
          {institutionType && (
            <p className="text-sm opacity-90">{institutionType}</p>
          )}
        </div>
      </div>

      {/* White Card Overlay on Banner */}
      <div className="absolute bottom-0 z-20 w-full">
        <div className="w-full px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-t-lg rounded-b-none shadow-lg border border-zinc-200 p-6">
              <div className="flex items-center gap-6">
                {/* Institution Logo */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  {institutionName && (
                    <div className="text-4xl font-bold text-white">
                      {institutionName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Institution Name */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-zinc-900 mb-2">{institutionName}</h1>
                  {institutionType && (
                    <p className="text-sm text-zinc-600">{institutionType}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

