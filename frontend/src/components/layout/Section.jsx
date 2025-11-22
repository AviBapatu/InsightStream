/**
 * Section Component
 *
 * A reusable section component for organizing content on a page.
 * Provides consistent spacing and optional title/description.
 *
 * Features:
 * - Optional title and description
 * - Customizable spacing
 * - Theme-aware text colors
 * - Optional divider line
 *
 * @example
 * // Section with title
 * <Section title="Personal Information">
 *   <p>Content goes here</p>
 * </Section>
 *
 * // Section with title and description
 * <Section
 *   title="Account Settings"
 *   description="Manage your account preferences"
 * >
 *   <SettingsForm />
 * </Section>
 */

import React from "react";
import PropTypes from "prop-types";

const Section = ({
  children,
  title,
  description,
  spacing = "md",
  divider = false,
  className = "",
}) => {
  // Spacing options for margin bottom
  const spacingStyles = {
    none: "mb-0",
    sm: "mb-4",
    md: "mb-6",
    lg: "mb-8",
    xl: "mb-12",
  };

  return (
    <section className={`${spacingStyles[spacing]} ${className}`}>
      {/* Section header */}
      {(title || description) && (
        <div className="mb-3">
          {title && (
            <h2
              className="text-lg font-semibold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Section content */}
      <div>{children}</div>

      {/* Optional divider at the bottom */}
      {divider && (
        <hr className="mt-6" style={{ borderColor: "var(--color-border)" }} />
      )}
    </section>
  );
};

// PropTypes for type checking and documentation
Section.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  spacing: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  divider: PropTypes.bool,
  className: PropTypes.string,
};

export default Section;
