import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSnippetById, updateSnippet } from "../api/snippetApi";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "sql",
  "css",
  "html",
  "bash",
  "json",
  "yaml",
  "other",
];

export default function SnippetEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSnippetById(id)
      .then((res) => {
        const s = res.data.snippet;
        setForm({
          title: s.title,
          description: s.description || "",
          code: s.code,
          language: s.language,
          tags: s.tags?.join(", ") || "",
          is_public: s.is_public,
        });
      })
      .catch(() => setError("Could not load snippet"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);

      await updateSnippet(id, { ...form, tags });
      navigate("/snippets");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-red-500 text-sm">{error}</div>;
  if (!form)
    return <div className="text-(--app-text-dim) text-sm">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit snippet</h1>
        <p className="text-sm text-(--app-text-dim) mt-1">Modify the snippet</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4"
      >
        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">Language *</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">Code *</label>
          <textarea
            name="code"
            value={form.code}
            onChange={handleChange}
            rows={10}
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition font-mono resize-y"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-(--app-text-dim)">
            Tags (separated by commas)
          </label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. react, hooks, performance"
            className="w-full rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_public"
            id="is_public"
            checked={form.is_public}
            onChange={handleChange}
          />
          <label htmlFor="is_public" className="text-sm cursor-pointer">
            Public snippet (everyone can see it in the Explorer)
          </label>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60 transition"
            style={{
              background:
                "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
            }}
          >
            {loading ? "Save..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/snippets")}
            className="rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
