"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

interface IntegrationMultiSelectProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const IntegrationMultiSelect = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Search and select integrations...",
  className = "",
}: IntegrationMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to top when dropdown opens
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    if (selectedValues.includes(option)) {
      onSelectionChange(selectedValues.filter((v) => v !== option));
    } else {
      onSelectionChange([...selectedValues, option]);
    }
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleRemove = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange(selectedValues.filter((v) => v !== option));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div
        className={`
          w-full min-h-[48px] px-4 py-2 bg-white border rounded-xl
          flex items-center gap-2 cursor-text
          transition-all duration-200
          ${isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-zinc-300 hover:border-zinc-400"}
        `}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className="flex flex-wrap gap-2 items-center flex-1 min-h-[28px]">
          {/* Selected Tags */}
          {selectedValues.map((selected) => (
            <span
              key={selected}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200"
            >
              {selected}
              <button
                type="button"
                onClick={(e) => handleRemove(selected, e)}
                className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${selected}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedValues.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent"
          />
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 pointer-events-none transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No integrations found matching "{searchQuery}"
            </div>
          ) : (
            <div className="py-2">
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`
                      px-4 py-2.5 cursor-pointer transition-colors
                      flex items-center gap-3
                      ${isSelected ? "bg-blue-50 text-blue-900" : "hover:bg-zinc-50 text-zinc-900"}
                    `}
                  >
                    <div
                      className={`
                        w-4 h-4 rounded border-2 flex items-center justify-center
                        ${isSelected ? "bg-blue-600 border-blue-600" : "border-zinc-300"}
                      `}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium flex-1">{option}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

