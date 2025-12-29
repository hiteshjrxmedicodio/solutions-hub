"use client";

interface PostContentSectionProps {
  postHeader: string;
  postBody: string;
  onHeaderChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onGeneratePostContent: () => Promise<void>;
  isGenerating: boolean;
}

export function PostContentSection({
  postHeader,
  postBody,
  onHeaderChange,
  onBodyChange,
  onGeneratePostContent,
  isGenerating,
}: PostContentSectionProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-1">
          Post Content
        </h2>
        <p className="text-sm text-zinc-500">
          Write your post or use generated content above
        </p>
          </div>
          <button
            onClick={onGeneratePostContent}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate post content with AI"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            {isGenerating ? "..." : "AI"}
          </button>
        </div>
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
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Header
          </label>
          <input
            type="text"
            value={postHeader}
            onChange={(e) => onHeaderChange(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-zinc-900 placeholder:text-zinc-400 text-sm"
            placeholder="Write an engaging headline..."
          />
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Body
            <span className="ml-auto text-xs font-normal text-zinc-400">
              {postBody.length} characters
            </span>
          </label>
          <textarea
            value={postBody}
            onChange={(e) => onBodyChange(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y text-zinc-900 placeholder:text-zinc-400 text-sm leading-relaxed"
            placeholder="Share your thoughts, insights, or updates here..."
          />
        </div>
      </div>
    </div>
  );
}

