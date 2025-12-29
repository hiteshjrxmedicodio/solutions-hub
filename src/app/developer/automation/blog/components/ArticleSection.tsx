"use client";

import { useRef, useEffect, useState } from "react";

interface ArticleSectionProps {
  id: string;
  header: string;
  content: string;
  image: File | null;
  onHeaderChange: (id: string, header: string) => void;
  onContentChange: (id: string, content: string) => void;
  onImageChange: (id: string, image: File | null) => void;
  onGenerateSection: () => Promise<void>;
  onRemove: (id: string) => void;
  canRemove: boolean;
  isGenerating: boolean;
}

export function ArticleSection({
  id,
  header,
  content,
  image,
  onHeaderChange,
  onContentChange,
  onImageChange,
  onGenerateSection,
  onRemove,
  canRemove,
  isGenerating,
}: ArticleSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImagePreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImagePreviewUrl(null);
    }
  }, [image]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(id, file);
  };

  const handleRemoveImage = () => {
    onImageChange(id, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageButtonClick = () => {
    if (imagePreviewUrl) {
      handleRemoveImage();
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      {/* Section Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-sm font-semibold text-zinc-700">Section Header</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onGenerateSection}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate section with AI"
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
            <button
              onClick={handleImageButtonClick}
              className={`p-2 rounded-lg transition-colors ${
                imagePreviewUrl
                  ? "text-green-600 hover:bg-green-50"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
              title={imagePreviewUrl ? "Remove image" : "Add image"}
            >
              {imagePreviewUrl ? (
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              ) : (
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
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </button>
        {canRemove && (
          <button
            onClick={() => onRemove(id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove section"
          >
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
        </div>
        <p className="text-xs text-zinc-500 mb-3">
          Enter a header for this section (optional)
        </p>
        <div className="relative">
          <input
            type="text"
            value={header}
            onChange={(e) => onHeaderChange(id, e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-zinc-900 placeholder:text-zinc-400 text-sm"
            placeholder="Enter section header..."
          />
        </div>
      </div>

      {/* Image Preview */}
      {imagePreviewUrl && (
        <div className="mb-5 relative">
          <img
            src={imagePreviewUrl}
            alt="Section preview"
            className="w-full h-48 object-cover rounded-xl border border-zinc-300"
          />
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        id={`image-input-${id}`}
      />

      {/* Section Content */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 mb-1.5">Section Content</h3>
        <p className="text-xs text-zinc-500 mb-3">
          Write the content for this section
        </p>
        <div className="relative">
      <textarea
        value={content}
        onChange={(e) => onContentChange(id, e.target.value)}
        rows={8}
        className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-y text-zinc-900 placeholder:text-zinc-400 text-sm leading-relaxed"
        placeholder="Write your section content here..."
      />
        </div>
      </div>
    </div>
  );
}

