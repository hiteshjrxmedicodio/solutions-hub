"use client";

import { useState } from "react";
import { EditableField } from "./EditableField";

interface HowWeHelpSectionProps {
  solutionDescription?: string;
  isEditable?: boolean;
  onSave?: (field: string, value: string) => Promise<void>;
  isEditMode?: boolean;
  onEditModeChange?: (isEditMode: boolean) => void;
}

export function HowWeHelpSection({ 
  solutionDescription,
  isEditable = false,
  onSave,
  isEditMode: externalEditMode,
  onEditModeChange,
}: HowWeHelpSectionProps) {
  const [internalEditMode, setInternalEditMode] = useState(false);
  const isEditMode = externalEditMode !== undefined ? externalEditMode : internalEditMode;
  const setIsEditMode = onEditModeChange || setInternalEditMode;

  const handleSave = async (newValue: string) => {
    if (onSave) {
      await onSave("solutionDescription", newValue);
  }
  };

  return (
    <div>
      <EditableField
        value={solutionDescription || ""}
        onSave={async (newValue) => {
          await handleSave(newValue);
          setIsEditMode(false);
        }}
        isEditable={isEditable}
        isEditMode={isEditMode}
        onCancel={() => setIsEditMode(false)}
        multiline={true}
        placeholder="Enter how you help customers..."
        className="text-zinc-700 leading-relaxed"
      />
    </div>
  );
}

