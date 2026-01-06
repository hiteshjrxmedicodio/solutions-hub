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
    <>
      {/* Backdrop with Blur - Full screen, outside container */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >

      {/* Bottom Sheet Modal - 70% width, 90% height, centered */}
      <div
        ref={modalRef}
        className={`absolute bottom-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out flex flex-col pointer-events-auto ${
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

        {/* Content Container - Full height with equal padding */}
        <div className="flex-1 flex overflow-y-auto min-h-0">
          {/* Main Content */}
          <div className="flex-1 p-5 w-full pb-8">
            <div className="w-full min-h-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

