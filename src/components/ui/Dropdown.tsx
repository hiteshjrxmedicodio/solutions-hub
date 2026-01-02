"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[] | DropdownOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  name?: string;
  "data-field"?: string;
  searchable?: boolean;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  error = false,
  className = "",
  name,
  "data-field": dataField,
  searchable = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to DropdownOption format
  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  // Filter options based on search query
  const filteredOptions = searchable
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  // Find selected option
  const selectedOption = value ? normalizedOptions.find((opt) => opt.value === value) : null;

  // Define scrollToOption before it's used in useEffect
  const scrollToOption = useCallback((index: number) => {
    if (optionsRef.current) {
      const optionElement = optionsRef.current.children[index] as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, []);

  // Define handleSelect before it's used in useEffect
  const handleSelect = useCallback(
    (optionValue: string) => {
      const option = normalizedOptions.find((opt) => opt.value === optionValue);
      if (option && !option.disabled) {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery("");
        setFocusedIndex(-1);
      }
    },
    [onChange, normalizedOptions]
  );

  // Calculate position function
  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return { top: 0, left: 0, width: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    };
  }, []);

  // Update dropdown position synchronously when open (useLayoutEffect for immediate update)
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updatePosition = () => {
      const position = calculatePosition();
      setDropdownPosition(position);
    };

    // Calculate position immediately and synchronously
    updatePosition();
  }, [isOpen, calculatePosition]);

  // Update dropdown position on scroll/resize (useEffect for async updates)
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updatePosition = () => {
      const position = calculatePosition();
      setDropdownPosition(position);
    };

    // Update position on scroll and resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    
    // Also update when the modal content scrolls
    const scrollContainers = document.querySelectorAll('.form-content');
    scrollContainers.forEach(container => {
      container.addEventListener("scroll", updatePosition, true);
    });

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      scrollContainers.forEach(container => {
        container.removeEventListener("scroll", updatePosition, true);
      });
    };
  }, [isOpen, calculatePosition]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      // Use a small delay to avoid immediate closure when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      
      // Focus search input if searchable
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, searchable]);

  // Keyboard navigation (only for non-searchable dropdowns or when input is not focused)
  useEffect(() => {
    if (!isOpen || (searchable && searchInputRef.current === document.activeElement)) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
        setFocusedIndex(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
          scrollToOption(next);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
          scrollToOption(next);
          return next;
        });
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredOptions[focusedIndex].value);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, filteredOptions, scrollToOption, handleSelect, searchable]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      const willOpen = !isOpen;
      if (willOpen && containerRef.current) {
        // Calculate position immediately before opening
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
        // Set focus to selected option when opening
        const selectedIndex = filteredOptions.findIndex(
          (opt) => opt.value === value
        );
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      setIsOpen(willOpen);
    }
  }, [disabled, isOpen, filteredOptions, value]);

  const baseInputClasses = cn(
    "w-full px-4 py-3 text-left bg-white border rounded-lg",
    "flex items-center justify-between gap-3",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    error
      ? "border-red-500 focus:ring-red-500"
      : "border-zinc-300 focus:ring-blue-500 hover:border-zinc-400",
    disabled && "opacity-50 cursor-not-allowed",
    isOpen && "border-blue-500 ring-2 ring-blue-200"
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
      {isOpen && searchable ? (
        <div className={baseInputClasses}>
          <input
            ref={searchInputRef}
            type="text"
            name={name}
            data-field={dataField}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFocusedIndex(-1);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent border-0 outline-none text-sm text-zinc-900 placeholder:text-zinc-500"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
                setSearchQuery("");
                setFocusedIndex(-1);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIndex((prev) => {
                  const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
                  scrollToOption(next);
                  return next;
                });
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIndex((prev) => {
                  const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
                  scrollToOption(next);
                  return next;
                });
              } else if (e.key === "Enter" && focusedIndex >= 0) {
                e.preventDefault();
                handleSelect(filteredOptions[focusedIndex].value);
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setSearchQuery("");
              setFocusedIndex(-1);
            }}
            className="flex-shrink-0 p-1 hover:bg-zinc-100 rounded transition-colors"
            aria-label="Close dropdown"
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 text-zinc-400 transition-transform duration-200",
                "transform rotate-180"
              )}
            />
          </button>
        </div>
      ) : (
        <button
          type="button"
          name={name}
          data-field={dataField}
          onClick={handleToggle}
          disabled={disabled}
          className={baseInputClasses}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={placeholder}
        >
          <span
            className={cn(
              "flex-1 truncate text-sm",
              value ? "text-zinc-900 font-medium" : "text-zinc-500"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0",
              isOpen && "transform rotate-180"
            )}
          />
        </button>
      )}

      {isOpen && containerRef.current && (typeof window !== "undefined" ? createPortal(
        <div
          ref={dropdownRef}
          className={cn(
            "fixed z-[9999] bg-white border border-zinc-200 rounded-lg shadow-xl",
            "overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
          )}
          role="listbox"
          style={{ 
            maxHeight: "16rem",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >

          <div
            ref={optionsRef}
            className={cn(
              "overflow-y-auto custom-scrollbar",
              searchable ? "max-h-[13rem]" : "max-h-64"
            )}
            style={{ scrollbarWidth: "thin" }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-zinc-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;
                const isDisabled = option.disabled;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    disabled={isDisabled}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm transition-colors",
                      "flex items-center justify-between gap-3",
                      "first:rounded-t-lg last:rounded-b-lg",
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : isFocused
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-700 hover:bg-zinc-50",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
        , document.body
      ) : null)}
    </div>
  );
}

