# 🚀 Quick Start Guide - New Component Library

## Import Components

```jsx
// Common components
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  Toast,
  Badge,
  Avatar,
  Spinner,
  StatCard,
  FormField,
  FormSection,
  Dropdown,
} from "./components/common";

// Layout components
import { PageContainer, Section } from "./components/layout";
```

## Component Cheat Sheet

### Button

```jsx
<Button variant="primary" size="md" onClick={handleClick}>Click Me</Button>
<Button variant="danger" isLoading disabled>Deleting...</Button>
<Button variant="outline" leftIcon={<Icon />}>With Icon</Button>
```

**Variants:** primary, secondary, outline, danger, ghost  
**Sizes:** sm, md, lg

### Input

```jsx
<Input
  type="email"
  value={email}
  onChange={handleChange}
  placeholder="Enter email"
  error={error}
  leftIcon={<EmailIcon />}
/>
```

### Select

```jsx
<Select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  options={[
    { value: "en", label: "English", icon: "🇬🇧" },
    { value: "es", label: "Spanish", icon: "🇪🇸" },
  ]}
  leftIcon="🇬🇧"
  placeholder="Select language"
/>
```

**Features:** Theme-aware, icons, error states

### FormField

```jsx
<FormField label="Email" error={error} required helperText="We'll never share">
  <Input type="email" value={email} onChange={handleChange} />
</FormField>
```

### Card

```jsx
<Card padding="lg" shadow showBorder hover>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

**Padding:** none, sm, md, lg, xl

### Modal

```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  footer={
    <>
      <Button onClick={handleClose}>Cancel</Button>
    </>
  }
>
  <p>Modal content here</p>
</Modal>
```

### Toast

```jsx
<Toast
  message="Success!"
  variant="success"
  duration={3000}
  position="top-right"
  onClose={handleClose}
/>
```

**Variants:** success, error, warning, info

### Badge

```jsx
<Badge variant="success">Active</Badge>
<Badge variant="danger" onRemove={handleRemove}>Tag</Badge>
```

### Avatar

```jsx
<Avatar src="/image.jpg" name="John Doe" size="lg" showBorder />
```

**Sizes:** xs, sm, md, lg, xl, 2xl

### Dropdown

```jsx
<Dropdown
  trigger={<Button>Menu</Button>}
  items={[
    { label: "Edit", onClick: handleEdit, icon: <EditIcon /> },
    { divider: true },
    { label: "Delete", onClick: handleDelete, danger: true },
  ]}
  align="right"
/>
```

### StatCard

```jsx
<StatCard
  value="1,234"
  label="Total Views"
  icon={<EyeIcon />}
  iconColor="var(--color-primary-500)"
  onClick={handleClick}
/>
```

### Spinner

```jsx
<Spinner size="lg" text="Loading..." />
<Spinner fullPage />
```

### PageContainer

```jsx
<PageContainer maxWidth="lg">
  <h1>Page Title</h1>
</PageContainer>
```

### Section

```jsx
<Section title="Settings" description="Manage your preferences" spacing="lg">
  {/* Section content */}
</Section>
```

## Theme Colors (CSS Variables)

```css
var(--color-primary-600)      /* Primary brand color */
var(--color-text-primary)     /* Main text color */
var(--color-text-secondary)   /* Muted/secondary text */
var(--color-background)       /* Page background */
var(--color-card)            /* Card/container background */
var(--color-border)          /* Border color */
var(--color-muted)           /* Muted background */
var(--color-danger-500)      /* Error/danger color */
var(--color-success-500)     /* Success color */
var(--color-warning-500)     /* Warning color */
```

## Stores

```jsx
// Auth
const user = useAuthStore((s) => s.user);
const login = useAuthStore((s) => s.login);

// Bookmarks
const bookmarks = useBookmarksStore((s) => s.bookmarks);
const addBookmark = useBookmarksStore((s) => s.addBookmark);

// Theme
const currentTheme = useThemeStore((s) => s.currentTheme);
const setTheme = useThemeStore((s) => s.setTheme);

// Reader Panel
const openReader = useReaderStore((s) => s.openReader);
```

## Hooks

```jsx
// Debounce search
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 500);

// Detect desktop
const isDesktop = useIsDesktop(); // true if ≥1024px
```

## Quick Patterns

### Form with Validation

```jsx
<FormSection title="Login" description="Sign in to your account">
  <FormField label="Email" error={errors.email} required>
    <Input type="email" value={email} onChange={handleChange} />
  </FormField>

  <FormField label="Password" error={errors.password} required>
    <Input type="password" value={password} onChange={handleChange} />
  </FormField>

  <Button variant="primary" fullWidth isLoading={loading}>
    Sign In
  </Button>
</FormSection>
```

### Modal with Confirmation

```jsx
<Modal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Delete Item?"
  footer={
    <>
      <Button variant="ghost" onClick={() => setShowConfirm(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

### Card with Stats

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <StatCard value="42" label="Articles Read" icon={<BookIcon />} />
  <StatCard value="12" label="Saved Items" icon={<HeartIcon />} />
  <StatCard value="5h" label="Reading Time" icon={<ClockIcon />} />
</div>
```

## Documentation

- **Full Guide:** `/frontend/src/components/COMPONENT_LIBRARY.md`
- **Refactoring Summary:** `/frontend/REFACTORING_SUMMARY.md`
- **Complete Summary:** `/frontend/COMPLETE_MODULARIZATION_SUMMARY.md`

## Tips

1. Always use CSS variables for colors (theme support)
2. Use PropTypes are already defined for validation
3. Check JSDoc comments in component files for details
4. All components are responsive by default
5. Loading states are handled with `isLoading` prop
6. Error messages work with `error` prop

---

**Need Help?** Check the component file - each has comprehensive JSDoc documentation with examples!
