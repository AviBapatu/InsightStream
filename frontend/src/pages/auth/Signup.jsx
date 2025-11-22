/**
 * Signup Component
 *
 * User registration page with name, email, and password.
 * Features:
 * - Full name, email, and password input fields
 * - Form validation
 * - Error handling and display
 * - Loading state during registration
 * - Link to login page
 *
 * Uses the new modular component library for consistent styling
 * and better maintainability.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button, Input, FormField, FormSection } from "../../components/common";

const Signup = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const loading = useAuthStore((s) => s.loading);

  // Form state
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field when user types
    setErrors({ ...errors, [name]: "", general: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: "", email: "", password: "", general: "" });

    try {
      await signup(form.name, form.email, form.password);
      navigate("/home");
    } catch (err) {
      setErrors({ ...errors, general: err.message || "Signup failed" });
    }
  };

  return (
    <div>
      {/* Page Title */}
      <h2 className="title-auth">Create an account</h2>
      <p className="subtitle-auth">Start exploring personalised news</p>

      {/* General Error Message */}
      {errors.general && (
        <div
          className="text-sm mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: "var(--color-danger-50)",
            color: "var(--color-danger-700)",
            border: "1px solid var(--color-danger-200)",
          }}
        >
          {errors.general}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="form-section">
        <FormSection>
          {/* Full Name Field */}
          <FormField label="Full Name" error={errors.name} required>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.name}
              autoComplete="name"
              required
            />
          </FormField>

          {/* Email Field */}
          <FormField label="Email" error={errors.email} required>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              autoComplete="email"
              required
            />
          </FormField>

          {/* Password Field */}
          <FormField
            label="Password"
            error={errors.password}
            helperText="Must be at least 8 characters"
            required
          >
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              error={errors.password}
              autoComplete="new-password"
              required
            />
          </FormField>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
        </FormSection>
      </form>

      {/* Login Link */}
      <p className="bottom-link">
        Already have an account?{" "}
        <Link to="/login" className="text-gold-700 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
