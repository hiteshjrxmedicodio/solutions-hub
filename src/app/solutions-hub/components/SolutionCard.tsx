"use client";

import { useRouter } from "next/navigation";

interface SolutionCardProps {
  id: number;
  title: string;
  description: string;
  category?: string;
  cols: number;
  rows: number;
  userId?: string; // Vendor userId for navigation
  isBlank?: boolean;
}

export function SolutionCard({ id, title, description, category, cols, rows, userId, isBlank = false }: SolutionCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (!isBlank) {
      // If userId exists, navigate to vendor detail page, otherwise use solutions-hub detail
      if (userId) {
        router.push(`/vendor/${userId}`);
      } else {
      router.push(`/solutions-hub/${id}`);
      }
    }
  };
  // Constraint: Cards should be 20-25% of screen width or height
  // 20% of 12 columns = 2.4, 25% of 12 columns = 3
  // So allow 2-3 columns (16.67% to 25% width)
  // 20-25% of viewport height = 20-25vh, with rows at ~16.67vh, 1 row fits in range
  const MAX_COLS = 3; // 25% of 12 columns (max)
  const MIN_COLS = 2; // 16.67% of 12 columns (closer to 20%)
  const MAX_ROWS = 1; // ~16.67vh per row (fits in 20-25% range)
  
  // Ensure cols is in 20-25% range (2-3 columns)
  const maxCols = Math.max(MIN_COLS, Math.min(cols, MAX_COLS));
  // Ensure rows doesn't exceed 25% constraint
  const maxRows = Math.min(rows, MAX_ROWS);
  // Max height is 33.33vh (1/3 of viewport height)
  const isLarge = maxCols >= 3 || maxRows >= 1;
  
  return (
    <article
      data-cols={maxCols}
      onClick={handleClick}
      className={`group relative flex flex-col border border-zinc-600 bg-white transition-all duration-500 ${
        isBlank 
          ? "p-0" 
          : isLarge 
            ? "p-8 hover:bg-gradient-to-br hover:from-white hover:to-zinc-50 cursor-pointer" 
            : "p-6 hover:bg-zinc-50 cursor-pointer"
      }`}
      style={{
        gridColumn: `span ${maxCols}`,
        gridRow: `span ${maxRows}`,
        width: "100%",
        height: "100%",
        minHeight: "100%",
        maxHeight: "25vh", // Enforce 25% height constraint (20-25% range)
        overflow: "visible",
        boxSizing: "border-box",
      }}
    >
      <div className="flex flex-col h-full">
        {!isBlank && (
          <>
            {category && (
              <span className="mb-4 shrink-0 inline-block w-fit rounded-full bg-gradient-to-r from-zinc-50 to-zinc-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600 transition-colors group-hover:from-zinc-100 group-hover:to-zinc-200">
                {category}
              </span>
            )}
            <h3 className={`mb-4 shrink-0 font-semibold leading-tight text-zinc-900 transition-all group-hover:text-zinc-700 ${
              isLarge ? "text-2xl" : "text-xl"
            }`}>
              {title}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-zinc-600 break-words overflow-wrap-anywhere mt-1">{description}</p>
          </>
        )}
      </div>
      {!isBlank && (
        <>
          <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-12 translate-y-12 bg-gradient-to-br from-zinc-50/50 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-50/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {/* Arrow Icon - Appears on Hover */}
          <div className={`absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isLarge ? "bottom-8 right-8" : "bottom-6 right-6"
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-zinc-900"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </>
      )}
    </article>
  );
}

