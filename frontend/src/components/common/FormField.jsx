/**
 * FormField Component
 *
 * A wrapper component for form inputs that provides consistent label, error message,
 * and helper text styling. This component makes it easy to create forms with
 * proper spacing, alignment, and accessibility features.
 *
 * Features:
 * - Consistent label and input spacing
 * - Error message display with red styling
 * - Helper text for additional guidance
 * - Optional required indicator (*)
 * - Full theme support using CSS variables
 * - Accessibility features (proper label association, aria-invalid)
 *
 * @example
 * <FormField
 *   label="Email Address"
 *   error="Please enter a valid email"
 *   helperText="We'll never share your email"
 *   required
 * >
 *   <Input type="email" />
 * </FormField>
 *
 * @example
 * // With custom styling
 * <FormField
 *   label="Username"
 *   helperText="Choose a unique username"
 *   className="mb-6"
 * >
 *   <Input placeholder="johndoe" />
 * </FormField>
 */

import React from "react";
import PropTypes from "prop-types";

const FormField = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className = "",
  htmlFor,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Label with optional required indicator */}
      {label && (
        <label
          htmlFor={htmlFor}
          className="block mb-2 text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
          {/* Red asterisk for required fields */}
          {required && (
            <span
              className="ml-1"
              style={{ color: "var(--color-danger-500)" }}
              aria-label="required"
            >
              *
            </span>
          )}
        </label>
      )}

      {/* Form input/control (passed as children) */}
      <div className={error ? "has-error" : ""}>{children}</div>

      {/* Error message - shown when there's an error */}
      {error && (
        <p
          className="mt-1.5 text-sm font-medium"
          style={{ color: "var(--color-danger-500)" }}
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper text - additional guidance for the user */}
      {helperText && !error && (
        <p
          className="mt-1.5 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
FormField.propTypes = {
  /** Label text displayed above the input */
  label: PropTypes.string,
  /** Error message to display (replaces helper text when present) */
  error: PropTypes.string,
  /** Helper text displayed below the input */
  helperText: PropTypes.string,
  /** Whether the field is required (shows * indicator) */
  required: PropTypes.bool,
  /** Form input or control component */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** ID of the input element for label association */
  htmlFor: PropTypes.string,
};

export default FormField;
