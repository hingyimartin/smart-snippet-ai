import { useEffect, useState } from "react";
import { fetchProfile, updateProfile, changePassword } from "../api/userApi";
import { fetchSnippets } from "../api/snippetApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snippets, setSnippets] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [passForm, setPassForm] = useState({
    current_password: "",
    new_password: "",
  });
  const [passSuccess, setPassSuccess] = useState(null);
  const [passError, setPassError] = useState(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    fetchSnippets()
      .then((res) => setSnippets(res.data.snippets))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProfile()
      .then((res) => {
        setProfile(res.data.user);
        setForm({
          username: res.data.user.username,
          email: res.data.user.email,
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
        });
      })
      .catch(() => setError("Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePassChange = (e) =>
    setPassForm({ ...passForm, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setFormLoading(true);
    try {
      const res = await updateProfile(form);
      setProfile((prev) => ({ ...prev, ...res.data.user }));
      setFormSuccess("Profile updated");
    } catch (err) {
      setFormError(err.response?.data?.error || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);
    setPassLoading(true);
    try {
      await changePassword(passForm);
      setPassSuccess("Password updated");
      setPassForm({ current_password: "", new_password: "" });
    } catch (err) {
      const data = err.response?.data;
      setPassError(
        data?.details?.join(" ") || data?.error || "Something went wrong",
      );
    } finally {
      setPassLoading(false);
    }
  };

  if (loading)
    return <div className="text-(--app-text-dim) text-sm">Loading...</div>;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-(--app-text-dim) mt-1">
          User details and settings
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Snippets", value: profile.snippet_count },
          { label: "Upvotes", value: profile.total_upvotes },
          { label: "Downvotes", value: profile.total_downvotes },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-(--app-border) bg-(--app-alt) p-4 text-center"
          >
            <div
              className="text-2xl font-semibold"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-(--app-text-dim) mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4"
      >
        <h2 className="font-semibold">Edit details</h2>

        <div className="flex gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-(--app-text-dim)">Firstname</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleFormChange}
              className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs text-(--app-text-dim)">Lastname</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleFormChange}
              className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleFormChange}
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleFormChange}
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />
        </div>

        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
            {formSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={formLoading}
          className="rounded-2xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60 transition"
          style={{
            background:
              "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
          }}
        >
          {formLoading ? "Save..." : "Save"}
        </button>
      </form>

      <form
        onSubmit={handlePassSubmit}
        className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4"
      >
        <h2 className="font-semibold">Change password</h2>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">
            Current password
          </label>
          <input
            name="current_password"
            type="password"
            value={passForm.current_password}
            onChange={handlePassChange}
            placeholder="••••••••"
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">New password</label>
          <input
            name="new_password"
            type="password"
            value={passForm.new_password}
            onChange={handlePassChange}
            placeholder="••••••••"
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />
        </div>

        {passError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {passError}
          </div>
        )}
        {passSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
            {passSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={passLoading}
          className="rounded-2xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60 transition"
          style={{
            background:
              "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
          }}
        >
          {passLoading ? "Save..." : "Change password"}
        </button>
      </form>

      <div className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">My snippets</h2>
          <a
            href="/snippets"
            className="text-xs text-(--app-text-dim) hover:text-(--app-text) transition"
          >
            All →
          </a>
        </div>

        {snippets.length === 0 ? (
          <p className="text-sm text-(--app-text-dim)">
            You don't have any snippets yet...
          </p>
        ) : (
          <div className="space-y-2">
            {snippets.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2.5 hover:border-(--app-accent) transition"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{s.title}</div>
                  <div className="text-xs text-(--app-text-dim)">
                    {s.language}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  {s.is_public ? (
                    <span
                      className="text-xs rounded-full px-2 py-0.5 text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                      }}
                    >
                      public
                    </span>
                  ) : (
                    <span className="text-xs rounded-full border border-(--app-border) bg-(--app-alt) px-2 py-0.5 text-(--app-text-dim)">
                      private
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
