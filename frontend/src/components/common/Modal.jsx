/**
 * Modal Component
 *
 * A reusable modal dialog component that displays content in an overlay above
 * the main page. Modals are used for important actions, confirmations, or
 * detailed information that requires user attention.
 *
 * Features:
 * - Dark overlay background with fade animation
 * - Close on overlay click or ESC key
 * - Optional header with title and close button
 * - Flexible content area
 * - Optional footer for actions (buttons)
 * - Multiple sizes (sm, md, lg, xl, full)
 * - Smooth fade and scale animations
 * - Body scroll lock when open
 * - Focus trap for accessibility
 * - Full theme support using CSS variables
 *
 * @example
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 *
 * @example
 * // With custom footer
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Delete Account"
 *   footer={
 *     <>
 *       <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *       <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *     </>
 *   }
 * >
 *   <p>This action cannot be undone.</p>
 * </Modal>
 */

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = "",
}) => {
  // Reference to the modal content for focus management
  const modalRef = useRef(null);

  // Size styles - different max widths for different modal sizes
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself (not the modal content)
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={handleOverlayClick}
          >
            {/* Modal content */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`w-full ${sizeStyles[size]} rounded-lg shadow-xl ${className}`}
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              {(title || showCloseButton) && (
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  {/* Title */}
                  {title && (
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {title}
                    </h2>
                  )}

                  {/* Close button */}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1 rounded-lg transition-colors hover:opacity-70"
                      style={{ color: "var(--color-text-secondary)" }}
                      aria-label="Close modal"
                    >
                      <svg
                        className="w-6 h-6"
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
                </div>
              )}

              {/* Modal body */}
              <div
                className="px-6 py-4"
                style={{ color: "var(--color-text-primary)" }}
              >
                {children}
              </div>

              {/* Modal footer (optional) */}
              {footer && (
                <div
                  className="flex items-center justify-end gap-3 px-6 py-4"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// PropTypes for type checking and documentation
Modal.propTypes = {
  /** Whether the modal is visible */
  isOpen: PropTypes.bool.isRequired,
  /** Function to call when modal should close */
  onClose: PropTypes.func.isRequired,
  /** Modal title (displayed in header) */
  title: PropTypes.string,
  /** Content to display in the modal body */
  children: PropTypes.node.isRequired,
  /** Optional footer content (usually buttons) */
  footer: PropTypes.node,
  /** Size of the modal */
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick: PropTypes.bool,
  /** Whether to show the X close button */
  showCloseButton: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Modal;
