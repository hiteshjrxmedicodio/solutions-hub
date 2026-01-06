import { SolutionsSearchBar } from "./SolutionsSearchBar";
import { Dropdown, DropdownOption } from "@/components/ui/Dropdown";

interface FilterState {
  category: string | null;
  companyType: string | null;
  integration: string | null;
  specialty: string | null;
}

interface FilterOptions {
  categories: string[];
  companyTypes: string[];
  integrations: string[];
  specialties: string[];
}

interface SearchBarCardProps {
  cols: number;
  rows: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFilterChange: (filterKey: keyof FilterState, value: string | null) => void;
  filterOptions: FilterOptions;
}

export function SearchBarCard({ 
  cols, 
  rows, 
  searchValue, 
  onSearchChange, 
  filters,
  onFilterChange,
  filterOptions
}: SearchBarCardProps) {
  // Center the search bar: 12 columns total, 8 columns wide = start at column 3 (3-10)
  const startCol = Math.floor((12 - cols) / 2) + 1;
  
  const FilterDropdown = ({ 
    label, 
    value, 
    options, 
    onChange 
  }: { 
    label: string; 
    value: string | null; 
    options: string[]; 
    onChange: (value: string | null) => void;
  }) => {
    if (options.length === 0) return null;
    
    // Add "All", "None" options at the beginning with proper labels
    const allOptions: DropdownOption[] = [
      { value: "", label: `All ${label}s` },
      { value: "none", label: "None" },
      ...options.map(opt => ({ value: opt, label: opt }))
    ];
    
    // Convert "none" value to null for state management
    const handleChange = (val: string) => {
      if (val === "none") {
        onChange(null);
      } else {
        onChange(val || null);
      }
    };
    
    // Convert null to "none" for display
    const displayValue = value === null ? "none" : (value || "");
    
    return (
      <div className="flex flex-col gap-1.5 items-center">
        <label className="text-xs font-medium text-zinc-600 uppercase tracking-wide text-center">
          {label}
        </label>
        <div className="w-[127px] [&>div>button]:rounded-full [&>div>div]:rounded-full">
          <Dropdown
            value={displayValue}
            onChange={handleChange}
            options={allOptions}
            placeholder={`All ${label}s`}
            className="w-full"
          />
        </div>
      </div>
    );
  };
  
  return (
    <article
      id="search-bar-card"
      className="group relative flex flex-col items-center justify-center border border-zinc-600 bg-white p-10 transition-all duration-500 hover:bg-zinc-50"
      style={{
        gridColumnStart: startCol,
        gridColumnEnd: startCol + cols,
        gridRow: `span ${rows}`,
        width: "100%",
        height: "100%",
        minHeight: "100%",
        overflow: "visible",
        boxSizing: "border-box",
      }}
    >
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-[32.4px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
            Solution Hub
          </p>
        </div>
        <SolutionsSearchBar value={searchValue} onChange={onSearchChange} />
        
        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-end justify-center gap-6 w-full max-w-4xl mt-4">
          <FilterDropdown
            label="Category"
            value={filters.category}
            options={filterOptions.categories}
            onChange={(value) => onFilterChange('category', value)}
          />
          <FilterDropdown
            label="Company Type"
            value={filters.companyType}
            options={filterOptions.companyTypes}
            onChange={(value) => onFilterChange('companyType', value)}
          />
          <FilterDropdown
            label="Integration"
            value={filters.integration}
            options={filterOptions.integrations}
            onChange={(value) => onFilterChange('integration', value)}
          />
          <FilterDropdown
            label="Specialty"
            value={filters.specialty}
            options={filterOptions.specialties}
            onChange={(value) => onFilterChange('specialty', value)}
          />
          
          {/* Clear All Filters Button */}
          {(filters.category || filters.companyType || 
            filters.integration || filters.specialty) && (
            <button
              type="button"
              onClick={() => {
                onFilterChange('category', null);
                onFilterChange('companyType', null);
                onFilterChange('integration', null);
                onFilterChange('specialty', null);
              }}
              className="px-4 py-2 text-sm font-medium text-zinc-700 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 transition-all"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

