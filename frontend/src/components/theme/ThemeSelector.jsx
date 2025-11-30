import React, { useState } from "react";
import { useThemeStore } from "../../store/useThemeStore";
import { predefinedThemes } from "../../themes/themeConfig";
import { FaCheck, FaPalette, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

/**
 * ThemeSelector Component
 * Allows users to select from predefined themes or create custom themes
 */
const ThemeSelector = () => {
  const { currentTheme, setTheme, customThemes, getAllThemes } =
    useThemeStore();
  const [showCustomCreator, setShowCustomCreator] = useState(false);

  const allThemes = getAllThemes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Color Theme
          </h3>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Choose a theme or create your own
          </p>
        </div>
        <button
          onClick={() => setShowCustomCreator(!showCustomCreator)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Custom</span>
        </button>
      </div>

      {/* Predefined Themes Grid */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Predefined Themes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {predefinedThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={currentTheme.id === theme.id}
              onSelect={() => setTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* Custom Themes */}
      {customThemes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Your Custom Themes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={currentTheme.id === theme.id}
                onSelect={() => setTheme(theme.id)}
                isCustom={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom Theme Creator Modal */}
      {showCustomCreator && (
        <CustomThemeCreator onClose={() => setShowCustomCreator(false)} />
      )}
    </div>
  );
};

/**
 * ThemeCard Component
 * Displays a single theme option
 */
const ThemeCard = ({ theme, isActive, onSelect, isCustom = false }) => {
  const { deleteCustomTheme } = useThemeStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      deleteCustomTheme(theme.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer
        ${
          isActive ? "shadow-lg" : "hover:shadow-md"
        }
      `}
      style={{
        backgroundColor: isActive
          ? "var(--color-primary-50)"
          : "var(--color-background-secondary)",
        borderColor: isActive
          ? "var(--color-primary-600)"
          : "var(--color-border)",
        transition: "all 0.3s ease-in-out"
      }}
    >
      {/* Active Indicator */}
      {isActive && (
        <div 
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: "var(--color-primary-600)" }}
        >
          <FaCheck className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Delete Button for Custom Themes */}
      {isCustom && !isActive && (
        <button
          onClick={handleDelete}
          className={`
            absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors
            ${
              showDeleteConfirm
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600"
            }
          `}
          title={showDeleteConfirm ? "Click again to confirm" : "Delete theme"}
        >
          <IoClose className="w-4 h-4" />
        </button>
      )}

      {/* Color Swatches */}
      <div className="flex gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg shadow-sm"
          style={{ backgroundColor: theme.colors.primary[600] }}
        />
        <div
          className="w-8 h-8 rounded-lg shadow-sm"
          style={{ backgroundColor: theme.colors.primary[400] }}
        />
        <div
          className="w-8 h-8 rounded-lg shadow-sm"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <div
          className="w-8 h-8 rounded-lg shadow-sm border border-gray-200"
          style={{ backgroundColor: theme.colors.background }}
        />
      </div>

      {/* Theme Info */}
      <div>
        <h4
          className="font-medium flex items-center gap-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          {theme.name}
          {isCustom && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
              Custom
            </span>
          )}
        </h4>
        <p
          className="text-xs mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {theme.description}
        </p>
      </div>
    </div>
  );
};

/**
 * CustomThemeCreator Component
 * Modal for creating custom themes
 */
const CustomThemeCreator = ({ onClose }) => {
  const { addCustomTheme, setThemeObject } = useThemeStore();
  const [themeName, setThemeName] = useState("");
  const [colors, setColors] = useState({
    primary: {
      50: "#fdf7e8",
      100: "#f7eac4",
      200: "#f1dd9f",
      300: "#ebcf7a",
      400: "#e5c356",
      500: "#d9a63a",
      600: "#b7892e",
      700: "#926b23",
      800: "#6e4e17",
      900: "#48320c",
    },
    accent: "#d9a63a",
    accentHover: "#b7892e",
    background: "#ffffff",
    backgroundSecondary: "#f9fafb",
    backgroundTertiary: "#f3f4f6",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textTertiary: "#9ca3af",
    border: "#e5e7eb",
    borderHover: "#d1d5db",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  });

  const handleColorChange = (key, value) => {
    setColors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePrimaryShadeChange = (shade, value) => {
    setColors((prev) => ({
      ...prev,
      primary: {
        ...prev.primary,
        [shade]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!themeName.trim()) {
      alert("Please enter a theme name");
      return;
    }

    const newTheme = addCustomTheme(themeName, colors);
    setThemeObject(newTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{
            backgroundColor: "var(--color-background)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div>
            <h3
              className="text-xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Create Custom Theme
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Customize colors to create your unique theme
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Theme Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme Name
            </label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Awesome Theme"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-600 focus:border-transparent"
            />
          </div>

          {/* Primary Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Primary Colors
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(colors.primary).map(([shade, color]) => (
                <ColorPicker
                  key={shade}
                  label={shade}
                  value={color}
                  onChange={(value) => handlePrimaryShadeChange(shade, value)}
                />
              ))}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Accent Colors
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ColorPicker
                label="Accent"
                value={colors.accent}
                onChange={(value) => handleColorChange("accent", value)}
              />
              <ColorPicker
                label="Accent Hover"
                value={colors.accentHover}
                onChange={(value) => handleColorChange("accentHover", value)}
              />
            </div>
          </div>

          {/* Background Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Background Colors
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ColorPicker
                label="Background"
                value={colors.background}
                onChange={(value) => handleColorChange("background", value)}
              />
              <ColorPicker
                label="Secondary"
                value={colors.backgroundSecondary}
                onChange={(value) =>
                  handleColorChange("backgroundSecondary", value)
                }
              />
              <ColorPicker
                label="Tertiary"
                value={colors.backgroundTertiary}
                onChange={(value) =>
                  handleColorChange("backgroundTertiary", value)
                }
              />
            </div>
          </div>

          {/* Text Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Text Colors
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ColorPicker
                label="Primary Text"
                value={colors.textPrimary}
                onChange={(value) => handleColorChange("textPrimary", value)}
              />
              <ColorPicker
                label="Secondary Text"
                value={colors.textSecondary}
                onChange={(value) => handleColorChange("textSecondary", value)}
              />
              <ColorPicker
                label="Tertiary Text"
                value={colors.textTertiary}
                onChange={(value) => handleColorChange("textTertiary", value)}
              />
            </div>
          </div>

          {/* Border Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Border Colors
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker
                label="Border"
                value={colors.border}
                onChange={(value) => handleColorChange("border", value)}
              />
              <ColorPicker
                label="Border Hover"
                value={colors.borderHover}
                onChange={(value) => handleColorChange("borderHover", value)}
              />
            </div>
          </div>

          {/* Status Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Status Colors
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ColorPicker
                label="Success"
                value={colors.success}
                onChange={(value) => handleColorChange("success", value)}
              />
              <ColorPicker
                label="Error"
                value={colors.error}
                onChange={(value) => handleColorChange("error", value)}
              />
              <ColorPicker
                label="Warning"
                value={colors.warning}
                onChange={(value) => handleColorChange("warning", value)}
              />
              <ColorPicker
                label="Info"
                value={colors.info}
                onChange={(value) => handleColorChange("info", value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex items-center justify-end gap-3 sticky bottom-0"
          style={{
            backgroundColor: "var(--color-background)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition-colors"
          >
            Save Theme
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ColorPicker Component
 * Simple color input with preview
 */
const ColorPicker = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gold-600 transition-colors"
          style={{ backgroundColor: value }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs px-2 py-1 border border-gray-200 rounded text-center font-mono"
        placeholder="#000000"
      />
    </div>
  );
};

export default ThemeSelector;
