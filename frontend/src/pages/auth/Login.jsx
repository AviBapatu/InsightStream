/**
 * Login Component
 *
 * User authentication login page with email and password.
 * Features:
 * - Email and password input fields
 * - Form validation
 * - Error handling and display
 * - Loading state during authentication
 * - Link to signup page
 *
 * Uses the new modular component library for consistent styling
 * and better maintainability.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button, Input, FormField, FormSection } from "../../components/common";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  // Form state
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
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
    setErrors({ email: "", password: "", general: "" });

    try {
      await login(form.email, form.password);
      navigate("/home");
    } catch (err) {
      setErrors({ ...errors, general: err.message || "Login failed" });
    }
  };

  return (
    <div>
      {/* Page Title */}
      <h2 className="title-auth">Sign in to your account</h2>
      <p className="subtitle-auth">Continue to your news dashboard</p>

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

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="form-section">
        <FormSection>
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
          <FormField label="Password" error={errors.password} required>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              autoComplete="current-password"
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
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </FormSection>
      </form>

      {/* Signup Link */}
      <p className="bottom-link">
        New here?{" "}
        <Link to="/signup" className="text-gold-700 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
