"use client";

interface PublishButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPosting: boolean;
  scheduledTime: string;
}

export function PublishButton({
  onClick,
  disabled,
  isPosting,
  scheduledTime,
}: PublishButtonProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xl">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-zinc-300 disabled:to-zinc-400 disabled:cursor-not-allowed transition-all font-semibold text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
      >
        {isPosting ? (
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
            {scheduledTime ? "Scheduling..." : "Publishing..."}
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
            {scheduledTime ? "Schedule Post" : "Publish to LinkedIn"}
          </>
        )}
      </button>
    </div>
  );
}

