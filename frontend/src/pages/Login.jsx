import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: '', password: '' });
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
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Valami hiba történt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md rounded-3xl border border-(--app-border) bg-(--app-alt) p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Bejelentkezés</h1>
          <p className="text-sm text-(--app-text-dim) mt-1">Lépj be a fiókodba</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-(--app-text-dim)">Email vagy felhasználónév</label>
            <input
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-(--app-text-dim)">Jelszó</label>
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
            style={{ background: 'linear-gradient(135deg, var(--app-primary), var(--app-secondary))' }}
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>

        <p className="text-center text-sm text-(--app-text-dim)">
          Még nincs fiókod?{' '}
          <Link to="/register" className="text-(--app-primary) hover:underline">
            Regisztrálj
          </Link>
        </p>
      </div>
    </div>
  );
}