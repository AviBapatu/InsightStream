/**
 * Dropdown Component
 *
 * A customizable dropdown menu component that displays a list of options when
 * clicked. This component is useful for navigation menus, action menus, or
 * any situation where you need to show multiple options in a compact space.
 *
 * Features:
 * - Customizable trigger button
 * - Smooth fade and slide animations
 * - Click outside to close
 * - ESC key to close
 * - Multiple alignment options (left, right, center)
 * - Item icons support
 * - Divider support between items
 * - Disabled items
 * - Full theme support using CSS variables
 *
 * @example
 * <Dropdown
 *   trigger={<Button>Options</Button>}
 *   items={[
 *     { label: 'Edit', onClick: handleEdit, icon: <EditIcon /> },
 *     { label: 'Delete', onClick: handleDelete, icon: <DeleteIcon />, danger: true },
 *   ]}
 * />
 *
 * @example
 * // With divider
 * <Dropdown
 *   trigger={<Button>Menu</Button>}
 *   items={[
 *     { label: 'Profile', onClick: goToProfile },
 *     { label: 'Settings', onClick: goToSettings },
 *     { divider: true },
 *     { label: 'Logout', onClick: handleLogout, danger: true },
 *   ]}
 *   align="right"
 * />
 */

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const Dropdown = ({ trigger, items = [], align = "left", className = "" }) => {
  // State to track if dropdown is open
  const [isOpen, setIsOpen] = useState(false);

  // Reference to the dropdown container for click outside detection
  const dropdownRef = useRef(null);

  // Alignment styles for dropdown positioning
  const alignmentStyles = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Handle ESC key to close dropdown
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Handle item click
  const handleItemClick = (item) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger button */}
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 min-w-[200px] rounded-lg shadow-lg overflow-hidden ${alignmentStyles[align]}`}
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="py-1">
              {items.map((item, index) => {
                // Render divider
                if (item.divider) {
                  return (
                    <div
                      key={`divider-${index}`}
                      className="my-1"
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    />
                  );
                }

                // Render menu item
                return (
                  <button
                    key={item.id || index}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                      item.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    style={{
                      color: item.danger
                        ? "var(--color-danger-500)"
                        : "var(--color-text-primary)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!item.disabled) {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-muted)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Optional icon */}
                    {item.icon && (
                      <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                    )}

                    {/* Item label */}
                    <span className="flex-1">{item.label}</span>

                    {/* Optional badge or additional info */}
                    {item.badge && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--color-primary-100)",
                          color: "var(--color-primary-700)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// PropTypes for type checking and documentation
Dropdown.propTypes = {
  /** Element that triggers the dropdown when clicked */
  trigger: PropTypes.node.isRequired,
  /** Array of menu items to display */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique identifier for the item */
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      /** Text to display */
      label: PropTypes.string,
      /** Icon element to show before the label */
      icon: PropTypes.node,
      /** Function to call when item is clicked */
      onClick: PropTypes.func,
      /** Whether this item is disabled */
      disabled: PropTypes.bool,
      /** Whether to style as a dangerous action (red) */
      danger: PropTypes.bool,
      /** Optional badge text */
      badge: PropTypes.string,
      /** Whether this is a divider (separator line) */
      divider: PropTypes.bool,
    })
  ),
  /** Alignment of the dropdown menu */
  align: PropTypes.oneOf(["left", "right", "center"]),
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Dropdown;
