"use client";

import React from "react";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  category?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budgetRange?: string;
  timeline?: string;
  proposalsCount?: number;
  viewsCount?: number;
  status: string;
  createdAt: string;
  userId?: string;
  currentUserId?: string;
  userEmail?: string;
  userRole?: string;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: string) => void;
}

const priorityColors = {
  low: 'bg-blue-50 text-blue-700 border-blue-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
};

export function ListingCard({
  id,
  title,
  description,
  category = [],
  priority,
  budgetRange,
  timeline,
  proposalsCount = 0,
  viewsCount = 0,
  status,
  createdAt,
  userId,
  currentUserId,
  userEmail,
  userRole,
  onClick,
  onEdit,
  onDelete,
  onToggleStatus,
}: ListingCardProps) {
  const [isToggling, setIsToggling] = React.useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleStatus || isToggling) return;
    
    setIsToggling(true);
    try {
      // Toggle between 'active' and 'draft' (inactive)
      const newStatus = status === 'active' ? 'draft' : 'active';
      await onToggleStatus(id, newStatus);
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Check if current user is the owner (customer)
  // Edit/Delete is ONLY for customers who created the listing (not vendors, not superadmins)
  const isOwner = userId === currentUserId && userRole === "customer";
  const canEditOrDelete = isOwner && userRole === "customer";
  // Toggle status is ONLY for customers who created the listing (not vendors, not superadmins)
  const canToggleStatus = isOwner && userRole === "customer";
  const isActive = status === 'active';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-xl hover:border-zinc-300 transition-all duration-200 cursor-pointer h-full flex flex-col hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <h3 className="text-lg font-bold text-zinc-900 flex-1 line-clamp-2 group-hover:text-zinc-700 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEditOrDelete && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleEdit}
                className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600 hover:text-zinc-900"
                title="Edit listing"
                aria-label="Edit listing"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-zinc-600 hover:text-red-600"
                title="Delete listing"
                aria-label="Delete listing"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex-shrink-0 capitalize ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-zinc-600 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
        {description}
      </p>
      
      {/* Categories */}
      {category.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {category.slice(0, 3).map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              {cat}
            </span>
          ))}
          {category.length > 3 && (
            <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-200">
              +{category.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 font-medium text-xs">{formatDate(createdAt)}</span>
          {/* Active/Inactive Toggle - Only for customer owners (not vendors, not superadmins), in bottom right corner */}
          {canToggleStatus && (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-zinc-500'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  isActive
                    ? 'bg-green-500'
                    : 'bg-zinc-300'
                } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={isActive ? 'Click to deactivate' : 'Click to activate'}
                aria-label={isActive ? 'Deactivate listing' : 'Activate listing'}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

