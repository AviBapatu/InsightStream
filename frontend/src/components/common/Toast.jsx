/**
 * Toast Component
 *
 * A notification component that displays temporary messages to the user.
 * Toasts appear at the edge of the screen and automatically dismiss after
 * a set duration. They're perfect for showing success messages, errors,
 * warnings, or general information without interrupting the user's workflow.
 *
 * Features:
 * - Multiple variants (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Manual close button
 * - Smooth slide and fade animations
 * - Multiple positions (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
 * - Icon support for each variant
 * - Progress bar showing time remaining
 * - Full theme support using CSS variables
 *
 * Usage:
 * This component is typically used with a Toast context/provider that manages
 * multiple toasts and their lifecycle.
 *
 * @example
 * <Toast
 *   message="Profile updated successfully!"
 *   variant="success"
 *   onClose={handleClose}
 * />
 *
 * @example
 * // With custom duration
 * <Toast
 *   message="Failed to save changes"
 *   variant="error"
 *   duration={5000}
 *   onClose={handleClose}
 * />
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({
  message,
  variant = "info",
  duration = 3000,
  onClose,
  position = "top-right",
  showProgress = true,
}) => {
  // State to track visibility
  const [isVisible, setIsVisible] = useState(true);

  // State to track progress for auto-dismiss
  const [progress, setProgress] = useState(100);

  // Icons for different variants
  const icons = {
    success: (
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
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
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
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
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
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  // Variant styles - different colors for different message types
  const variantStyles = {
    success: {
      backgroundColor: "var(--color-success-50)",
      color: "var(--color-success-700)",
      borderColor: "var(--color-success-200)",
      iconColor: "var(--color-success-500)",
      progressColor: "var(--color-success-500)",
    },
    error: {
      backgroundColor: "var(--color-danger-50)",
      color: "var(--color-danger-700)",
      borderColor: "var(--color-danger-200)",
      iconColor: "var(--color-danger-500)",
      progressColor: "var(--color-danger-500)",
    },
    warning: {
      backgroundColor: "var(--color-warning-50)",
      color: "var(--color-warning-700)",
      borderColor: "var(--color-warning-200)",
      iconColor: "var(--color-warning-500)",
      progressColor: "var(--color-warning-500)",
    },
    info: {
      backgroundColor: "var(--color-info-50)",
      color: "var(--color-info-700)",
      borderColor: "var(--color-info-200)",
      iconColor: "var(--color-info-500)",
      progressColor: "var(--color-info-500)",
    },
  };

  // Position styles - where the toast appears on screen
  const positionStyles = {
    "top-right": { top: "1rem", right: "1rem" },
    "top-left": { top: "1rem", left: "1rem" },
    "bottom-right": { bottom: "1rem", right: "1rem" },
    "bottom-left": { bottom: "1rem", left: "1rem" },
    "top-center": { top: "1rem", left: "50%", transform: "translateX(-50%)" },
    "bottom-center": {
      bottom: "1rem",
      left: "50%",
      transform: "translateX(-50%)",
    },
  };

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      // Update progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto close timer
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [duration]);

  // Handle close with animation
  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position.includes("right") ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: position.includes("right") ? 100 : -100 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[9999] min-w-[320px] max-w-md rounded-lg shadow-lg overflow-hidden"
          style={{
            ...positionStyles[position],
            backgroundColor: variantStyles[variant].backgroundColor,
            border: `1px solid ${variantStyles[variant].borderColor}`,
          }}
        >
          <div className="p-4 flex items-start gap-3">
            {/* Icon */}
            <div
              className="flex-shrink-0"
              style={{ color: variantStyles[variant].iconColor }}
            >
              {icons[variant]}
            </div>

            {/* Message */}
            <p
              className="flex-1 text-sm font-medium"
              style={{ color: variantStyles[variant].color }}
            >
              {message}
            </p>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
              style={{ color: variantStyles[variant].iconColor }}
              aria-label="Close notification"
            >
              <svg
                className="w-4 h-4"
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
          </div>

          {/* Progress bar */}
          {showProgress && duration > 0 && (
            <div className="h-1 w-full bg-black bg-opacity-10">
              <motion.div
                className="h-full"
                style={{
                  backgroundColor: variantStyles[variant].progressColor,
                }}
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// PropTypes for type checking and documentation
Toast.propTypes = {
  /** Message to display in the toast */
  message: PropTypes.string.isRequired,
  /** Visual variant of the toast */
  variant: PropTypes.oneOf(["success", "error", "warning", "info"]),
  /** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  duration: PropTypes.number,
  /** Function to call when toast is closed */
  onClose: PropTypes.func,
  /** Position where the toast appears */
  position: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
    "top-center",
    "bottom-center",
  ]),
  /** Whether to show the progress bar */
  showProgress: PropTypes.bool,
};

export default Toast;
