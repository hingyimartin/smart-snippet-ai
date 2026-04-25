import { useEffect, useState } from "react";
import { fetchFavorites } from "../api/snippetApi";
import SnippetDetail from "../components/snippets/SnippetDetail";

export default function Favorites() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchFavorites()
      .then((res) => setSnippets(res.data.snippets))
      .catch(() => setError("Nem sikerült betölteni a kedvenceket."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-(--app-text-dim) text-sm">Betöltés...</div>;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kedvenc snippetek</h1>
        <p className="text-sm text-(--app-text-dim) mt-1">
          {snippets.length} kedvenc
        </p>
      </div>

      {snippets.length === 0 ? (
        <div className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-10 text-center text-(--app-text-dim)">
          Még nincs kedvenc snippeted. Az Explore oldalon csillaggal jelölhetsz
          meg snippeteket.
        </div>
      ) : (
        <div className="space-y-2">
          {snippets.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              className="flex items-center justify-between rounded-2xl border border-(--app-border) bg-(--app-alt) px-4 py-3 hover:border-(--app-accent) transition cursor-pointer"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="text-sm font-medium truncate">{s.title}</div>
                <div className="text-xs text-(--app-text-dim)">
                  {s.language} · @{s.username}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {s.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)"
                  >
                    #{tag}
                  </span>
                ))}
                <span className="text-(--app-text-dim)">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <SnippetDetail snippet={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
