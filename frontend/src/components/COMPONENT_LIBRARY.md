# Component Library Documentation

This is a comprehensive collection of reusable, production-ready React components for the Insight Stream application. All components are designed with beginners in mind, featuring extensive documentation, PropTypes validation, and theme support.

## 📁 Component Organization

Components are organized into two main folders:

- **`/components/common`** - Reusable UI components (buttons, inputs, cards, etc.)
- **`/components/layout`** - Layout and structural components (page containers, sections, etc.)

## 🎨 Theme Support

All components are fully theme-aware and use CSS custom properties (variables) for colors. This ensures they work seamlessly with both light and dark themes.

**Key theme variables used:**

- `--color-primary-*` - Primary brand colors
- `--color-text-primary` - Main text color
- `--color-text-secondary` - Secondary/muted text
- `--color-background` - Page background
- `--color-card` - Card/container background
- `--color-border` - Border colors
- `--color-success-*`, `--color-danger-*`, `--color-warning-*`, `--color-info-*` - Status colors

## 📦 Component Categories

### Form Components

#### **FormField**

Wrapper for form inputs with label, error message, and helper text.

```jsx
import { FormField, Input } from "./components/common";

<FormField
  label="Email Address"
  error={errors.email}
  helperText="We'll never share your email"
  required
>
  <Input type="email" />
</FormField>;
```

**Props:**

- `label` (string) - Label text above the input
- `error` (string) - Error message (replaces helper text)
- `helperText` (string) - Additional guidance text
- `required` (boolean) - Shows asterisk indicator
- `htmlFor` (string) - ID of the input for label association
- `children` (node) - Input component

#### **FormSection**

Groups related form fields with a title and description.

```jsx
import { FormSection, FormField, Input } from "./components/common";

<FormSection
  title="Personal Information"
  description="Please provide your basic details"
  showDivider
>
  <FormField label="First Name">
    <Input />
  </FormField>
  <FormField label="Last Name">
    <Input />
  </FormField>
</FormSection>;
```

**Props:**

- `title` (string) - Section heading
- `description` (string) - Description below title
- `showDivider` (boolean) - Show bottom border
- `children` (node) - Form fields

#### **Input**

Text input with label, icons, and error handling.

```jsx
import { Input } from "./components/common";

<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="Invalid email address"
  leftIcon={<MailIcon />}
  disabled={false}
/>;
```

**Props:**

- `type` (string) - Input type (text, email, password, etc.)
- `placeholder` (string) - Placeholder text
- `value` (string) - Current value
- `onChange` (function) - Change handler
- `error` (string) - Error message
- `disabled` (boolean) - Disable input
- `leftIcon` (node) - Icon on the left
- `rightIcon` (node) - Icon on the right
- `className` (string) - Additional CSS classes

#### **Select**

Custom styled select dropdown that's fully theme-aware and interactive with color themes.

```jsx
import { Select } from './components/common';

// Basic select
<Select
  value={selectedLanguage}
  onChange={(e) => setSelectedLanguage(e.target.value)}
  options={[
    { value: 'en', label: 'English', icon: '🇬🇧' },
    { value: 'es', label: 'Spanish', icon: '🇪🇸' },
    { value: 'fr', label: 'French', icon: '🇫🇷' },
  ]}
  placeholder="Select a language"
/>

// With left icon showing selected option
<Select
  value={country}
  onChange={handleChange}
  options={countries}
  leftIcon={countries.find(c => c.value === country)?.icon}
  placeholder="Select a country"
/>

// With error state
<Select
  value={option}
  onChange={handleChange}
  options={options}
  error="Please select an option"
/>
```

**Props:**

- `value` (string, required) - Current selected value
- `onChange` (function, required) - Change handler
- `options` (array, required) - Array of `{ value, label, icon }` objects
- `placeholder` (string) - Placeholder text for empty state
- `error` (string) - Error message
- `disabled` (boolean) - Disable select
- `leftIcon` (node) - Icon on the left (e.g., flag emoji for selected option)
- `className` (string) - Additional CSS classes

**Features:**

- 🎨 Fully theme-aware (adapts to light/dark themes)
- 🖼️ Icon support in options and left side
- ⚡ Hover and focus states with smooth transitions
- ❌ Error state styling
- ⌨️ Full keyboard accessibility
- 📱 Responsive and mobile-friendly

### Button & Interactive Components

#### **Button**

Multi-variant button with loading states and icon support.

