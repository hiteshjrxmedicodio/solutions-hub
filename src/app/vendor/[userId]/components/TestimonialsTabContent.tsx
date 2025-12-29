"use client";
import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

interface Testimonial {
  _id?: string;
  customerName: string;
  customerTitle?: string;
  customerLogo?: string;
  testimonial: string;
  metrics?: string;
  verified?: boolean;
  customerUserId?: string;
  image?: string;
  imageTitle?: string;
  imageLink?: string;
  imageLinkText?: string;
}

interface TestimonialsTabContentProps {
  testimonials?: Testimonial[];
  vendorUserId: string;
  companyName: string;
  isVendorOwner?: boolean;
  enabledSubSections?: string[];
  onRefresh?: () => void;
}

export function TestimonialsTabContent({
  testimonials = [],
  vendorUserId,
  companyName,
  isVendorOwner = false,
  enabledSubSections = [],
  onRefresh,
}: TestimonialsTabContentProps) {
  const isSubSectionEnabled = (subSectionId: string) => {
    return enabledSubSections.includes(`testimonials.${subSectionId}`);
  };
  const { user } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [modalFormData, setModalFormData] = useState({
    customerName: "",
    customerTitle: "",
    testimonial: "",
    metrics: "",
    image: "",
    imageTitle: "",
    imageLink: "",
    imageLinkText: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerTitle: "",
    testimonial: "",
    metrics: "",
  });

  const isCustomer = user?.publicMetadata?.role === "buyer";
  const isVendor = user?.publicMetadata?.role === "seller";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setModalFormData(prev => ({ ...prev, image: reader.result as string }));
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

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setModalFormData({
        customerName: testimonial.customerName,
        customerTitle: testimonial.customerTitle || "",
        testimonial: testimonial.testimonial,
        metrics: testimonial.metrics || "",
        image: testimonial.image || "",
        imageTitle: testimonial.imageTitle || "",
        imageLink: testimonial.imageLink || "",
        imageLinkText: testimonial.imageLinkText || "",
      });
    } else {
      setEditingTestimonial(null);
      setModalFormData({
        customerName: "",
        customerTitle: "",
        testimonial: "",
        metrics: "",
        image: "",
        imageTitle: "",
        imageLink: "",
        imageLinkText: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setIsUploading(false);
  };

  const handleSaveTestimonial = async () => {
    if (!onRefresh || !modalFormData.customerName || !modalFormData.testimonial) {
      alert('Customer name and testimonial are required');
      return;
    }

    setIsUploading(true);
    try {
      const testimonialsList = testimonials || [];
      let updatedTestimonials: Testimonial[];

      if (editingTestimonial && editingTestimonial._id) {
        // Update existing
        updatedTestimonials = testimonialsList.map(testimonial => 
          testimonial._id === editingTestimonial._id 
            ? {
                ...testimonial,
                customerName: modalFormData.customerName,
                customerTitle: modalFormData.customerTitle || undefined,
                testimonial: modalFormData.testimonial,
                metrics: modalFormData.metrics || undefined,
                image: modalFormData.image || undefined,
                imageTitle: modalFormData.imageTitle || undefined,
                imageLink: modalFormData.imageLink || undefined,
                imageLinkText: modalFormData.imageLinkText || undefined,
              }
            : testimonial
        );
      } else {
        // Add new
        const newTestimonial: Testimonial = {
          customerName: modalFormData.customerName,
          customerTitle: modalFormData.customerTitle || undefined,
          testimonial: modalFormData.testimonial,
          metrics: modalFormData.metrics || undefined,
          verified: false,
          image: modalFormData.image || undefined,
          imageTitle: modalFormData.imageTitle || undefined,
          imageLink: modalFormData.imageLink || undefined,
          imageLinkText: modalFormData.imageLinkText || undefined,
        };
        updatedTestimonials = [...testimonialsList, newTestimonial];
      }

      // Save via API
      const response = await fetch(`/api/vendor/${vendorUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerTestimonials: updatedTestimonials,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save testimonial");
      }

      setIsModalOpen(false);
      setEditingTestimonial(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Failed to save testimonial.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId?: string) => {
    if (!onRefresh || !testimonialId) return;
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const updatedTestimonials = testimonials.filter(testimonial => testimonial._id !== testimonialId);
      
      const response = await fetch(`/api/vendor/${vendorUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerTestimonials: updatedTestimonials,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial.");
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vendor/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorUserId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add testimonial");
      }

      setFormData({
        customerName: "",
        customerTitle: "",
        testimonial: "",
        metrics: "",
      });
      setShowAddForm(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/vendor/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorUserId,
          testimonial: formData.testimonial,
          metrics: formData.metrics,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      setFormData({
        customerName: "",
        customerTitle: "",
        testimonial: "",
        metrics: "",
      });
      setShowReviewForm(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyTestimonial = async (testimonialId: string, customerName: string) => {
    try {
      const response = await fetch("/api/vendor/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorUserId,
          testimonialId,
          customerName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify testimonial");
      }

      const result = await response.json();
      if (result.success) {
        alert("Testimonial verified successfully!");
        if (onRefresh) onRefresh();
      }
    } catch (error: any) {
      console.error("Error verifying testimonial:", error);
      alert(error.message || "Failed to verify testimonial. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      {isCustomer && (
        <div className="flex gap-4 mb-2">
          <button
            onClick={() => {
              setShowReviewForm(true);
              setShowAddForm(false);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Add Review Form (Customer) */}
      {showReviewForm && isCustomer && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
          <h3 className="text-xl font-semibold text-zinc-900 mb-4">Write a Review</h3>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Share your experience with this vendor..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Results/Metrics (Optional)
              </label>
              <input
                type="text"
                value={formData.metrics}
                onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 30% productivity boost, 95% accuracy"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setFormData({
                    customerName: "",
                    customerTitle: "",
                    testimonial: "",
                    metrics: "",
                  });
                }}
                className="px-6 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      {isSubSectionEnabled("testimonials-list") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              Customer Testimonials & Reviews
            </h2>
            {isVendorOwner && (
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
                  onClick={() => handleOpenModal()}
                  className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:from-blue-700 hover:to-teal-700 transition-colors flex items-center justify-center shadow-sm"
                  title="Add testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

        {testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial._id || idx}
                className="p-6 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start flex-1">
                    {testimonial.customerLogo && (
                      <div className="mr-3 h-12 w-12 flex-shrink-0">
                        <Image
                          src={testimonial.customerLogo}
                          alt={testimonial.customerName}
                          width={48}
                          height={48}
                          className="object-contain rounded-full"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-zinc-900">
                          {testimonial.customerName}
                        </h3>
                        {testimonial.verified && (
                          <span
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full"
                            title="Verified by customer"
                          >
                            ✓ Verified
                          </span>
                        )}
                        {!testimonial.verified && isCustomer && testimonial._id && (
                          <button
                            onClick={() => handleVerifyTestimonial(testimonial._id!, testimonial.customerName)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full hover:bg-blue-200 transition-colors"
                          >
                            Verify This
                          </button>
                        )}
                      </div>
                      {testimonial.customerTitle && (
                        <p className="text-sm text-zinc-600 mt-1">{testimonial.customerTitle}</p>
                      )}
                      {isVendorOwner && isEditMode && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleOpenModal(testimonial)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial._id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Display */}
                {testimonial.image && (
                  <div className="mb-4 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden w-80">
                    {testimonial.imageTitle && (
                      <div className="px-4 pt-4 pb-2">
                        <h4 className="text-base font-semibold text-zinc-900">{testimonial.imageTitle}</h4>
                      </div>
                    )}
                    <div className="relative group aspect-square w-full">
                      <img
                        src={testimonial.image}
                        alt={testimonial.imageTitle || "Testimonial image"}
                        className="w-full h-full object-contain bg-zinc-50"
                      />
                    </div>
                    {(testimonial.imageLink || testimonial.imageLinkText) && (
                      <div className="px-4 pb-4 pt-2">
                        {testimonial.imageLinkText && (
                          <p className="text-sm text-zinc-600 mb-1">{testimonial.imageLinkText}</p>
                        )}
                        {testimonial.imageLink && (
                          <a
                            href={testimonial.imageLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {testimonial.imageLink}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-zinc-700 mb-3 italic leading-relaxed">
                  &quot;{testimonial.testimonial}&quot;
                </p>

                {testimonial.metrics && (
                  <div className="pt-3 border-t border-zinc-200">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                      Results
                    </p>
                    <p className="text-sm font-semibold text-green-600">{testimonial.metrics}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-500 text-sm italic">
              No testimonials or reviews yet. Be the first to share your experience!
            </p>
          </div>
        )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/30 backdrop-blur-md flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
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
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={modalFormData.customerName}
                    onChange={(e) => setModalFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Customer Title */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Customer Title</label>
                  <input
                    type="text"
                    value={modalFormData.customerTitle}
                    onChange={(e) => setModalFormData(prev => ({ ...prev, customerTitle: e.target.value }))}
                    placeholder="Enter customer title..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Testimonial */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Testimonial *</label>
                  <textarea
                    value={modalFormData.testimonial}
                    onChange={(e) => setModalFormData(prev => ({ ...prev, testimonial: e.target.value }))}
                    placeholder="Enter testimonial..."
                    rows={6}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                </div>

                {/* Metrics */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Results/Metrics</label>
                  <input
                    type="text"
                    value={modalFormData.metrics}
                    onChange={(e) => setModalFormData(prev => ({ ...prev, metrics: e.target.value }))}
                    placeholder="e.g., 30% productivity boost, 95% accuracy"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Image (Optional)</label>
                  {modalFormData.image ? (
                    <div className="relative">
                      <img
                        src={modalFormData.image}
                        alt="Preview"
                        className="w-full h-64 object-contain bg-zinc-50 rounded-lg border border-zinc-200"
                      />
                      <button
                        onClick={() => setModalFormData(prev => ({ ...prev, image: "" }))}
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

                {/* Image Title */}
                {modalFormData.image && (
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Image Title</label>
                    <input
                      type="text"
                      value={modalFormData.imageTitle}
                      onChange={(e) => setModalFormData(prev => ({ ...prev, imageTitle: e.target.value }))}
                      placeholder="Enter image title..."
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Description/Link Text */}
                {modalFormData.image && (
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Description/Subtitle</label>
                    <textarea
                      value={modalFormData.imageLinkText}
                      onChange={(e) => setModalFormData(prev => ({ ...prev, imageLinkText: e.target.value }))}
                      placeholder="Enter description/subtitle..."
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                  </div>
                )}

                {/* Link URL */}
                {modalFormData.image && (
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Link URL (Optional)</label>
                    <input
                      type="url"
                      value={modalFormData.imageLink}
                      onChange={(e) => setModalFormData(prev => ({ ...prev, imageLink: e.target.value }))}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveTestimonial}
                    disabled={!modalFormData.customerName || !modalFormData.testimonial || isUploading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Saving..." : "Save"}
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
    </div>
  );
}

