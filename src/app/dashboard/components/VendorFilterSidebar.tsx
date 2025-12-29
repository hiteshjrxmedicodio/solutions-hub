"use client";

import { DashboardCard } from "./DashboardCard";

interface VendorFilterSidebarProps {
  productName: string;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function VendorFilterSidebar({
  productName,
  categories,
  selectedCategory,
  onCategoryChange,
}: VendorFilterSidebarProps) {
  return (
    <DashboardCard className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Filters</h3>
      
      {/* Product Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-900 mb-2">Product</label>
        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-sm font-medium text-zinc-900">{productName}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
        >
          <option value="all">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </DashboardCard>
  );
}

