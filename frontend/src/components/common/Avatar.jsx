/**
 * Avatar Component
 *
 * A reusable avatar component for displaying user profile pictures.
 * Handles both image avatars and fallback to initials or default color.
 *
 * Features:
 * - Multiple sizes: xs, sm, md, lg, xl, 2xl
 * - Image with fallback support
 * - Initials display when no image
 * - Colored background when no image
 * - Optional border
 * - Optional click handler
 * - Theme-aware border color
 *
 * @example
 * // Avatar with image
 * <Avatar src="/avatars/user1.png" alt="John Doe" size="md" />
 *
 * // Avatar with initials fallback
 * <Avatar name="John Doe" size="lg" />
 *
 * // Clickable avatar with border
 * <Avatar
 *   src="/avatars/user1.png"
 *   size="xl"
 *   border
 *   onClick={() => navigate('/profile')}
 * />
 */

import React, { useState } from "react";
import PropTypes from "prop-types";

const Avatar = ({
  src,
  alt = "",
  name = "",
  size = "md",
  border = false,
  onClick,
  className = "",
}) => {
  // Track if image failed to load
  const [imageError, setImageError] = useState(false);

  // Size classes
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-2xl",
  };

  // Border width based on size
  const borderWidth = {
    xs: "border",
    sm: "border",
    md: "border-2",
    lg: "border-2",
    xl: "border-2",
    "2xl": "border-2",
  };

  // Base avatar styles
  const baseStyles = `
    rounded-full overflow-hidden flex items-center justify-center
    ${sizeClasses[size]}
    ${border ? borderWidth[size] : ""}
    ${onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
    ${className}
  `;

  // Get initials from name (first letter of first and last name)
  const getInitials = () => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate a consistent color based on the name
  const getBackgroundColor = () => {
    if (!name) return "var(--color-primary-600)";

    // Simple hash function to get consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to hue value (0-360)
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  return (
    <div
      className={baseStyles}
      style={border ? { borderColor: "var(--color-primary-600)" } : {}}
      onClick={onClick}
    >
      {/* Show image if src is provided and hasn't failed */}
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Show initials with colored background as fallback */
        <div
          className="w-full h-full flex items-center justify-center font-semibold text-white"
          style={{ backgroundColor: getBackgroundColor() }}
        >
          {getInitials()}
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "2xl"]),
  border: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Avatar;
