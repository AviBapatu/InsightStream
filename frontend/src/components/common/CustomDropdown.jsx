/**
 * CustomDropdown Component
 *
 * A beautiful, themed dropdown component with flag/icon support and smooth animations.
 * Perfect for country, language, or any option selection with visual indicators.
 *
 * Features:
 * - Theme-aware colors (adapts to light/dark themes)
 * - Flag/icon support in options
 * - Active state indicator bar
 * - Checkmark on selected option
 * - Click outside to close
 * - Smooth animations
 * - Keyboard accessible
 *
 * @example
 * // Basic usage with countries
 * <CustomDropdown
 *   value={selectedCountry}
 *   options={[
 *     { code: 'us', name: 'United States', flag: '🇺🇸' },
 *     { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
 *   ]}
 *   onChange={(code) => setSelectedCountry(code)}
 *   placeholder="Select a country"
 * />
 *
 * // With custom styling
 * <CustomDropdown
 *   value={language}
 *   options={languages}
 *   onChange={handleLanguageChange}
 *   className="max-w-md"
 * />
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const CustomDropdown = ({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find the currently selected option to display
  const selectedOption = options.find((opt) => opt.code === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Close on Escape key
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Handle option selection
  const handleSelect = (optionCode) => {
    onChange(optionCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded-full flex items-center justify-between focus:outline-none transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : isOpen
            ? "ring-2 shadow-md"
            : "hover:shadow-sm"
        }`}
        style={{
          backgroundColor: disabled
            ? "var(--color-muted)"
            : "var(--color-card)",
          borderColor: isOpen
            ? "var(--color-primary-600)"
            : "var(--color-border)",
          color: "var(--color-text-primary)",
          ...(isOpen && {
            boxShadow: `0 0 0 2px var(--color-primary-100)`,
          }),
        }}
      >
        <span className="flex items-center gap-2.5">
          {selectedOption?.flag && (
            <span className="text-lg">{selectedOption.flag}</span>
          )}
          <span
            className="font-medium text-sm"
            style={{
              color: selectedOption?.name
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
            }}
          >
            {selectedOption?.name || placeholder}
          </span>
        </span>
        <svg
          className={`w-5 h-5 transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{
            color: isOpen
              ? "var(--color-primary-600)"
              : "var(--color-text-secondary)",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-full border rounded-xl shadow-2xl max-h-64 overflow-hidden"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div
            className="overflow-y-auto max-h-64 py-1"
            style={{ backgroundColor: "var(--color-card)" }}
          >
            {options.map((option, index) => {
              const isSelected = value === option.code;
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleSelect(option.code)}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-150 text-left relative ${
                    index !== 0 ? "border-t" : ""
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--color-primary-100)"
                      : "transparent",
                    borderColor: "var(--color-border)",
                    color: isSelected
                      ? "var(--color-primary-700)"
                      : "var(--color-text-primary)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-muted)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: "var(--color-primary-600)" }}
                    />
                  )}

                  {option.flag && (
                    <span className="text-xl ml-2">{option.flag}</span>
                  )}
                  <span className="font-medium text-sm flex-1">
                    {option.name}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ color: "var(--color-primary-600)" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
CustomDropdown.propTypes = {
  /** Current selected value (matches option.code) */
  value: PropTypes.string.isRequired,
  /** Array of options with code, name, and optional flag */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      flag: PropTypes.string,
    })
  ).isRequired,
  /** Function called when an option is selected, receives option.code */
  onChange: PropTypes.func.isRequired,
  /** Placeholder text when no option is selected */
  placeholder: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Whether the dropdown is disabled */
  disabled: PropTypes.bool,
};

export default CustomDropdown;
