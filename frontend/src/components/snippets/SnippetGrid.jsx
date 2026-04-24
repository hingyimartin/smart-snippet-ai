export default function SnippetGrid({ snippets, onDetail, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {snippets.map((snippet) => (
        <div
          key={snippet.id}
          className="rounded-2xl border border-(--app-border) bg-(--app-alt) p-4 space-y-3 hover:border-(--app-accent) transition flex flex-col"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-medium text-sm leading-tight">{snippet.title}</h2>
            <div className="flex gap-1 shrink-0">
              <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
                {snippet.language}
              </span>
              {snippet.is_public && (
                <span className="text-xs rounded-full px-2 py-0.5 text-white"
                  style={{ background: 'linear-gradient(135deg, var(--app-primary), var(--app-secondary))' }}>
                  pub
                </span>
              )}
            </div>
          </div>

          {snippet.description && (
            <p className="text-xs text-(--app-text-dim) line-clamp-2">{snippet.description}</p>
          )}

          {snippet.tags?.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {snippet.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
                  #{tag}
                </span>
              ))}
              {snippet.tags.length > 3 && (
                <span className="text-xs text-(--app-text-dim)">+{snippet.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-auto pt-2">
            <button
              onClick={() => onDetail(snippet)}
              className="flex-1 rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition"
            >
              Részletek
            </button>
            <button
              onClick={() => onEdit(snippet.id)}
              className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition"
            >
              Szerkesztés
            </button>
            <button
              onClick={() => onDelete(snippet.id)}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:border-red-400 transition"
            >
              Törlés
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}