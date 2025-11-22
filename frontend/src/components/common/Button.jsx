/**
 * Button Component
 *
 * A reusable button component that adapts to the current theme and provides
 * different variants for various use cases throughout the application.
 *
 * Features:
 * - Theme-aware styling using CSS custom properties
 * - Multiple variants: primary, secondary, outline, danger, ghost
 * - Multiple sizes: sm, md, lg
 * - Loading state with spinner
 * - Full width option
 * - Disabled state handling
 * - Icon support (left or right)
 *
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * // Button with loading state
 * <Button variant="primary" isLoading={true}>
 *   Saving...
 * </Button>
 *
 * // Button with icon
 * <Button variant="outline" icon={<SaveIcon />} iconPosition="left">
 *   Save
 * </Button>
 */

import React from "react";
import PropTypes from "prop-types";

// Loading spinner component used in buttons
const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
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
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = "left",
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  // Base styles that apply to all buttons
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size-specific styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant-specific styles using CSS custom properties for theme support
  const variantStyles = {
    primary: "text-white",
    secondary: "border-2",
    outline: "border-2 bg-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent hover:bg-opacity-10",
  };

  // Combine all classes
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  // Dynamic inline styles for theme-aware colors
  const getButtonStyles = () => {
    if (variant === "primary") {
      return {
        backgroundColor: "var(--color-primary-700)",
      };
    } else if (variant === "secondary") {
      return {
        borderColor: "var(--color-border)",
        color: "var(--color-text-secondary)",
        backgroundColor: "transparent",
      };
    } else if (variant === "outline") {
      return {
        borderColor: "var(--color-primary-600)",
        color: "var(--color-primary-700)",
      };
    } else if (variant === "ghost") {
      return {
        color: "var(--color-text-secondary)",
      };
    }
    return {};
  };

  // Handle hover effects
  const handleMouseEnter = (e) => {
    if (disabled || isLoading) return;

    if (variant === "primary") {
      e.currentTarget.style.backgroundColor = "var(--color-primary-800)";
    } else if (variant === "secondary") {
      e.currentTarget.style.backgroundColor =
        "var(--color-background-secondary)";
    } else if (variant === "outline") {
      e.currentTarget.style.backgroundColor = "var(--color-primary-50)";
    } else if (variant === "ghost") {
      e.currentTarget.style.backgroundColor =
        "var(--color-background-secondary)";
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled || isLoading) return;

    if (variant === "primary") {
      e.currentTarget.style.backgroundColor = "var(--color-primary-700)";
    } else if (
      variant === "secondary" ||
      variant === "outline" ||
      variant === "ghost"
    ) {
      e.currentTarget.style.backgroundColor = "transparent";
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      style={getButtonStyles()}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Show spinner when loading */}
      {isLoading && <Spinner size={size} />}

      {/* Show icon on the left if specified */}
      {!isLoading && icon && iconPosition === "left" && icon}

      {/* Button text/children */}
      {children}

      {/* Show icon on the right if specified */}
      {!isLoading && icon && iconPosition === "right" && icon}
    </button>
  );
};

// PropTypes for type checking and documentation
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "danger",
    "ghost",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;
