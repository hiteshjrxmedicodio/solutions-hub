"use client";

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
  onClick?: (id: string) => void;
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
  onClick,
}: ListingCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };
  
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
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900 flex-1 line-clamp-2 group-hover:text-zinc-700 transition-colors pr-2">
          {title}
        </h3>
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex-shrink-0 capitalize ${priorityColors[priority]}`}>
          {priority}
        </span>
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
              className="px-2.5 py-1 bg-zinc-50 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200 hover:bg-zinc-100 transition-colors"
            >
              {cat}
            </span>
          ))}
          {category.length > 3 && (
            <span className="px-2.5 py-1 bg-zinc-50 text-zinc-600 rounded-md text-xs font-medium border border-zinc-200">
              +{category.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 flex-wrap">
            {budgetRange && budgetRange !== 'Not specified' && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {budgetRange}
              </span>
            )}
            {timeline && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeline}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium">{formatDate(createdAt)}</span>
          <div className="flex items-center gap-4">
            {proposalsCount > 0 && (
              <span className="flex items-center gap-1.5 text-zinc-600 font-medium">
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {proposalsCount}
              </span>
            )}
            {viewsCount > 0 && (
              <span className="flex items-center gap-1.5 text-zinc-600 font-medium">
                <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {viewsCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

