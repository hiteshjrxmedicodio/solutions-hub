"use client";

import { useState, useRef, useEffect } from "react";
import { EditableField } from "./EditableField";

interface KeyMetricsSectionProps {
  keyMetrics?: {
    codingAccuracy?: string;
    firstPassRate?: string;
    throughputGains?: string;
    costSavings?: string;
    image?: string; // Image URL or base64 data URL
    imageTitle?: string; // Title for the image
    imageLink?: string; // Optional link URL
    imageLinkText?: string; // Optional link text/subtitle
    [key: string]: string | undefined;
  };
  isEditable?: boolean;
  onSave?: (field: string, value: any) => Promise<void>;
}

export function KeyMetricsSection({ 
  keyMetrics,
  isEditable = false,
  onSave,
}: KeyMetricsSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(keyMetrics?.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    image: keyMetrics?.image || "",
    imageTitle: keyMetrics?.imageTitle || "",
    imageLinkText: keyMetrics?.imageLinkText || "",
    imageLink: keyMetrics?.imageLink || "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        setFormData(prev => ({ ...prev, image: imageDataUrl }));
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Error reading image file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    const updatedMetrics = { 
      ...keyMetrics, 
      image: formData.image,
      imageTitle: formData.imageTitle,
      imageLinkText: formData.imageLinkText,
      imageLink: formData.imageLink,
    };
    
    await onSave("keyMetrics", updatedMetrics);
    setImagePreview(formData.image);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setFormData({
      image: keyMetrics?.image || "",
      imageTitle: keyMetrics?.imageTitle || "",
      imageLinkText: keyMetrics?.imageLinkText || "",
      imageLink: keyMetrics?.imageLink || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const metrics = [
    { key: 'codingAccuracy', label: 'Coding Accuracy', value: keyMetrics?.codingAccuracy },
    { key: 'firstPassRate', label: 'First Pass Rate', value: keyMetrics?.firstPassRate },
    { key: 'throughputGains', label: 'Throughput Gains', value: keyMetrics?.throughputGains },
    { key: 'costSavings', label: 'Cost Savings', value: keyMetrics?.costSavings },
    ...Object.entries(keyMetrics || {})
      .filter(([key]) => !['codingAccuracy', 'firstPassRate', 'throughputGains', 'costSavings', 'image', 'imageTitle', 'imageLink', 'imageLinkText'].includes(key))
      .map(([key, value]) => ({
        key,
        label: key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value,
      })),
  ].filter(metric => metric.value);

  const hasMetrics = metrics.length > 0;
  const hasImage = imagePreview || keyMetrics?.image;

  useEffect(() => {
    setImagePreview(keyMetrics?.image || null);
  }, [keyMetrics?.image]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">Key Metrics</h2>
        {isEditable && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors"
              title={isEditMode ? "Cancel editing" : "Edit"}
            >
              <svg className={`w-5 h-5 ${isEditMode ? 'text-green-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isEditMode ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                )}
              </svg>
            </button>
            <button
              onClick={handleOpenModal}
              className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:from-blue-700 hover:to-teal-700 transition-colors flex items-center justify-center shadow-sm"
              title={hasImage ? "Edit image" : "Add image"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div>
        {hasImage ? (
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden w-80">
            <div className="space-y-0">
              {/* Title */}
              {keyMetrics?.imageTitle && (
                <div className="px-4 pt-4 pb-2">
                  <h3 className="text-base font-semibold text-zinc-900">{keyMetrics.imageTitle}</h3>
                </div>
              )}
              
              {/* Image */}
              <div className="relative group aspect-square w-full">
                <img
                  src={imagePreview || keyMetrics?.image}
                  alt={keyMetrics?.imageTitle || "Key Metrics"}
                  className="w-full h-full object-contain bg-zinc-50"
                />
              </div>
              
              {/* Link Section */}
              {(keyMetrics?.imageLink || keyMetrics?.imageLinkText) && (
                <div className="px-4 pb-4 pt-2">
                  {keyMetrics?.imageLinkText && (
                    <p className="text-sm text-zinc-600 mb-1">{keyMetrics.imageLinkText}</p>
                  )}
                  {keyMetrics?.imageLink && (
                    <a
                      href={keyMetrics.imageLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {keyMetrics.imageLink}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/30 backdrop-blur-md flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {hasImage ? "Edit Image" : "Add Image"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Image</label>
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-64 object-contain bg-zinc-50 rounded-lg border border-zinc-200"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                        className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-10 h-10 mb-2 text-zinc-400 group-hover:text-blue-500"
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
                        <p className="mb-1 text-sm text-zinc-600 group-hover:text-blue-600">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-zinc-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  )}
                  {isUploading && (
                    <div className="text-center text-blue-600 mt-2">
                      <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-2 text-sm">Uploading...</p>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.imageTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageTitle: e.target.value }))}
                    placeholder="Enter title..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description/Link Text */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.imageLinkText}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageLinkText: e.target.value }))}
                    placeholder="Enter description/subtitle..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Link URL */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Link URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.imageLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageLink: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={!formData.image || isUploading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      {hasMetrics && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 text-center group relative"
            >
              <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
                {metric.label}
              </p>
              {isEditable ? (
                <EditableField
                  value={metric.value || ""}
                  onSave={async (value) => {
                    if (onSave) {
                      const updatedMetrics = { ...keyMetrics, [metric.key]: value };
                      await onSave("keyMetrics", updatedMetrics);
                    }
                  }}
                  isEditable={isEditable}
                  isEditMode={isEditMode}
                  className="text-2xl font-bold text-blue-600"
                />
              ) : (
                <p className="text-2xl font-bold text-blue-600">
                  {metric.value}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
