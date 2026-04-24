export default function RightPanel({ open, setOpen }) {
  return (
    <>
      <aside
        className={`hidden md:flex flex-col border-l border-(--app-border) bg-(--app-alt) transition-[width] duration-300 ease-out overflow-hidden ${open ? "w-90" : "w-0"}`}
      >
        <div className="sticky top-0 z-10 border-b border-(--app-border) bg-(--app-alt)/85 backdrop-blur">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Insights</span>
              <span className="text-xs text-(--app-text-dim)">
                Explain • Improve • Test
              </span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2 py-1 text-sm text-(--app-text-dim) hover:text-(--app-text) hover:border-(--app-accent) transition"
            >
              →
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3"></div>
      </aside>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 items-center gap-2 rounded-l-2xl border border-(--app-border) bg-(--app-alt)/85 px-3 py-2 text-sm backdrop-blur hover:border-(--app-accent) transition"
          style={{ boxShadow: "var(--app-shadow)" }}
          aria-label="Show panel"
          title="Show AI Insights"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--app-secondary)" }}
          />
          <span className="text-(--app-text-dim)">AI</span>
          <span className="font-medium">←</span>
        </button>
      )}
    </>
  );
}
