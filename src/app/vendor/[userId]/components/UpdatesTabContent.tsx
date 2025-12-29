"use client";

import { useState, useRef } from "react";

interface Update {
  _id?: string;
  title: string;
  content: string;
  date: Date | string;
  type: 'release' | 'feature' | 'announcement' | 'roadmap';
  linkedinPosted?: boolean;
  image?: string;
  imageTitle?: string;
  imageLink?: string;
  imageLinkText?: string;
}

interface UpdatesTabContentProps {
  updates?: Update[];
  futureRoadmap?: string;
  enabledSubSections?: string[];
  isEditable?: boolean;
  onSave?: (field: string, value: any) => Promise<void>;
}

export function UpdatesTabContent({
  updates,
  futureRoadmap,
  enabledSubSections = [],
  isEditable = false,
  onSave,
}: UpdatesTabContentProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: 'announcement' as 'release' | 'feature' | 'announcement' | 'roadmap',
    image: "",
    imageTitle: "",
    imageLink: "",
    imageLinkText: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSubSectionEnabled = (subSectionId: string) => {
    return enabledSubSections.includes(`updates.${subSectionId}`);
  };

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
        setFormData(prev => ({ ...prev, image: reader.result as string }));
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

  const handleOpenModal = (update?: Update) => {
    if (update) {
      setEditingUpdate(update);
      setFormData({
        title: update.title,
        content: update.content,
        type: update.type,
        image: update.image || "",
        imageTitle: update.imageTitle || "",
        imageLink: update.imageLink || "",
        imageLinkText: update.imageLinkText || "",
      });
    } else {
      setEditingUpdate(null);
      setFormData({
        title: "",
        content: "",
        type: 'announcement',
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
    setEditingUpdate(null);
    setIsUploading(false);
  };

  const handleSaveUpdate = async () => {
    if (!onSave || !formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    setIsUploading(true);
    try {
      const updatesList = updates || [];
      let updatedUpdates: Update[];

      if (editingUpdate) {
        // Update existing - match by title, date, and type (or _id if available)
        updatedUpdates = updatesList.map(update => {
          const isMatch = editingUpdate._id 
            ? update._id === editingUpdate._id
            : update.title === editingUpdate.title && 
              update.type === editingUpdate.type &&
              String(update.date) === String(editingUpdate.date);
          
          return isMatch
            ? {
                ...update,
                title: formData.title,
                content: formData.content,
                type: formData.type,
                image: formData.image || undefined,
                imageTitle: formData.imageTitle || undefined,
                imageLink: formData.imageLink || undefined,
                imageLinkText: formData.imageLinkText || undefined,
              }
            : update;
        });
      } else {
        // Add new
        const newUpdate: Update = {
          title: formData.title,
          content: formData.content,
          type: formData.type,
          date: new Date(),
          image: formData.image || undefined,
          imageTitle: formData.imageTitle || undefined,
          imageLink: formData.imageLink || undefined,
          imageLinkText: formData.imageLinkText || undefined,
        };
        updatedUpdates = [...updatesList, newUpdate];
      }

      await onSave("updates", updatedUpdates);
      setIsModalOpen(false);
      setEditingUpdate(null);
    } catch (error) {
      console.error("Error saving update:", error);
      alert("Failed to save update.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUpdate = async (updateToDelete: Update) => {
    if (!onSave) return;
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      const updatedUpdates = (updates || []).filter(update => {
        if (updateToDelete._id && update._id) {
          return update._id !== updateToDelete._id;
        }
        // Match by title, type, and date
        return !(
          update.title === updateToDelete.title &&
          update.type === updateToDelete.type &&
          String(update.date) === String(updateToDelete.date)
        );
      });
      await onSave("updates", updatedUpdates);
    } catch (error) {
      console.error("Error deleting update:", error);
      alert("Failed to delete update.");
    }
  };
  // Group updates by type
  const groupedUpdates = updates?.reduce((acc, update) => {
    const type = update.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(update);
    return acc;
  }, {} as Record<string, Update[]>);

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'release':
        return 'bg-green-100 text-green-800';
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'announcement':
        return 'bg-purple-100 text-purple-800';
      case 'roadmap':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-zinc-100 text-zinc-800';
    }
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'release':
        return 'Release';
      case 'feature':
        return 'Feature';
      case 'announcement':
        return 'Announcement';
      case 'roadmap':
        return 'Roadmap';
      default:
        return type;
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Updates Section */}
      {isSubSectionEnabled("updates-list") && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">Updates & Releases</h2>
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
                  onClick={() => handleOpenModal()}
                  className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:from-blue-700 hover:to-teal-700 transition-colors flex items-center justify-center shadow-sm"
                  title="Add update"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {updates && updates.length > 0 ? (
            <div className="space-y-8">
              {groupedUpdates && Object.entries(groupedUpdates)
                .sort(([a], [b]) => {
                  const order = ['release', 'feature', 'announcement', 'roadmap'];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map(([type, typeUpdates]) => (
                  <div key={type}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-zinc-900">
                        {type === 'release' ? 'Recent Releases' : 
                         type === 'feature' ? 'New Features' :
                         type === 'announcement' ? 'Announcements' : 'Roadmap Updates'}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(type)}`}>
                        {getTypeLabel(type)}
                      </span>
                    </div>
                <div className="space-y-4">
                  {typeUpdates
                    .sort((a, b) => {
                      const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
                      const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map((update, idx) => (
                      <div 
                        key={update._id || idx}
                        className="p-6 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-zinc-900 pr-4 mb-2">{update.title}</h3>
                            {isEditable && isEditMode && (
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => handleOpenModal(update)}
                                  className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUpdate(update)}
                                  className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-sm text-zinc-500 whitespace-nowrap">
                              {formatDate(update.date)}
                            </span>
                            {update.linkedinPosted && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded whitespace-nowrap">
                                ✓ LinkedIn
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Image Display */}
                        {update.image && (
                          <div className="mb-4 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden w-80">
                            {update.imageTitle && (
                              <div className="px-4 pt-4 pb-2">
                                <h4 className="text-base font-semibold text-zinc-900">{update.imageTitle}</h4>
                              </div>
                            )}
                            <div className="relative group aspect-square w-full">
                              <img
                                src={update.image}
                                alt={update.imageTitle || "Update image"}
                                className="w-full h-full object-contain bg-zinc-50"
                              />
                            </div>
                            {(update.imageLink || update.imageLinkText) && (
                              <div className="px-4 pb-4 pt-2">
                                {update.imageLinkText && (
                                  <p className="text-sm text-zinc-600 mb-1">{update.imageLinkText}</p>
                                )}
                                {update.imageLink && (
                                  <a
                                    href={update.imageLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    {update.imageLink}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className="text-zinc-700 whitespace-pre-line leading-relaxed">{update.content}</p>
                      </div>
                    ))}
                  </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm italic">No updates available yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Future Roadmap Section */}
      {isSubSectionEnabled("roadmap") && futureRoadmap && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Future Roadmap</h2>
          <div className="p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-lg border border-zinc-200">
            <p className="text-zinc-700 whitespace-pre-line leading-relaxed">{futureRoadmap}</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/30 backdrop-blur-md flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {editingUpdate ? "Edit Update" : "Add Update"}
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter update title..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="release">Release</option>
                    <option value="feature">Feature</option>
                    <option value="announcement">Announcement</option>
                    <option value="roadmap">Roadmap</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter update content..."
                    rows={6}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">Image (Optional)</label>
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

                {/* Image Title */}
                {formData.image && (
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Image Title</label>
                    <input
                      type="text"
                      value={formData.imageTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageTitle: e.target.value }))}
                      placeholder="Enter image title..."
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Description/Link Text */}
                {formData.image && (
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Description/Subtitle</label>
                    <textarea
                      value={formData.imageLinkText}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageLinkText: e.target.value }))}
                      placeholder="Enter description/subtitle..."
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    />
                  </div>
                )}

                {/* Link URL */}
                {formData.image && (
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
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveUpdate}
                    disabled={!formData.title || !formData.content || isUploading}
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

