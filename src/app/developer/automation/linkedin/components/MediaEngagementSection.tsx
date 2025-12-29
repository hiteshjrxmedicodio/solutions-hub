"use client";

interface MediaEngagementSectionProps {
  postImages: File[];
  mentions: string;
  scheduledTime: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onMentionsChange: (value: string) => void;
  onScheduledTimeChange: (value: string) => void;
  onPublish: () => void;
  isPublishDisabled: boolean;
  isPosting: boolean;
}

export function MediaEngagementSection({
  postImages,
  mentions,
  scheduledTime,
  onImageUpload,
  onRemoveImage,
  onMentionsChange,
  onScheduledTimeChange,
  onPublish,
  isPublishDisabled,
  isPosting,
}: MediaEngagementSectionProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 mb-1">
          Media & Engagement
        </h2>
        <p className="text-sm text-zinc-500">Add images, mentions, and schedule</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-zinc-400"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Images
            {postImages.length > 0 && (
              <span className="ml-auto text-xs font-normal text-blue-600">
                {postImages.length} selected
              </span>
            )}
          </label>
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
              <div className="flex flex-col items-center justify-center pt-4 pb-4">
                <svg
                  className="w-8 h-8 mb-2 text-zinc-400 group-hover:text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-1 text-sm text-zinc-500 group-hover:text-blue-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-zinc-400">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                className="hidden"
              />
            </label>
            {postImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {postImages.map((image, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-zinc-200">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemoveImage(index)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <div className="bg-red-500 text-white rounded-full p-2">
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
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-zinc-400"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Mentions
          </label>
          <input
            type="text"
            value={mentions}
            onChange={(e) => onMentionsChange(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-900 placeholder:text-zinc-400 text-sm"
            placeholder="@company, @person, @organization"
          />
          <p className="text-xs text-zinc-400 mt-2">
            Separate multiple mentions with commas
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-zinc-400"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Schedule
          </label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => onScheduledTimeChange(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-900 text-sm"
          />
          <p className="text-xs text-zinc-400 mt-2">
            Leave empty to publish immediately
          </p>
        </div>

        {/* Publish Button */}
        <div className="pt-3 border-t border-zinc-200">
          <button
            onClick={onPublish}
            disabled={isPublishDisabled}
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
      </div>
    </div>
  );
}

