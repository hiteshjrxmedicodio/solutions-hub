"use client";

interface MediaEngagementSectionProps {
  articleImages: File[];
  tags: string;
  publishTime: string;
  selectedPlatform: "hubspot" | "medium";
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onTagsChange: (value: string) => void;
  onPublishTimeChange: (value: string) => void;
  onPublish: () => void;
  isPublishDisabled: boolean;
  isPublishing: boolean;
}

export function MediaEngagementSection({
  articleImages,
  tags,
  publishTime,
  selectedPlatform,
  onImageUpload,
  onRemoveImage,
  onTagsChange,
  onPublishTimeChange,
  onPublish,
  isPublishDisabled,
  isPublishing,
}: MediaEngagementSectionProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-zinc-900 mb-1.5">
          Media & Engagement
        </h2>
        <p className="text-sm text-zinc-500">Add images, tags, and schedule</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2.5">
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
            {articleImages.length > 0 && (
              <span className="ml-auto text-xs font-normal text-green-600">
                {articleImages.length} selected
              </span>
            )}
          </label>
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group">
              <div className="flex flex-col items-center justify-center pt-4 pb-4">
                <svg
                  className="w-8 h-8 mb-2 text-zinc-400 group-hover:text-green-500"
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
                <p className="mb-1 text-sm text-zinc-500 group-hover:text-green-600">
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
            {articleImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {articleImages.map((image, index) => (
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
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2.5">
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
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Tags/Categories
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-zinc-900 placeholder:text-zinc-400 text-sm"
            placeholder="AI, Healthcare, Technology..."
          />
          <p className="text-xs text-zinc-400 mt-2">
            Separate multiple tags with commas
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2.5">
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
            Publish Time
          </label>
          <input
            type="datetime-local"
            value={publishTime}
            onChange={(e) => onPublishTimeChange(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-zinc-900 text-sm"
          />
          <p className="text-xs text-zinc-400 mt-2">
            Leave empty to publish immediately
          </p>
        </div>

        {/* Publish Button */}
        <div className="pt-4 border-t border-zinc-200">
          <button
            onClick={onPublish}
            disabled={isPublishDisabled}
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
      </div>
    </div>
  );
}

