"use client";

interface PublishButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPublishing: boolean;
  publishTime: string;
  selectedPlatform: "hubspot" | "medium";
}

export function PublishButton({
  onClick,
  disabled,
  isPublishing,
  publishTime,
  selectedPlatform,
}: PublishButtonProps) {
  return (
    <div className="pt-4 border-t border-zinc-200">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-zinc-300 disabled:to-zinc-400 disabled:cursor-not-allowed transition-all font-semibold text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
      >
        {isPublishing ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
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
            {publishTime
              ? `Scheduling to ${selectedPlatform === "hubspot" ? "HubSpot" : "Medium"}...`
              : `Publishing to ${selectedPlatform === "hubspot" ? "HubSpot" : "Medium"}...`}
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
              className="h-5 w-5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            {publishTime
              ? `Schedule to ${selectedPlatform === "hubspot" ? "HubSpot" : "Medium"}`
              : `Publish to ${selectedPlatform === "hubspot" ? "HubSpot" : "Medium"}`}
          </>
        )}
      </button>
    </div>
  );
}

