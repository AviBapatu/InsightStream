/**
 * Badge Component
 *
 * A small label component used to display status, categories, counts, or other
 * supplementary information. Badges are commonly used in UI to highlight or
 * categorize content with color-coded indicators.
 *
 * Features:
 * - Multiple variants (primary, success, warning, danger, info, neutral)
 * - Two sizes (sm, md)
 * - Rounded corners for modern look
 * - Optional icon support
 * - Optional remove/close button
 * - Full theme support using CSS variables
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 * <Badge variant="danger">Failed</Badge>
 *
 * @example
 * // With icon
 * <Badge variant="primary" icon={<StarIcon />}>
 *   Premium
 * </Badge>
 *
 * @example
 * // Removable badge
 * <Badge variant="info" onRemove={() => console.log('Removed')}>
 *   Tag Name
 * </Badge>
 */

import React from "react";
import PropTypes from "prop-types";

const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  icon,
  onRemove,
  className = "",
}) => {
  // Size styles - controls padding and text size
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  // Variant styles - different colors for different purposes
  const variantStyles = {
    primary: {
      backgroundColor: "var(--color-primary-100)",
      color: "var(--color-primary-700)",
      border: "1px solid var(--color-primary-200)",
    },
    success: {
      backgroundColor: "var(--color-success-100)",
      color: "var(--color-success-700)",
      border: "1px solid var(--color-success-200)",
    },
    warning: {
      backgroundColor: "var(--color-warning-100)",
      color: "var(--color-warning-700)",
      border: "1px solid var(--color-warning-200)",
    },
    danger: {
      backgroundColor: "var(--color-danger-100)",
      color: "var(--color-danger-700)",
      border: "1px solid var(--color-danger-200)",
    },
    info: {
      backgroundColor: "var(--color-info-100)",
      color: "var(--color-info-700)",
      border: "1px solid var(--color-info-200)",
    },
    neutral: {
      backgroundColor: "var(--color-muted)",
      color: "var(--color-text-primary)",
      border: "1px solid var(--color-border)",
    },
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeStyles[size]} ${className}`}
      style={variantStyles[variant]}
    >
      {/* Optional icon on the left */}
      {icon && <span className="inline-flex items-center">{icon}</span>}

      {/* Badge content */}
      <span>{children}</span>

      {/* Optional remove button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center ml-1 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          {/* X icon for remove button */}
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// PropTypes for type checking and documentation
Badge.propTypes = {
  /** Content to display in the badge */
  children: PropTypes.node.isRequired,
  /** Visual style variant */
  variant: PropTypes.oneOf([
    "primary",
    "success",
    "warning",
    "danger",
    "info",
    "neutral",
  ]),
  /** Size of the badge */
  size: PropTypes.oneOf(["sm", "md"]),
  /** Optional icon to display before the text */
  icon: PropTypes.node,
  /** Function to call when remove button is clicked */
  onRemove: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Badge;
