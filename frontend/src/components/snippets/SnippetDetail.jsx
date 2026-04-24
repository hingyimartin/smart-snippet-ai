import { useEffect, useState } from 'react';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function SnippetDetail({ snippet, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!snippet) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fejléc */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h2 className="text-lg font-semibold">{snippet.title}</h2>
            {snippet.description && (
              <p className="text-sm text-(--app-text-dim)">{snippet.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition shrink-0"
          >
            ✕ Bezár
          </button>
        </div>

        {/* Tagek + nyelv */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
            {snippet.language}
          </span>
          {snippet.is_public && (
            <span className="text-xs rounded-full px-2 py-0.5 text-white"
              style={{ background: 'linear-gradient(135deg, var(--app-primary), var(--app-secondary))' }}>
              publikus
            </span>
          )}
          {snippet.tags?.map((tag) => (
            <span key={tag} className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
              #{tag}
            </span>
          ))}
        </div>

        {/* Meta infók */}
        <div className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-4 py-3 space-y-2">
          {snippet.username && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-(--app-text-dim)">Készítette</span>
              <span className="font-medium">@{snippet.username}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-(--app-text-dim)">Létrehozva</span>
            <span className="font-medium">{formatDate(snippet.created_at)}</span>
          </div>
          {snippet.updated_at !== snippet.created_at && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-(--app-text-dim)">Utoljára módosítva</span>
              <span className="font-medium">{formatDate(snippet.updated_at)}</span>
            </div>
          )}
        </div>

        {/* Kód */}
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
          <pre className="rounded-xl bg-(--app-surface-2) p-4 pt-8 text-xs overflow-x-auto">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}