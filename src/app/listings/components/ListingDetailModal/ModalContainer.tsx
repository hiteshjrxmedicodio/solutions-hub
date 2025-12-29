"use client";

import { useEffect, useRef } from "react";

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * ModalContainer Component
 * 
 * A reusable modal container with:
 * - Backdrop blur effect
 * - Smooth animations
 * - Focus trap for accessibility
 * - Click-outside-to-close functionality
 * - ARIA attributes for screen readers
 */
export function ModalContainer({ isOpen, onClose, children }: ModalContainerProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap: Focus first focusable element when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with Blur */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Bottom Sheet Modal - 70% width, 90% height, centered */}
      <div
        ref={modalRef}
        className={`absolute bottom-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '70%',
          left: '15%',
          right: '15%',
          height: '90vh',
          maxHeight: '90vh'
        }}
      >
        {/* Drag Handle - Optional for full viewport */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0" aria-hidden="true">
          <div className="w-12 h-1.5 bg-zinc-300 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
          aria-label="Close modal"
          type="button"
        >
          <svg
            className="w-6 h-6 text-zinc-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content Container - Full height with equal padding */}
        <div className="flex-1 flex overflow-y-auto min-h-0">
          {/* Main Content */}
          <div className="flex-1 px-5 pt-5 w-full">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

