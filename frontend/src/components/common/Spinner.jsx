/**
 * Loading Spinner Component
 *
 * A reusable loading spinner component for indicating loading states.
 * Can be used as a standalone loader or within other components.
 *
 * Features:
 * - Multiple sizes: xs, sm, md, lg, xl
 * - Multiple variants: primary, white, current (inherits text color)
 * - Optional text label
 * - Centered or inline display
 *
 * @example
 * // Basic spinner
 * <Spinner />
 *
 * // Large white spinner
 * <Spinner size="lg" variant="white" />
 *
 * // Spinner with text
 * <Spinner text="Loading..." />
 *
 * // Full page centered spinner
 * <Spinner size="xl" text="Loading data..." fullPage />
 */

import React from "react";
import PropTypes from "prop-types";

const Spinner = ({
  size = "md",
  variant = "primary",
  text = "",
  fullPage = false,
  className = "",
}) => {
  // Size classes for the spinner
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  // Get color based on variant
  const getColor = () => {
    if (variant === "white") return "text-white";
    if (variant === "current") return "text-current";
    return ""; // Will use inline style for primary
  };

  // Spinner SVG
  const spinnerSvg = (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${getColor()} ${className}`}
      style={variant === "primary" ? { color: "var(--color-primary-600)" } : {}}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // If full page, render centered
  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="flex flex-col items-center gap-3">
          {spinnerSvg}
          {text && (
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Regular inline spinner
  return (
    <div className="inline-flex items-center gap-2">
      {spinnerSvg}
      {text && (
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
Spinner.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  variant: PropTypes.oneOf(["primary", "white", "current"]),
  text: PropTypes.string,
  fullPage: PropTypes.bool,
  className: PropTypes.string,
};

export default Spinner;
