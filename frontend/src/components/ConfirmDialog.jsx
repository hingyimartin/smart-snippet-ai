export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Törlés megerősítése</h2>
          <p className="text-sm text-(--app-text-dim)">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
          >
            Törlés
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition"
          >
            Mégse
          </button>
        </div>
      </div>
    </div>
  );
}