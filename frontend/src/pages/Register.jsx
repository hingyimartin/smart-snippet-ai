import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        setError(data.details.join(" "));
      } else {
        setError(data?.error || "Valami hiba történt.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md rounded-3xl border border-(--app-border) bg-(--app-alt) p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Register</h1>
          <p className="text-sm text-(--app-text-dim) mt-1">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-(--app-text-dim)">Firstname</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="John"
                className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs text-(--app-text-dim)">Lastname</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-(--app-text-dim)">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="john_doe"
              className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-(--app-text-dim)">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-(--app-text-dim)">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60 transition"
            style={{
              background:
                "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
            }}
          >
            {loading ? "Register..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-(--app-text-dim)">
          Already have an account?{" "}
          <Link to="/login" className="text-(--app-primary) hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
