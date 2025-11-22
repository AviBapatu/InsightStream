/**
 * PageContainer Component
 *
 * A layout component that provides consistent page structure and spacing.
 * This ensures all pages in the app have the same max-width, padding, and
 * background styling according to the current theme.
 *
 * Features:
 * - Theme-aware background color
 * - Responsive max-width and padding
 * - Minimum height to fill viewport
 * - Optional centered content
 * - Optional custom max-width
 *
 * @example
 * // Basic page container
 * <PageContainer>
 *   <h1>Page Title</h1>
 *   <p>Page content...</p>
 * </PageContainer>
 *
 * // Centered content with custom max-width
 * <PageContainer maxWidth="4xl" centered>
 *   <div>Centered content</div>
 * </PageContainer>
 */

import React from "react";
import PropTypes from "prop-types";

const PageContainer = ({
  children,
  maxWidth = "7xl",
  centered = false,
  noPadding = false,
  className = "",
}) => {
  // Max width options (using Tailwind conventions)
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  // Base container styles
  const containerStyles = `
    min-h-screen
    ${maxWidthClasses[maxWidth]}
    mx-auto
    ${noPadding ? "" : "px-4 py-8 lg:py-12"}
    ${centered ? "flex items-center justify-center" : ""}
    ${className}
  `;

  return (
    <div
      className={containerStyles}
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {children}
    </div>
  );
};

// PropTypes for type checking and documentation
PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf([
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "full",
  ]),
  centered: PropTypes.bool,
  noPadding: PropTypes.bool,
  className: PropTypes.string,
};

export default PageContainer;
