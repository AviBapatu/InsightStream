/**
 * Input Component
 *
 * A reusable text input component that adapts to the current theme.
 * Provides consistent styling, error handling, and label support across the app.
 *
 * Features:
 * - Theme-aware styling using CSS custom properties
 * - Label and helper text support
 * - Error state with error message display
 * - Icon support (left or right)
 * - Multiple sizes: sm, md, lg
 * - Full width option
 * - All standard input types supported
 *
 * @example
 * // Basic input with label
 * <Input
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 *
 * // Input with error
 * <Input
 *   label="Password"
 *   type="password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   error="Password must be at least 8 characters"
 * />
 *
 * // Input with icon
 * <Input
 *   label="Search"
 *   icon={<SearchIcon />}
 *   iconPosition="left"
 *   placeholder="Search articles..."
 * />
 */

import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      value,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      error,
      helperText,
      icon,
      iconPosition = "left",
      size = "md",
      fullWidth = false,
      disabled = false,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    // Size-specific styles
    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-3 text-base",
    };

    // Base input styles
    const inputBaseStyles = `
    w-full rounded-full border transition-all duration-200
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeStyles[size]}
    ${icon && iconPosition === "left" ? "pl-10" : ""}
    ${icon && iconPosition === "right" ? "pr-10" : ""}
    ${error ? "border-red-500 focus:ring-red-200" : ""}
    ${className}
  `;

    // Handle focus to apply theme colors
    const handleFocus = (e) => {
      if (!error) {
        e.currentTarget.style.borderColor = "var(--color-primary-600)";
        e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-primary-100)";
      }
      onFocus?.(e);
    };

    // Handle blur to remove focus styles
    const handleBlur = (e) => {
      e.currentTarget.style.borderColor = "var(--color-border)";
      e.currentTarget.style.boxShadow = "none";
      onBlur?.(e);
    };

    // Get default styles for the input
    const getInputStyles = () => ({
      backgroundColor: "var(--color-card)",
      borderColor: error ? "#ef4444" : "var(--color-border)",
      color: "var(--color-text-primary)",
    });

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {/* Label - shown above the input if provided */}
        {label && (
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper - for positioning icon */}
        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === "left" && (
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {icon}
            </div>
          )}

          {/* The actual input element */}
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={inputBaseStyles}
            style={getInputStyles()}
            {...props}
          />

          {/* Right icon */}
          {icon && iconPosition === "right" && (
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Helper text or error message - shown below the input */}
        {(helperText || error) && (
          <p
            className={`text-xs mt-1 ${error ? "text-red-500" : ""}`}
            style={!error ? { color: "var(--color-text-tertiary)" } : {}}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

// Display name for debugging
Input.displayName = "Input";

// PropTypes for type checking and documentation
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
