/**
 * Theme Configuration System
 *
 * This file contains all color themes for the application.
 * Each theme defines colors for primary, secondary, and various UI elements.
 *
 * Theme Structure:
 * - id: Unique identifier for the theme
 * - name: Display name shown to users
 * - colors: Object containing all color values (50-900 scale for primary/secondary)
 */

// Predefined themes that users can choose from
export const predefinedThemes = [
  {
    id: "gold-light",
    name: "Gold Light",
    description: "Classic gold theme with warm tones",
    colors: {
      // Primary color (gold)
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
      // Accent colors
      accent: "#d9a63a",
      accentHover: "#b7892e",
      // Background colors
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",
      // Text colors
      textPrimary: "#111827",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",
      // Border colors
      border: "#e5e7eb",
      borderHover: "#d1d5db",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  {
    id: "gold-dark",
    name: "Gold Dark",
    description: "Dark mode variant of the gold theme",
    colors: {
      // Primary color (gold) - lighter for dark mode
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
      // Accent colors - brighter for visibility
      accent: "#e5c356",
      accentHover: "#f1dd9f",
      // Background colors - not too dark
      background: "#1a1a2e",
      backgroundSecondary: "#25253a",
      backgroundTertiary: "#2f2f46",
      // Text colors - high contrast
      textPrimary: "#f8f9fa",
      textSecondary: "#d1d5db",
      textTertiary: "#9ca3af",
      // Border colors - visible but subtle
      border: "#3f3f55",
      borderHover: "#4f4f6a",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Calm and professional blue theme",
    colors: {
      // Primary color (blue)
      primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
      // Accent colors
      accent: "#3b82f6",
      accentHover: "#2563eb",
      // Background colors
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",
      // Text colors
      textPrimary: "#111827",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",
      // Border colors
      border: "#e5e7eb",
      borderHover: "#d1d5db",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  {
    id: "forest-green",
    name: "Forest Green",
    description: "Natural and refreshing green theme",
    colors: {
      // Primary color (green)
      primary: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
      },
      // Accent colors
      accent: "#22c55e",
      accentHover: "#16a34a",
      // Background colors
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",
      // Text colors
      textPrimary: "#111827",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",
      // Border colors
      border: "#e5e7eb",
      borderHover: "#d1d5db",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    description: "Vibrant and energetic orange theme",
    colors: {
      // Primary color (orange)
      primary: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
      },
      // Accent colors
      accent: "#f97316",
      accentHover: "#ea580c",
      // Background colors
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",
      // Text colors
      textPrimary: "#111827",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",
      // Border colors
      border: "#e5e7eb",
      borderHover: "#d1d5db",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  {
    id: "purple-dream",
    name: "Purple Dream",
    description: "Creative and elegant purple theme",
    colors: {
      // Primary color (purple)
      primary: {
        50: "#faf5ff",
        100: "#f3e8ff",
        200: "#e9d5ff",
        300: "#d8b4fe",
        400: "#c084fc",
        500: "#a855f7",
        600: "#9333ea",
        700: "#7e22ce",
        800: "#6b21a8",
        900: "#581c87",
      },
      // Accent colors
      accent: "#a855f7",
      accentHover: "#9333ea",
      // Background colors
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",
      // Text colors
      textPrimary: "#111827",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",
      // Border colors
      border: "#e5e7eb",
      borderHover: "#d1d5db",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  {
    id: "rose-pink",
    name: "Rose Pink",
    description: "Soft and modern pink theme",
    colors: {
      // Primary color (rose)
      primary: {
        50: "#fff1f2",
        100: "#ffe4e6",
        200: "#fecdd3",
        300: "#fda4af",
        400: "#fb7185",
        500: "#f43f5e",
        600: "#e11d48",
        700: "#be123c",
        800: "#9f1239",
        900: "#881337",
      },
      // Accent colors
      accent: "#f43f5e",
      accentHover: "#e11d48",
      // Background colors
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",
      // Text colors
      textPrimary: "#111827",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",
      // Border colors
      border: "#e5e7eb",
      borderHover: "#d1d5db",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  {
    id: "midnight-dark",
    name: "Midnight Dark",
    description: "Deep dark theme with blue accents",
    colors: {
      // Primary color (blue) - keep light shades for buttons
      primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
      // Accent colors - bright for visibility
      accent: "#60a5fa",
      accentHover: "#93c5fd",
      // Background colors - balanced darkness
      background: "#0d1117",
      backgroundSecondary: "#161b22",
      backgroundTertiary: "#21262d",
      // Text colors - excellent contrast
      textPrimary: "#f0f6fc",
      textSecondary: "#c9d1d9",
      textTertiary: "#8b949e",
      // Border colors - clearly visible
      border: "#30363d",
      borderHover: "#484f58",
      // Status colors
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
];

/**
 * Get theme by ID
 * @param {string} themeId - The ID of the theme to retrieve
 * @returns {object|null} - The theme object or null if not found
 */
export const getThemeById = (themeId) => {
  return (
    predefinedThemes.find((theme) => theme.id === themeId) ||
    predefinedThemes[0]
  );
};

/**
 * Apply theme to CSS variables
 * @param {object} theme - The theme object to apply
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Apply primary colors
  Object.entries(theme.colors.primary).forEach(([shade, color]) => {
    root.style.setProperty(`--color-primary-${shade}`, color);
  });

  // Apply other colors
  root.style.setProperty("--color-accent", theme.colors.accent);
  root.style.setProperty("--color-accent-hover", theme.colors.accentHover);
  root.style.setProperty("--color-background", theme.colors.background);
  root.style.setProperty(
    "--color-background-secondary",
    theme.colors.backgroundSecondary
  );
  root.style.setProperty(
    "--color-background-tertiary",
    theme.colors.backgroundTertiary
  );
  root.style.setProperty("--color-text-primary", theme.colors.textPrimary);
  root.style.setProperty("--color-text-secondary", theme.colors.textSecondary);
  root.style.setProperty("--color-text-tertiary", theme.colors.textTertiary);
  root.style.setProperty("--color-border", theme.colors.border);
  root.style.setProperty("--color-border-hover", theme.colors.borderHover);
  root.style.setProperty("--color-success", theme.colors.success);
  root.style.setProperty("--color-error", theme.colors.error);
  root.style.setProperty("--color-warning", theme.colors.warning);
  root.style.setProperty("--color-info", theme.colors.info);
};

/**
 * Create a custom theme
 * @param {string} name - Name of the custom theme
 * @param {object} colors - Color configuration
 * @returns {object} - The custom theme object
 */
export const createCustomTheme = (name, colors) => {
  return {
    id: `custom-${Date.now()}`,
    name,
    description: "Custom theme",
    colors,
    isCustom: true,
  };
};

/**
 * Validate theme colors
 * @param {object} colors - Color object to validate
 * @returns {boolean} - Whether the colors are valid
 */
export const validateThemeColors = (colors) => {
  const requiredKeys = [
    "primary",
    "accent",
    "accentHover",
    "background",
    "backgroundSecondary",
    "textPrimary",
    "textSecondary",
    "border",
  ];

  return requiredKeys.every((key) => colors[key] !== undefined);
};

// Export default theme
export const defaultTheme = predefinedThemes[0];
