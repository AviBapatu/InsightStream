/**
 * StatCard Component
 *
 * A specialized card component for displaying statistics with an icon.
 * Used throughout the app to show metrics like articles saved, articles read, etc.
 *
 * Features:
 * - Large number display
 * - Descriptive label
 * - Icon with customizable background color
 * - Hover effect
 * - Optional click handler
 * - Theme-aware styling
 *
 * @example
 * // Basic stat card
 * <StatCard
 *   value={42}
 *   label="Articles Saved"
 *   icon={<HeartIcon />}
 *   iconBgColor="var(--color-primary-100)"
 *   iconColor="var(--color-primary-700)"
 * />
 *
 * // Clickable stat card
 * <StatCard
 *   value={150}
 *   label="Articles Read"
 *   icon={<BookIcon />}
 *   onClick={() => navigate('/history')}
 * />
 */

import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";

const StatCard = ({
  value,
  label,
  icon,
  iconBgColor = "var(--color-primary-100)",
  iconColor = "var(--color-primary-700)",
  description,
  onClick,
  className = "",
}) => {
  return (
    <Card
      padding="md"
      hoverable={!!onClick}
      onClick={onClick}
      className={`group ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Value and label */}
        <div>
          <div
            className="text-3xl font-bold mb-1 tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {value}
          </div>
          <div
            className="font-medium text-sm transition-colors group-hover:text-gold-700"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
          </div>
        </div>

        {/* Right side: Icon */}
        {icon && (
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ backgroundColor: iconBgColor }}
          >
            <div style={{ color: iconColor }}>{icon}</div>
          </div>
        )}
      </div>

      {/* Optional description */}
      {description && (
        <div
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {description}
        </div>
      )}
    </Card>
  );
};

// PropTypes for type checking and documentation
StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  iconBgColor: PropTypes.string,
  iconColor: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default StatCard;
