"use client";

import { useState, useEffect } from "react";
import { FormField, Input, Textarea } from "@/components/questionnaire/FormField";
import { MultiSelect } from "@/components/questionnaire/MultiSelect";

interface Product {
  name: string;
  description: string;
  category?: string[];
  features?: string[];
  demoLink?: string;
  trialLink?: string;
}

interface ProductQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData?: Partial<Product>;
}

const PRODUCT_CATEGORIES = [
  "AI Medical Coding",
  "AI Scribing",
  "Clinical Decision Support",
  "Patient Engagement",
  "Revenue Cycle Management",
  "Telemedicine",
  "Population Health",
  "Data Analytics",
  "Electronic Health Records",
  "Workflow Automation",
  "Other",
];

export function ProductQuestionnaire({
  isOpen,
  onClose,
  onSave,
  initialData = {},
}: ProductQuestionnaireProps) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    category: [],
    features: [],
    demoLink: "",
    trialLink: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        category: [],
        features: [],
        demoLink: "",
        trialLink: "",
        ...initialData,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const updateField = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof Product, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSave(formData);
      onClose();
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: [],
        features: [],
        demoLink: "",
        trialLink: "",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10 mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900">Add Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-zinc-600"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <FormField label="Product Name" required>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
            </FormField>

            <FormField label="Product Description" required>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your product..."
                rows={4}
                required
              />
            </FormField>

            <FormField label="Category" hint="Select all that apply">
              <MultiSelect
                value={formData.category || []}
                onValueChange={(value) => updateField("category", value)}
                options={PRODUCT_CATEGORIES}
                placeholder="Select categories"
              />
            </FormField>

            <FormField label="Key Features" hint="Enter features separated by commas">
              <Input
                type="text"
                value={formData.features?.join(", ") || ""}
                onChange={(e) =>
                  updateField(
                    "features",
                    e.target.value.split(",").map((f) => f.trim()).filter((f) => f)
                  )
                }
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </FormField>

            <FormField label="Demo Link">
              <Input
                type="url"
                value={formData.demoLink || ""}
                onChange={(e) => updateField("demoLink", e.target.value)}
                placeholder="https://example.com/demo"
              />
            </FormField>

            <FormField label="Trial Link">
              <Input
                type="url"
                value={formData.trialLink || ""}
                onChange={(e) => updateField("trialLink", e.target.value)}
                placeholder="https://example.com/trial"
              />
            </FormField>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.description}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

