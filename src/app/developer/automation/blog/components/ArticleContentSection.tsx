"use client";

import { PublishButton } from "./PublishButton";
import { ArticleSection } from "./ArticleSection";

interface ArticleSectionData {
  id: string;
  header: string;
  content: string;
  image: File | null;
}

interface ArticleContentSectionProps {
  articleTitle: string;
  sections: ArticleSectionData[];
  onTitleChange: (value: string) => void;
  onSectionHeaderChange: (id: string, header: string) => void;
  onSectionChange: (id: string, content: string) => void;
  onSectionImageChange: (id: string, image: File | null) => void;
  onAddSection: () => void;
  onRemoveSection: (id: string) => void;
  onGenerateTitle: () => Promise<void>;
  onGenerateSection: (id: string) => Promise<void>;
  onPublish: () => Promise<void>;
  isPublishDisabled: boolean;
  isPublishing: boolean;
  isGenerating: boolean;
  publishTime: string;
  selectedPlatform: "hubspot" | "medium";
}

export function ArticleContentSection({
  articleTitle,
  sections,
  onTitleChange,
  onSectionHeaderChange,
  onSectionChange,
  onSectionImageChange,
  onAddSection,
  onRemoveSection,
  onGenerateTitle,
  onGenerateSection,
  onPublish,
  isPublishDisabled,
  isPublishing,
  isGenerating,
  publishTime,
  selectedPlatform,
}: ArticleContentSectionProps) {
  const totalCharacters = sections.reduce((sum, section) => sum + section.content.length, 0);

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <div>
          <h2 className="text-lg font-semibold text-zinc-900 mb-1.5">
            Article Title
          </h2>
          <p className="text-sm text-zinc-500">
            Enter the main title for your article
          </p>
            </div>
            <button
              onClick={onGenerateTitle}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate title with AI"
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
        <input
          type="text"
          value={articleTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-zinc-900 placeholder:text-zinc-400 text-sm"
          placeholder="Enter article title..."
        />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 mb-1.5">
              Article Sections
            </h2>
            <p className="text-sm text-zinc-500">
              {totalCharacters} characters across {sections.length} section{sections.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onAddSection}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium text-sm shadow-sm hover:shadow-md"
          >
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Section
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-2xl p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12 text-zinc-400 mx-auto mb-4"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-zinc-500 font-medium mb-2">No sections yet</p>
            <p className="text-sm text-zinc-400 mb-4">
              Click the "Add Section" button above to start writing
            </p>
            <button
              onClick={onAddSection}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add First Section
            </button>
          </div>
        ) : (
          sections.map((section, index) => (
            <ArticleSection
              key={section.id}
              id={section.id}
              header={section.header}
              content={section.content}
              image={section.image}
              onHeaderChange={onSectionHeaderChange}
              onContentChange={onSectionChange}
              onImageChange={onSectionImageChange}
              onGenerateSection={() => onGenerateSection(section.id)}
              onRemove={onRemoveSection}
              canRemove={sections.length > 1}
              isGenerating={isGenerating}
            />
          ))
        )}
      </div>

      {/* Publish Button */}
      {sections.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <PublishButton
            onClick={onPublish}
            disabled={isPublishDisabled}
            isPublishing={isPublishing}
            publishTime={publishTime}
            selectedPlatform={selectedPlatform}
          />
        </div>
      )}
    </div>
  );
}
