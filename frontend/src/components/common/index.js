/**
 * Common Components Index
 *
 * This file exports all reusable common components from a single location.
 * This makes it easier to import multiple components in other files.
 *
 * @example
 * // Instead of multiple imports:
 * import Button from './components/common/Button';
 * import Input from './components/common/Input';
 * import Card from './components/common/Card';
 *
 * // You can do:
 * import { Button, Input, Card } from './components/common';
 */

// Export all common components
export { default as Avatar } from "./Avatar";
export { default as Badge } from "./Badge";
export { default as Button } from "./Button";
export { default as Card } from "./Card";
export { default as CustomDropdown } from "./CustomDropdown";
export { default as Dropdown } from "./Dropdown";
export { default as FormField } from "./FormField";
export { default as FormSection } from "./FormSection";
export { default as Input } from "./Input";
export { default as Modal } from "./Modal";
export { default as Select } from "./Select";
export { default as Spinner } from "./Spinner";
export { default as StatCard } from "./StatCard";
export { default as Toast } from "./Toast";
