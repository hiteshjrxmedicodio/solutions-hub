"use client";

import { useState, useEffect } from "react";

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  isEditable?: boolean;
  isEditMode?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
}

export function EditableField({
  value,
  onSave,
  isEditable = false,
  isEditMode = false,
  multiline = false,
  placeholder = "",
  className = "",
  label,
}: EditableFieldProps) {
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (!isEditMode) {
      setEditValue(value);
    }
  }, [isEditMode, value]);

  if (!isEditable) {
    return (
      <div className={className}>
        {label && <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide block mb-1">{label}</span>}
        <div className={multiline ? "whitespace-pre-line" : ""}>{value || <span className="text-zinc-500 italic">Not set</span>}</div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editValue);
    } catch (error) {
      console.error("Error saving:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditMode && isEditable) {
    return (
      <div className={className}>
        {label && <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide block mb-1">{label}</span>}
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide block mb-1">{label}</span>}
      <div className={multiline ? "whitespace-pre-line" : ""}>
        {value || <span className="text-zinc-500 italic">Not set</span>}
      </div>
    </div>
  );
}

