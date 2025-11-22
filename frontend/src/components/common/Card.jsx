/**
 * Card Component
 *
 * A reusable card container component that provides consistent styling
 * throughout the application. Cards are used to group related content
 * and make the UI more organized and visually appealing.
 *
 * Features:
 * - Theme-aware styling using CSS custom properties
 * - Optional hover effects
 * - Optional click handler (makes card interactive)
 * - Customizable padding
 * - Optional shadow
 * - Optional border
 *
 * @example
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * // Interactive card with hover effect
 * <Card hoverable onClick={handleClick}>
 *   <p>Click me!</p>
 * </Card>
 *
 * // Card with custom padding
 * <Card padding="lg" shadow>
 *   <p>Large padding with shadow</p>
 * </Card>
 */

import React from "react";
import PropTypes from "prop-types";

const Card = ({
  children,
  padding = "md",
  hoverable = false,
  shadow = true,
  border = true,
  className = "",
  onClick,
  ...props
}) => {
  // Padding options
  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
  };

  // Base card styles
  const baseStyles = `
    rounded-xl
    transition-all duration-200
    ${paddingStyles[padding]}
    ${shadow ? "shadow-sm" : ""}
    ${border ? "border" : ""}
    ${hoverable ? "hover:shadow-lg cursor-pointer" : ""}
    ${onClick ? "cursor-pointer" : ""}
    ${className}
  `;

  // Get theme-aware styles
  const getCardStyles = () => ({
    backgroundColor: "var(--color-card)",
    borderColor: border ? "var(--color-border)" : "transparent",
  });

  return (
    <div
      className={baseStyles}
      style={getCardStyles()}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// PropTypes for type checking and documentation
Card.propTypes = {
  children: PropTypes.node.isRequired,
  padding: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  hoverable: PropTypes.bool,
  shadow: PropTypes.bool,
  border: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Card;
