/**
 * FormSection Component
 *
 * Groups related form fields together with an optional title and description.
 * This component helps organize complex forms into logical sections, improving
 * the user experience and making forms easier to understand and complete.
 *
 * Features:
 * - Section title with prominent styling
 * - Optional description text below the title
 * - Consistent spacing between sections
 * - Optional divider line between sections
 * - Full theme support using CSS variables
 *
 * @example
 * <FormSection
 *   title="Personal Information"
 *   description="Please provide your basic details"
 * >
 *   <FormField label="First Name">
 *     <Input />
 *   </FormField>
 *   <FormField label="Last Name">
 *     <Input />
 *   </FormField>
 * </FormSection>
 *
 * @example
 * // With divider
 * <FormSection
 *   title="Account Security"
 *   description="Update your password and security settings"
 *   showDivider
 * >
 *   <FormField label="Current Password">
 *     <Input type="password" />
 *   </FormField>
 * </FormSection>
 */

import React from "react";
import PropTypes from "prop-types";

const FormSection = ({
  title,
  description,
  children,
  showDivider = false,
  className = "",
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Section header with title and description */}
      {(title || description) && (
        <div className="mb-4">
          {/* Section title */}
          {title && (
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {title}
            </h3>
          )}

          {/* Section description */}
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

      {/* Form fields container */}
      <div className="space-y-4">{children}</div>

      {/* Optional divider line below the section */}
      {showDivider && (
        <div
          className="mt-6 pt-6"
          style={{ borderTop: "1px solid var(--color-border)" }}
        />
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
FormSection.propTypes = {
  /** Title of the form section */
  title: PropTypes.string,
  /** Description text below the title */
  description: PropTypes.string,
  /** Form fields to display in this section */
  children: PropTypes.node.isRequired,
  /** Whether to show a divider line below the section */
  showDivider: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default FormSection;
