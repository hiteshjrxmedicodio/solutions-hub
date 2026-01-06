"use client";

import { useState } from "react";
import { EditableField } from "./EditableField";

interface ProductDescriptionSectionProps {
  productDescription?: string;
  solutionDescription?: string;
  isEditable?: boolean;
  onSave?: (field: string, value: string) => Promise<void>;
}

export function ProductDescriptionSection({
  productDescription,
  solutionDescription,
  isEditable = false,
  onSave,
}: ProductDescriptionSectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const description = productDescription || solutionDescription;

  const handleSave = async (newValue: string) => {
    if (onSave) {
      await onSave("productDescription", newValue);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900">Product Description</h2>
        {isEditable && !isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>
      <EditableField
        value={description || ""}
        onSave={async (newValue) => {
          await handleSave(newValue);
          setIsEditMode(false);
        }}
        isEditable={isEditable}
        isEditMode={isEditMode}
        onCancel={() => setIsEditMode(false)}
        multiline={true}
        placeholder="Enter product description..."
        className="prose prose-zinc max-w-none"
      />
    </div>
  );
}

