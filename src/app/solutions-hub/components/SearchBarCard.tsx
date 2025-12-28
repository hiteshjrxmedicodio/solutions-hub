import { SolutionsSearchBar } from "./SolutionsSearchBar";

interface SearchBarCardProps {
  cols: number;
  rows: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function SearchBarCard({ cols, rows, searchValue, onSearchChange }: SearchBarCardProps) {
  // Center the search bar: 12 columns total, 8 columns wide = start at column 3 (3-10)
  const startCol = Math.floor((12 - cols) / 2) + 1;
  
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
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500">
            Astro Vault
          </p>
          <h1 className="text-4xl font-light sm:text-5xl text-zinc-900">What can I help with?</h1>
        </div>
        <SolutionsSearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </article>
  );
}

