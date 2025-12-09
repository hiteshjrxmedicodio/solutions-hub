"use client";

interface NavigationBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationBar({ isOpen, onClose }: NavigationBarProps) {
  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Horizontal Navigation Bar - Centrally Positioned */}
      <nav
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-8 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4 px-6 py-4 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800">
          {/* Planet Icon Button */}
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-900 hover:bg-zinc-50 transition-colors shrink-0"
            aria-label="Close navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-zinc-900"
            >
              {/* Planet with ring (Saturn-like) */}
              <circle cx="12" cy="10" r="3.5" fill="currentColor" />
              <ellipse cx="12" cy="10" rx="5.5" ry="1.2" fill="none" stroke="currentColor" />
            </svg>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 px-4">
            <a
              href="/solutions-hub"
              className="text-white hover:text-zinc-300 transition-colors font-medium text-sm"
              onClick={onClose}
            >
              Work
            </a>
            <a
              href="#"
              className="text-white hover:text-zinc-300 transition-colors font-medium text-sm"
              onClick={onClose}
            >
              About
            </a>
            <a
              href="#"
              className="text-white hover:text-zinc-300 transition-colors font-medium text-sm"
              onClick={onClose}
            >
              Playground
            </a>
            <a
              href="#"
              className="text-white hover:text-zinc-300 transition-colors font-medium text-sm"
              onClick={onClose}
            >
              Resource
            </a>
          </div>

          {/* Email Field */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-zinc-300 min-w-[200px]">
            <span className="text-zinc-900 text-sm font-medium">ihyaet@gmail.com</span>
          </div>
        </div>
      </nav>
    </>
  );
}

