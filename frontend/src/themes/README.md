# Themes Directory

This directory contains the core theme configuration for the application.

## Files

### `themeConfig.js`

The main theme configuration file containing:

- **8 predefined themes** with complete color palettes
- **Utility functions** for theme management
- **Theme structure definitions**

## Predefined Themes

1. **Gold Light** (Default)
2. **Gold Dark**
3. **Ocean Blue**
4. **Forest Green**
5. **Sunset Orange**
6. **Purple Dream**
7. **Rose Pink**
8. **Midnight Dark**

## Adding a New Theme

To add a new predefined theme, edit `themeConfig.js`:

```javascript
export const predefinedThemes = [
  // ... existing themes ...
  {
    id: "my-theme",
    name: "My Theme Name",
    description: "A brief description",
    colors: {
      primary: {
        50: "#lightest",
        100: "#...",
        200: "#...",
        300: "#...",
        400: "#...",
        500: "#base",
        600: "#...",
        700: "#darker",
        800: "#...",
        900: "#darkest",
      },
      accent: "#hex-color",
      accentHover: "#hex-color",
      background: "#hex-color",
      backgroundSecondary: "#hex-color",
      backgroundTertiary: "#hex-color",
      textPrimary: "#hex-color",
      textSecondary: "#hex-color",
      textTertiary: "#hex-color",
      border: "#hex-color",
      borderHover: "#hex-color",
      success: "#hex-color",
      error: "#hex-color",
      warning: "#hex-color",
      info: "#hex-color",
    },
  },
];
```

## Theme Structure

Each theme must include:

### Required Fields:

- `id` (string) - Unique identifier
- `name` (string) - Display name
- `description` (string) - Brief description
- `colors` (object) - Color palette

### Colors Object:

- `primary` (object) - 10 shades (50-900)
- `accent` (string) - Primary action color
- `accentHover` (string) - Hover state for accent
- `background` (string) - Main background
- `backgroundSecondary` (string) - Secondary background
- `backgroundTertiary` (string) - Tertiary background
- `textPrimary` (string) - Primary text color
- `textSecondary` (string) - Secondary text color
- `textTertiary` (string) - Tertiary text color
- `border` (string) - Default border color
- `borderHover` (string) - Border hover state
- `success` (string) - Success status color
- `error` (string) - Error status color
- `warning` (string) - Warning status color
- `info` (string) - Info status color

## Utility Functions

### `getThemeById(themeId)`

Retrieves a theme by its ID.

```javascript
const theme = getThemeById("ocean-blue");
```

### `applyTheme(theme)`

Applies a theme by setting CSS variables.

```javascript
applyTheme(theme);
```

### `createCustomTheme(name, colors)`

Creates a new custom theme object.

```javascript
const customTheme = createCustomTheme("My Theme", colorsObject);
```

### `validateThemeColors(colors)`

Validates that a color object has all required fields.

```javascript
const isValid = validateThemeColors(colorsObject);
```

## Color Naming Convention

### Primary Shades (50-900)

- **50-200**: Very light (backgrounds, highlights)
- **300-400**: Light (subtle accents)
- **500**: Base color (standard use)
- **600-700**: Dark (buttons, emphasis)
- **800-900**: Very dark (strong contrast)

### Usage Guidelines

- Use lighter shades (50-300) for backgrounds
- Use middle shades (400-600) for buttons and actions
- Use darker shades (700-900) for text and strong emphasis

## Testing Your Theme

After adding a theme:

1. Restart the dev server
2. Go to Profile page
3. Your theme should appear in the theme selector
4. Test it by selecting it
5. Verify colors look good in:
   - Buttons
   - Cards
   - Text
   - Borders
   - Hover states

## Best Practices

1. **Maintain Contrast**: Ensure text is readable on backgrounds (WCAG AA)
2. **Consistent Shades**: Use a color scale generator for primary shades
3. **Test Both Modes**: Create light and dark variants
4. **Semantic Colors**: Keep success/error/warning consistent
5. **Unique IDs**: Use kebab-case for theme IDs

## Resources

- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Color Scale Generator](https://hihayk.github.io/scale/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Picker](https://htmlcolorcodes.com/color-picker/)

## Related Files

- `../store/useThemeStore.js` - Theme state management
- `../components/theme/ThemeSelector.jsx` - Theme UI component
- `../index.css` - CSS variables mapping
- `../App.jsx` - Theme initialization

## Documentation

For complete documentation, see:

- `/THEME_SYSTEM.md` - Full system documentation
- `/THEME_QUICK_REFERENCE.md` - Developer quick reference
- `/THEME_MIGRATION_GUIDE.md` - Migration guide
- `/THEME_VISUAL_FLOW.md` - Visual architecture