```jsx
import { Button } from './components/common';

// Primary button
<Button variant="primary" size="md" onClick={handleSubmit}>
  Submit
</Button>

// Button with loading state
<Button variant="primary" isLoading disabled>
  Saving...
</Button>

// Button with icon
<Button variant="outline" leftIcon={<PlusIcon />}>
  Add Item
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

**Props:**

- `variant` (string) - Style variant: `primary`, `secondary`, `outline`, `danger`, `ghost`
- `size` (string) - Size: `sm`, `md`, `lg`
- `isLoading` (boolean) - Show loading spinner
- `disabled` (boolean) - Disable button
- `leftIcon` (node) - Icon before text
- `rightIcon` (node) - Icon after text
- `fullWidth` (boolean) - Take full container width
- `onClick` (function) - Click handler
- `type` (string) - Button type: `button`, `submit`, `reset`
- `children` (node) - Button content

#### **Dropdown**

Customizable dropdown menu with animations.

```jsx
import { Dropdown, Button } from "./components/common";

<Dropdown
  trigger={<Button>Options</Button>}
  align="right"
  items={[
    {
      label: "Edit",
      icon: <EditIcon />,
      onClick: handleEdit,
    },
    {
      label: "Share",
      icon: <ShareIcon />,
      onClick: handleShare,
    },
    { divider: true },
    {
      label: "Delete",
      icon: <DeleteIcon />,
      onClick: handleDelete,
      danger: true,
    },
  ]}
/>;
```

**Props:**

- `trigger` (node) - Element that opens the dropdown
- `items` (array) - Menu items with label, icon, onClick, etc.
- `align` (string) - Alignment: `left`, `right`, `center`

### Container Components

#### **Card**

Container component with customizable padding and shadow.

```jsx
import { Card } from "./components/common";

<Card padding="md" shadow showBorder hover>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>;
```

**Props:**

- `padding` (string) - Padding size: `none`, `sm`, `md`, `lg`, `xl`
- `shadow` (boolean) - Add shadow
- `showBorder` (boolean) - Show border
- `hover` (boolean) - Hover effect
- `className` (string) - Additional CSS classes
- `children` (node) - Card content

#### **Modal**

Overlay modal dialog with animations.

```jsx
import { Modal, Button } from "./components/common";

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to continue?</p>
</Modal>;
```

**Props:**

- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close handler
- `title` (string) - Modal title
- `size` (string) - Size: `sm`, `md`, `lg`, `xl`, `full`
- `footer` (node) - Footer content (usually buttons)
- `closeOnOverlayClick` (boolean) - Close when clicking overlay
- `showCloseButton` (boolean) - Show X button
- `children` (node) - Modal content

### Display Components

#### **Badge**

Small label for status, categories, or counts.

```jsx
import { Badge } from './components/common';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>

// With icon
<Badge variant="primary" icon={<StarIcon />}>
  Premium
</Badge>

// Removable
<Badge variant="info" onRemove={() => console.log('Removed')}>
  Tag Name
</Badge>
```

**Props:**

- `variant` (string) - Style: `primary`, `success`, `warning`, `danger`, `info`, `neutral`
- `size` (string) - Size: `sm`, `md`
- `icon` (node) - Icon before text
- `onRemove` (function) - Remove handler (shows X button)
- `children` (node) - Badge content

#### **Avatar**

User profile picture with fallback to initials.

```jsx
import { Avatar } from './components/common';

// With image
<Avatar
  src="/images/user.jpg"
  alt="John Doe"
  size="md"
/>

// With initials fallback
<Avatar
  name="John Doe"
  size="lg"
  showBorder
/>
```

**Props:**

- `src` (string) - Image URL
- `alt` (string) - Alt text
- `name` (string) - User name (for initials)
- `size` (string) - Size: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- `showBorder` (boolean) - Show border
- `className` (string) - Additional CSS classes

#### **StatCard**

Display statistics with icon and label.

```jsx
import { StatCard } from "./components/common";

<StatCard
  value="1,234"
  label="Total Views"
  icon={<EyeIcon />}
  iconColor="var(--color-primary-500)"
  onClick={() => console.log("Clicked")}
/>;
```

**Props:**

- `value` (string|number) - Main statistic value
- `label` (string) - Description label
- `icon` (node) - Icon element
- `iconColor` (string) - Icon color (CSS variable or hex)
- `onClick` (function) - Click handler
- `className` (string) - Additional CSS classes

#### **Spinner**

Loading indicator with multiple sizes and variants.

```jsx
import { Spinner } from './components/common';

// Basic spinner
<Spinner />

// With text
<Spinner size="lg" text="Loading..." />

// Full page spinner
<Spinner fullPage />

// Different variants
<Spinner variant="white" />
<Spinner variant="current" />
```

**Props:**

- `size` (string) - Size: `xs`, `sm`, `md`, `lg`, `xl`
- `variant` (string) - Color: `primary`, `white`, `current`
- `text` (string) - Loading text
- `fullPage` (boolean) - Center in viewport
- `className` (string) - Additional CSS classes

#### **Toast**

Temporary notification messages.

```jsx
import { Toast } from "./components/common";

