import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-8 md:p-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-(--app-border) bg-(--app-surface-2) px-3 py-1 text-xs text-(--app-text-dim)">
            AI-powered code snippet & learning platform
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight">
            Snippets, amiket{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}
            >
              tényleg megértesz
            </span>
            .
          </h1>

          <p className="mt-4 text-(--app-text-dim)">
            Tárold, rendszerezd, és kérj AI magyarázatot/optimalizálást. Letisztult layout, fókuszált munka.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/snippets"
              className="rounded-2xl px-4 py-2 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}
            >
              Browse snippets
            </Link>
            <Link
              to="/dashboard"
              className="rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}