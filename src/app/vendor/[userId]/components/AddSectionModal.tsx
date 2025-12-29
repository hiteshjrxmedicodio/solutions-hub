"use client";

import { useState } from "react";

interface SubSection {
  id: string;
  name: string;
  description?: string;
}

interface Section {
  id: string;
  name: string;
  description?: string;
  subsections?: SubSection[];
}

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSections: Section[];
  enabledSections: string[];
  enabledSubSections?: string[];
  onToggleSection: (sectionId: string) => void;
  onToggleSubSection?: (sectionId: string, subSectionId: string) => void;
}

export function AddSectionModal({
  isOpen,
  onClose,
  availableSections,
  enabledSections,
  enabledSubSections = [],
  onToggleSection,
  onToggleSubSection,
}: AddSectionModalProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const isSectionEnabled = (sectionId: string) => enabledSections.includes(sectionId);
  const isSubSectionEnabled = (sectionId: string, subSectionId: string) => {
    return enabledSubSections.includes(`${sectionId}.${subSectionId}`);
  };

  const toggleExpand = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Add Section</h2>
            <p className="text-xs text-zinc-500 mt-1">Click sections to toggle them on or off</p>
          </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-zinc-600 mb-6">
            Select sections to add to your profile. Sections with a checkmark are already enabled. Click the arrow icon to view and manage subsections.
          </p>

          <div className="space-y-3">
            {availableSections.map((section) => {
              const isEnabled = isSectionEnabled(section.id);
              const isExpanded = expandedSections.has(section.id);
              const hasSubsections = section.subsections && section.subsections.length > 0;

              return (
                <div key={section.id} className="space-y-2">
                  {/* Main Section */}
                  <div className="flex items-center gap-2">
                      <div
                        onClick={() => onToggleSection(section.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onToggleSection(section.id);
                          }
                        }}
                        className={`flex-1 flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          isEnabled
                            ? "border-blue-500 bg-blue-50"
                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isEnabled
                                ? "border-blue-600 bg-blue-600"
                                : "border-zinc-300"
                            }`}
                          >
                            {isEnabled && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-zinc-900">{section.name}</div>
                            {section.description && (
                              <div className="text-sm text-zinc-600 mt-1">{section.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isEnabled && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                              Enabled
                            </span>
                          )}
                        </div>
                      </div>
                      {hasSubsections && (
                        <button
                          onClick={() => toggleExpand(section.id)}
                          className="p-2 hover:bg-zinc-200 rounded transition-colors flex-shrink-0"
                          aria-label={isExpanded ? "Collapse subsections" : "Expand subsections"}
                        >
                          <svg
                            className={`w-5 h-5 text-zinc-600 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                  </div>

                  {/* Subsections */}
                  {hasSubsections && isExpanded && (
                    <div className="ml-8 space-y-2 border-l-2 border-zinc-200 pl-4">
                      {section.subsections!.map((subsection) => {
                        const subSectionKey = `${section.id}.${subsection.id}`;
                        const isSubEnabled = isSubSectionEnabled(section.id, subsection.id);
                        return (
                          <button
                            key={subsection.id}
                              onClick={() => onToggleSubSection?.(section.id, subsection.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                                isSubEnabled
                                  ? "border-blue-400 bg-blue-50"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    isSubEnabled
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-zinc-300"
                                  }`}
                                >
                                  {isSubEnabled && (
                                    <svg
                                      className="w-2.5 h-2.5 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="text-left">
                                  <div className="font-medium text-sm text-zinc-900">{subsection.name}</div>
                                  {subsection.description && (
                                    <div className="text-xs text-zinc-600 mt-0.5">{subsection.description}</div>
                                  )}
                                </div>
                              </div>
                              {isSubEnabled && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                  Enabled
                                </span>
                              )}
                            </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-zinc-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors font-medium text-zinc-700"
            >
              Done
            </button>
        </div>
      </div>
    </div>
  );
}

