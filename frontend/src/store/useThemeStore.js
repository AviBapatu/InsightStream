import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  predefinedThemes,
  getThemeById,
  applyTheme,
  createCustomTheme,
} from "../themes/themeConfig";

/**
 * Theme Store
 * Manages the application's theme state and persistence
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current active theme
      currentTheme: predefinedThemes[0],

      // User's custom themes
      customThemes: [],

      // Theme ID (for easier storage)
      themeId: "gold-light",

      /**
       * Set the active theme by ID
       * @param {string} themeId - ID of the theme to activate
       */
      setTheme: (themeId) => {
        const theme =
          getThemeById(themeId) ||
          get().customThemes.find((t) => t.id === themeId);
        if (theme) {
          applyTheme(theme);
          set({ currentTheme: theme, themeId });
        }
      },

      /**
       * Set theme from theme object
       * @param {object} theme - Theme object to set
       */
      setThemeObject: (theme) => {
        applyTheme(theme);
        set({ currentTheme: theme, themeId: theme.id });
      },

      /**
       * Create and save a custom theme
       * @param {string} name - Name of the theme
       * @param {object} colors - Color configuration
       */
      addCustomTheme: (name, colors) => {
        const newTheme = createCustomTheme(name, colors);
        set((state) => ({
          customThemes: [...state.customThemes, newTheme],
        }));
        return newTheme;
      },

      /**
       * Update an existing custom theme
       * @param {string} themeId - ID of theme to update
       * @param {object} updates - Updates to apply
       */
      updateCustomTheme: (themeId, updates) => {
        set((state) => ({
          customThemes: state.customThemes.map((theme) =>
            theme.id === themeId ? { ...theme, ...updates } : theme
          ),
        }));

        // If updating the current theme, re-apply it
        if (get().themeId === themeId) {
          const updatedTheme = get().customThemes.find((t) => t.id === themeId);
          if (updatedTheme) {
            applyTheme(updatedTheme);
            set({ currentTheme: updatedTheme });
          }
        }
      },

      /**
       * Delete a custom theme
       * @param {string} themeId - ID of theme to delete
       */
      deleteCustomTheme: (themeId) => {
        set((state) => ({
          customThemes: state.customThemes.filter(
            (theme) => theme.id !== themeId
          ),
        }));

        // If deleting the current theme, switch to default
        if (get().themeId === themeId) {
          get().setTheme("gold-light");
        }
      },

      /**
       * Get all available themes (predefined + custom)
       */
      getAllThemes: () => {
        return [...predefinedThemes, ...get().customThemes];
      },

      /**
       * Initialize theme on app load
       */
      initializeTheme: () => {
        const { themeId } = get();
        const theme =
          getThemeById(themeId) ||
          get().customThemes.find((t) => t.id === themeId);
        if (theme) {
          applyTheme(theme);
          set({ currentTheme: theme });
        }
      },
    }),
    {
      name: "theme-storage",
      partiallyPersist: (state) => ({
        themeId: state.themeId,
        customThemes: state.customThemes,
      }),
    }
  )
);
