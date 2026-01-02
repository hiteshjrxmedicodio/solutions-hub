"use client";

import { forwardRef, useEffect, useRef } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, required, error, hint, className = "", children }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col ${className}`}>
        <div className="mb-1.5">
          <label className="block text-sm font-medium text-zinc-900 leading-5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        <div className="flex-1">
          {children}
        </div>
        {error && (
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 text-sm text-zinc-900 bg-white border rounded-xl
          transition-all duration-200 ease-in-out
          placeholder:text-zinc-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-zinc-400
          disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-zinc-300"}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", autoResize = false, value, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      const textarea = internalRef.current;
      if (autoResize && textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Set height based on scrollHeight, with a minimum height
        const minHeight = 120; // Minimum height in pixels (approximately 3 rows)
        const maxHeight = 600; // Maximum height in pixels to prevent it from getting too large
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value, autoResize]);

    // Combine refs: use the forwarded ref if provided, otherwise use internal ref
    const setRef = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
      }
    };

    return (
      <textarea
        ref={setRef}
        className={`
          w-full px-4 py-3 text-sm text-zinc-900 bg-white border rounded-xl
          transition-all duration-200 ease-in-out
          placeholder:text-zinc-400 ${autoResize ? 'resize-none' : 'resize-y'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-zinc-400
          disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed
          ${autoResize ? 'overflow-y-auto' : ''}
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-zinc-300"}
          ${className}
        `}
        value={value}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

