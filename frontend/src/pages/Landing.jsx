import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI-Powered Analysis",
    description:
      "Explain, improve, and debug your code snippets with the power of GPT-4o. Get instant insights without leaving your workflow.",
  },
  {
    icon: "✨",
    title: "Syntax Highlighting",
    description:
      "Beautiful, readable code with support for all major programming languages. Your snippets always look their best.",
  },
  {
    icon: "🗂️",
    title: "Organize & Filter",
    description:
      "Tag your snippets, filter by language, and switch between list, grid, and table views to find what you need fast.",
  },
  {
    icon: "🌍",
    title: "Explore & Discover",
    description:
      "Browse public snippets from other developers. Vote on your favorites and get inspired by the community.",
  },
  {
    icon: "⭐",
    title: "Save Favorites",
    description:
      "Star snippets you love and access them anytime from your profile. Never lose a useful piece of code again.",
  },
  {
    icon: "🔐",
    title: "Secure & Private",
    description:
      "Your private snippets stay private. Full JWT authentication with access and refresh tokens keeps your data safe.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create an account",
    description:
      "Sign up in seconds. No credit card required, just your email and a username.",
  },
  {
    step: "02",
    title: "Add your snippets",
    description:
      "Paste your code, add a title, tags and choose a language. Keep it private or share it with the world.",
  },
  {
    step: "03",
    title: "Analyze with AI",
    description:
      "Select any snippet and hit Explain, Improve or Find Bugs. Get instant AI feedback right in the sidebar.",
  },
  {
    step: "04",
    title: "Explore & grow",
    description:
      "Browse the community, vote on snippets, save your favorites and level up your coding knowledge.",
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-8 md:p-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-(--app-border) bg-(--app-surface-2) px-3 py-1 text-xs text-(--app-text-dim)">
            AI-powered code snippet & learning platform
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight">
            Snippets, that you <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
              }}
            >
              really understand
            </span>
            .
          </h1>

          <p className="mt-4 text-(--app-text-dim) text-lg leading-relaxed">
            Store, organize and analyze your code snippets with AI. Clean
            layout, focused work — built for developers who want to learn, not
            just copy.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="rounded-2xl px-5 py-2.5 text-sm font-medium text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
              }}
            >
              Browse snippets
            </Link>
            {user ? (
              <Link
                to="/snippets"
                className="rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-5 py-2.5 text-sm hover:border-(--app-accent) transition"
              >
                My Snippets →
              </Link>
            ) : (
              <Link
                to="/register"
                className="rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-5 py-2.5 text-sm hover:border-(--app-accent) transition"
              >
                Get Started →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-2xl font-semibold">Everything you need</h2>
          <p className="text-sm text-(--app-text-dim) mt-1">
            A complete toolkit for storing, understanding and sharing code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-(--app-border) bg-(--app-alt) p-5 space-y-2 hover:border-(--app-accent) transition"
            >
              <div className="text-2xl">{f.icon}</div>
              <div className="font-medium">{f.title}</div>
              <p className="text-sm text-(--app-text-dim) leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-8 md:p-10 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">How it works</h2>
          <p className="text-sm text-(--app-text-dim) mt-1">
            Get up and running in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEPS.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div
                className="text-2xl font-bold shrink-0 bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                }}
              >
                {s.step}
              </div>
              <div className="space-y-1">
                <div className="font-medium">{s.title}</div>
                <p className="text-sm text-(--app-text-dim) leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-8 md:p-10">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-semibold">
            Ready to write code you{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
              }}
            >
              actually understand?
            </span>
          </h2>
          <p className="text-sm text-(--app-text-dim) leading-relaxed">
            Join Smart Snippet AI and start building your personal code library
            today. It's free to get started.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {user ? (
              <>
                <Link
                  to="/snippets/new"
                  className="rounded-2xl px-5 py-2.5 text-sm font-medium text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                  }}
                >
                  + New Snippet
                </Link>
                <Link
                  to="/explore"
                  className="rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-5 py-2.5 text-sm hover:border-(--app-accent) transition"
                >
                  Explore
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-2xl px-5 py-2.5 text-sm font-medium text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                  }}
                >
                  Create free account
                </Link>
                <Link
                  to="/explore"
                  className="rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-5 py-2.5 text-sm hover:border-(--app-accent) transition"
                >
                  Browse snippets
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