<Toast
  message="Profile updated successfully!"
  variant="success"
  duration={3000}
  position="top-right"
  onClose={() => setShowToast(false)}
/>;
```

**Props:**

- `message` (string) - Notification message
- `variant` (string) - Style: `success`, `error`, `warning`, `info`
- `duration` (number) - Auto-dismiss time in ms (0 = manual)
- `position` (string) - Position: `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`
- `showProgress` (boolean) - Show progress bar
- `onClose` (function) - Close handler

### Layout Components

#### **PageContainer**

Consistent page wrapper with max-width and padding.

```jsx
import { PageContainer } from "./components/layout";

<PageContainer>
  <h1>Page Title</h1>
  <p>Page content...</p>
</PageContainer>;
```

**Props:**

- `maxWidth` (string) - Max width: `sm`, `md`, `lg`, `xl`, `2xl`, `full`
- `noPadding` (boolean) - Remove padding
- `className` (string) - Additional CSS classes
- `children` (node) - Page content

#### **Section**

Section organizer with title and description.

```jsx
import { Section } from "./components/layout";

<Section
  title="Account Settings"
  description="Manage your account preferences"
  spacing="lg"
>
  {/* Section content */}
</Section>;
```

**Props:**

- `title` (string) - Section heading
- `description` (string) - Description text
- `spacing` (string) - Vertical spacing: `sm`, `md`, `lg`
- `showDivider` (boolean) - Show bottom border
- `className` (string) - Additional CSS classes
- `children` (node) - Section content

## 🚀 Usage Examples

### Creating a Complete Form

```jsx
import {
  PageContainer,
  Section,
  FormSection,
  FormField,
  Input,
  Button,
  Card,
} from "./components";

function SignupForm() {
  return (
    <PageContainer maxWidth="md">
      <Card padding="lg" shadow>
        <Section
          title="Create Account"
          description="Sign up for a new account"
        />

        <FormSection
          title="Personal Information"
          description="Tell us about yourself"
        >
          <FormField label="Full Name" required>
            <Input placeholder="John Doe" />
          </FormField>

          <FormField
            label="Email"
            helperText="We'll send a verification email"
            required
          >
            <Input type="email" placeholder="john@example.com" />
          </FormField>
        </FormSection>

        <FormSection title="Security" description="Choose a strong password">
          <FormField label="Password" required>
            <Input type="password" />
          </FormField>

          <FormField label="Confirm Password" required>
            <Input type="password" />
          </FormField>
        </FormSection>

        <div className="flex gap-3">
          <Button variant="ghost" fullWidth>
            Cancel
          </Button>
          <Button variant="primary" fullWidth>
            Sign Up
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
```

### Profile Settings with Statistics

```jsx
import {
  PageContainer,
  Section,
  Card,
  StatCard,
  Avatar,
  Button,
  Badge,
} from "./components";

function ProfilePage() {
  return (
    <PageContainer maxWidth="lg">
      {/* User Info Card */}
      <Card padding="lg" shadow>
        <div className="flex items-center gap-4">
          <Avatar src="/avatar.jpg" name="John Doe" size="xl" showBorder />
          <div className="flex-1">
            <h2>John Doe</h2>
            <Badge variant="success">Premium Member</Badge>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </Card>

      {/* Statistics */}
      <Section title="Your Statistics" spacing="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard value="42" label="Articles Read" icon={<BookIcon />} />
          <StatCard value="12" label="Saved Items" icon={<BookmarkIcon />} />
          <StatCard value="5h" label="Reading Time" icon={<ClockIcon />} />
        </div>
      </Section>
    </PageContainer>
  );
}
```

## 📝 Best Practices

1. **Always use PropTypes** - All components include PropTypes for validation
2. **Leverage theme variables** - Use CSS custom properties for colors
3. **Keep components focused** - Each component has a single responsibility
4. **Use semantic HTML** - Proper HTML elements for accessibility
5. **Document your usage** - Add comments when using complex component combinations
6. **Handle loading states** - Use Spinner or isLoading props appropriately
7. **Provide feedback** - Use Toast for user actions and confirmations
8. **Test responsiveness** - All components work on mobile and desktop

## 🎯 Next Steps

1. Create Toast context/provider for global toast notifications
2. Add more specialized components (SearchBar, Pagination, etc.)
3. Refactor existing pages to use new component library
4. Create Storybook documentation for visual component library
5. Add unit tests for all components

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [PropTypes Documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)
