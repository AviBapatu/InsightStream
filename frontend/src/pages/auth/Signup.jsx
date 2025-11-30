import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const Signup = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const loading = useAuthStore((s) => s.loading);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup(form.name, form.email, form.password);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div>
      <h2 className="title-auth">Create an account</h2>
      <p className="subtitle-auth">Start exploring personalised news</p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="form-section">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            className="input-style"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>

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
            autoComplete="new-password"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-style">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

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
