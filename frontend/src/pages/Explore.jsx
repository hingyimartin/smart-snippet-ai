import { useEffect, useState, useMemo } from "react";
import { fetchPublicSnippets } from "../api/snippetApi";
import SnippetCard from "../components/snippets/SnippetCard";
import SnippetGrid from "../components/snippets/SnippetGrid";
import SnippetTable from "../components/snippets/SnippetTable";
import SnippetDetail from "../components/snippets/SnippetDetail";

const VIEWS = [
  { key: "card", label: "☰ List" },
  { key: "grid", label: "⊞ Grid" },
  { key: "table", label: "≡ Table" },
];

export default function Explore() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(
    localStorage.getItem("viewState")
      ? localStorage.getItem("viewState")
      : "card",
  );
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  useEffect(() => {
    fetchPublicSnippets()
      .then((res) => setSnippets(res.data.snippets))
      .catch(() => setError("Could not load snippets"))
      .finally(() => setLoading(false));
  }, []);

  const languages = useMemo(() => {
    return [...new Set(snippets.map((s) => s.language))].sort();
  }, [snippets]);

  const allTags = useMemo(() => {
    return [...new Set(snippets.flatMap((s) => s.tags || []))].sort();
  }, [snippets]);

  const filtered = useMemo(() => {
    return snippets.filter((s) => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
      const matchLanguage = language ? s.language === language : true;
      const matchTags =
        selectedTags.length > 0
          ? selectedTags.every((tag) => s.tags?.includes(tag))
          : true;
      return matchSearch && matchLanguage && matchTags;
    });
  }, [snippets, search, language, selectedTags]);

  if (loading)
    return <div className="text-(--app-text-dim) text-sm">Loading...</div>;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Explore</h1>
          <p className="text-sm text-(--app-text-dim) mt-1">
            {filtered.length} public snippet
          </p>
        </div>
        <div className="flex rounded-xl border border-(--app-border) bg-(--app-surface-2) p-1 gap-1">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => {
                setView(v.key);
                localStorage.setItem("viewState", v.key);
              }}
              className={[
                "rounded-lg px-3 py-1.5 text-xs transition",
                view === v.key
                  ? "bg-(--app-alt) border border-(--app-border) font-medium"
                  : "text-(--app-text-dim) hover:text-(--app-text)",
              ].join(" ")}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Szűrők */}
      <div className="rounded-2xl border border-(--app-border) bg-(--app-alt) p-4">
        <div className="flex gap-3 flex-wrap items-start">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none focus:border-(--app-accent) transition"
          >
            <option value="">All languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <div className="relative">
            <button
              onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
              className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-sm outline-none hover:border-(--app-accent) transition min-w-48 flex items-center justify-between gap-2"
            >
              <span className="text-(--app-text-dim)">
                {selectedTags.length > 0
                  ? `${selectedTags.length} tag selected`
                  : "Filter by tags"}
              </span>
              <span className="text-(--app-text-dim)">
                {tagDropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            {tagDropdownOpen && (
              <div
                className="absolute z-10 mt-1 w-full min-w-48 rounded-xl border border-(--app-border) bg-(--app-alt) overflow-hidden"
                style={{ boxShadow: "var(--app-shadow)" }}
              >
                <div className="max-h-48 overflow-y-auto p-1 space-y-0.5">
                  {allTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-(--app-surface-2) cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag)
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag],
                          );
                        }}
                      />
                      <span>#{tag}</span>
                    </label>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="border-t border-(--app-border) px-3 py-2">
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-xs text-(--app-text-dim) hover:text-(--app-text) transition"
                    >
                      ✕ Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-10 text-center text-(--app-text-dim)">
          Could not find snippets with the filtered parameters
        </div>
      ) : (
        <>
          {view === "card" && (
            <div className="space-y-3">
              {filtered.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onDetail={setSelected}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
          {view === "grid" && (
            <SnippetGrid
              snippets={filtered}
              onDetail={setSelected}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
          {view === "table" && (
            <SnippetTable
              snippets={filtered}
              onDetail={setSelected}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          )}
        </>
      )}

      <SnippetDetail snippet={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
