interface SolutionsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SolutionsSearchBar({ value, onChange }: SolutionsSearchBarProps) {
  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center gap-4 rounded-full border border-zinc-200 bg-zinc-50 px-5 py-4 shadow-[0_15px_40px_-20px_rgba(15,23,42,0.4)]">
        <button
          type="button"
          aria-label="Voice search"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <path d="M12 3a3 3 0 0 0-3 3v4a3 3 0 1 0 6 0V6a3 3 0 0 0-3-3Z" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <path d="M12 18v3" />
          </svg>
        </button>
        <input
          id="solutions-search"
          type="search"
          placeholder="Search you health care solutions"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-lg font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Ask AI"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-medium transition hover:from-blue-700 hover:to-teal-700 whitespace-nowrap"
            >
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}

