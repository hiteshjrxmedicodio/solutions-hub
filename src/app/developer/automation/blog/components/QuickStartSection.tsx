"use client";

interface QuickStartSectionProps {
  topic: string;
  selectedPlatform: "hubspot" | "medium";
  onTopicChange: (value: string) => void;
  onPlatformChange: (value: "hubspot" | "medium") => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function QuickStartSection({
  topic,
  selectedPlatform,
  onTopicChange,
  onPlatformChange,
  onGenerate,
  isGenerating,
}: QuickStartSectionProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-green-600"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-900 mb-1">
            Start with a Topic
          </h3>
          <p className="text-sm text-zinc-600 mb-3">
            Enter a topic to auto-generate article content
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder="e.g., AI in Healthcare, Telemedicine Trends..."
              className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
            />
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-2">
                Publishing Platform
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="medium"
                    checked={selectedPlatform === "medium"}
                    onChange={(e) =>
                      onPlatformChange(e.target.value as "hubspot" | "medium")
                    }
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-zinc-700">Medium</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="hubspot"
                    checked={selectedPlatform === "hubspot"}
                    onChange={(e) =>
                      onPlatformChange(e.target.value as "hubspot" | "medium")
                    }
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-zinc-700">HubSpot</span>
                </label>
              </div>
            </div>
            <button
              onClick={onGenerate}
              disabled={!topic.trim() || isGenerating}
              className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Generate Article
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

