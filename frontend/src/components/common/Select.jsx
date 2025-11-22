/**
 * Select Component
 *
 * A custom styled select dropdown that's fully theme-aware and interactive.
 * Perfect for language, country, and other option selections.
 *
 * Features:
 * - Theme-aware colors (adapts to light/dark themes)
 * - Custom icon support (flag emojis, icons, etc.)
 * - Hover and focus states
 * - Error state styling
 * - Optional left icon
 * - Disabled state
 * - Full keyboard accessibility
 *
 * @example
 * // Basic select
 * <Select
 *   value={selected}
 *   onChange={(e) => setSelected(e.target.value)}
 *   options={[
 *     { value: 'en', label: 'English', icon: '🇬🇧' },
 *     { value: 'es', label: 'Spanish', icon: '🇪🇸' },
 *   ]}
 * />
 *
 * // With error state
 * <Select
 *   value={country}
 *   onChange={handleChange}
 *   options={countries}
 *   error={error}
 *   placeholder="Select a country"
 * />
 */

import React from "react";
import PropTypes from "prop-types";

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  disabled = false,
  leftIcon = null,
  className = "",
}) => {
  // Base styles with theme colors
  const baseStyles = `
    w-full
    px-4
    py-3
    rounded-lg
    border
    font-medium
    transition-all
    duration-200
    outline-none
    appearance-none
    cursor-pointer
    ${leftIcon ? "pl-12" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
    ${className}
  `;

  // Dynamic border and background colors
  const getBorderColor = () => {
    if (error) return "var(--color-danger-500)";
    return "var(--color-border)";
  };

  const getBackgroundColor = () => {
    return "var(--color-card)";
  };

  const getTextColor = () => {
    if (!value) return "var(--color-text-secondary)";
    return "var(--color-text-primary)";
  };

  return (
    <div className="relative">
      {/* Left Icon */}
      {leftIcon && (
        <div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl pointer-events-none"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {leftIcon}
        </div>
      )}

      {/* Select Dropdown */}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={baseStyles}
        style={{
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem",
        }}
      >
        {/* Placeholder option */}
        <option value="" disabled>
          {placeholder}
        </option>

        {/* Options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{
              backgroundColor: "var(--color-card)",
              color: "var(--color-text-primary)",
            }}
          >
            {option.icon ? `${option.icon} ${option.label}` : option.label}
          </option>
        ))}
      </select>

      {/* Dropdown Icon Overlay - Styled to match theme */}
      <div
        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Error Message */}
      {error && (
        <p
          className="text-xs mt-1 ml-1"
          style={{ color: "var(--color-danger-500)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// PropTypes for type checking
Select.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Select;
