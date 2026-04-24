export default function SnippetTable({ snippets, onDetail, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-(--app-border) bg-(--app-alt) overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--app-border) bg-(--app-surface-2)">
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">Cím</th>
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">Nyelv</th>
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">Tagek</th>
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">Láthatóság</th>
            <th className="text-right px-4 py-3 font-medium text-(--app-text-dim)">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {snippets.map((snippet, i) => (
            <tr
              key={snippet.id}
              className={[
                "border-b border-(--app-border) hover:bg-(--app-surface-2) transition",
                i === snippets.length - 1 ? "border-b-0" : ""
              ].join(" ")}
            >
              <td className="px-4 py-3">
                <div className="font-medium">{snippet.title}</div>
                {snippet.description && (
                  <div className="text-xs text-(--app-text-dim) mt-0.5 truncate max-w-48">{snippet.description}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
                  {snippet.language}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {snippet.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
                      #{tag}
                    </span>
                  ))}
                  {snippet.tags?.length > 2 && (
                    <span className="text-xs text-(--app-text-dim)">+{snippet.tags.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {snippet.is_public ? (
                  <span className="text-xs rounded-full px-2 py-0.5 text-white"
                    style={{ background: 'linear-gradient(135deg, var(--app-primary), var(--app-secondary))' }}>
                    publikus
                  </span>
                ) : (
                  <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
                    privát
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onDetail(snippet)}
                    className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}