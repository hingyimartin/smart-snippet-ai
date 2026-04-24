import { useState } from 'react';

export default function SnippetCard({ snippet, onDetail, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-(--app-border) bg-(--app-alt) p-5 space-y-3 hover:border-(--app-accent) transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h2 className="font-medium">{snippet.title}</h2>
          {snippet.description && (
            <p className="text-sm text-(--app-text-dim)">{snippet.description}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
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
      </div>

      <div className="relative">
        <button
          onClick={handleCopy}
          className={[
            "absolute top-2 right-2 rounded-lg border px-2 py-1 text-xs transition",
            copied
              ? "border-green-300 bg-green-50 text-green-600"
              : "border-(--app-border) bg-(--app-alt) text-(--app-text-dim) hover:border-(--app-accent)"
          ].join(" ")}
        >
          {copied ? '✓ Másolva!' : 'Másolás'}
        </button>
        <pre className="rounded-xl bg-(--app-surface-2) p-3 pt-8 text-xs overflow-x-auto">
          <code>{snippet.code}</code>
        </pre>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          {snippet.tags?.map((tag) => (
            <span key={tag} className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
            {snippet.language}
          </span>
          {snippet.is_public && (
            <span className="text-xs rounded-full px-2 py-0.5 text-white"
              style={{ background: 'linear-gradient(135deg, var(--app-primary), var(--app-secondary))' }}>
              publikus
            </span>
          )}
        </div>
      </div>
    </div>
  );
}