import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div>
      <h2 className="title-auth">Sign in to your account</h2>
      <p className="subtitle-auth">Continue to your news dashboard</p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="form-section">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="input-style"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="input-style"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-style">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

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
