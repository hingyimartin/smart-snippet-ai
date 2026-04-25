import { useState, useEffect } from "react";
import { useSnippet } from "../../context/SnippetContext";
import { useAuth } from "../../context/AuthContext";
import { fetchUsage } from "../../api/aiApi";

const ACTIONS = [
  {
    key: "explain",
    label: "Explain",
    icon: "🔍",
    description: "Understand the code",
  },
  {
    key: "improve",
    label: "Improve",
    icon: "⚡",
    description: "Optimize & refactor",
  },
  { key: "bugs", label: "Find Bugs", icon: "🐛", description: "Detect issues" },
];

export default function RightPanel({ open, setOpen }) {
  const { selectedSnippet, setSelectedSnippet } = useSnippet();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUsage().then((res) => setUsage(res.data));
    }
  }, [user]);

  const handleAnalyze = async (type) => {
    if (!selectedSnippet || !user) return;
    setLoading(true);
    setResult("");
    setActiveAction(type);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: selectedSnippet.code,
            language: selectedSnippet.language,
            type,
          }),
        },
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              setResult((prev) => (prev || "") + parsed.content);
            } catch {}
          }
        }
      }
    } catch (err) {
      setResult("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      if (user) fetchUsage().then((res) => setUsage(res.data));
    }
  };

  return (
    <>
      <aside
        className={`hidden md:flex flex-col border-l border-(--app-border) bg-(--app-alt) transition-[width] duration-300 ease-out overflow-hidden ${open ? "w-90" : "w-0"}`}
      >
        <div className="sticky top-0 z-10 border-b border-(--app-border) bg-(--app-alt)/85 backdrop-blur">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Insights</span>
              <span className="text-xs text-(--app-text-dim)">AI-powered</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2 py-1 text-sm text-(--app-text-dim) hover:text-(--app-text) hover:border-(--app-accent) transition"
            >
              {"→"}
            </button>
          </div>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Snippet info */}
          <div className="p-4 border-b border-(--app-border)">
            {selectedSnippet ? (
              <div className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {selectedSnippet.title}
                    </div>
                    <div className="text-xs text-(--app-text-dim)">
                      {selectedSnippet.language}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSnippet(null);
                      setResult(null);
                      setActiveAction(null);
                    }}
                    className="shrink-0 rounded-lg border border-(--app-border) bg-(--app-alt) px-2 py-1 text-xs text-(--app-text-dim) hover:border-(--app-accent) transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 text-xs text-(--app-text-dim) text-center">
                Select a snippet to analyze
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="p-4 border-b border-(--app-border)">
            {user && usage && (
              <div className="px-4 pb-4">
                <div className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-(--app-text-dim)">
                      Daily AI requests
                    </span>
                    <span
                      className={[
                        "font-medium",
                        usage.remaining <= 5
                          ? "text-red-500"
                          : "text-(--app-text)",
                      ].join(" ")}
                    >
                      {usage.remaining} / {usage.limit} remaining
                    </span>
                  </div>
                  <div className="w-full rounded-full bg-(--app-border) h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${(usage.count / usage.limit) * 100}%`,
                        background:
                          usage.remaining <= 5
                            ? "#ef4444"
                            : "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {!user ? (
              <div className="rounded-xl border border-(--app-accent) bg-(--app-surface-2) px-4 py-3 space-y-2 text-center">
                <div className="text-sm font-medium">
                  Sign in to use AI features
                </div>
                <div className="text-xs text-(--app-text-dim)">
                  Analyze, improve and debug your snippets with AI.
                </div>
                <a
                  href="/login"
                  className="inline-block mt-1 rounded-xl px-4 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                  }}
                >
                  Sign in
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {ACTIONS.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => handleAnalyze(action.key)}
                    disabled={!selectedSnippet || loading}
                    className={[
                      "w-full rounded-xl px-3 py-2.5 text-sm transition text-left",
                      activeAction === action.key && result
                        ? "border border-(--app-accent) bg-(--app-surface-2)"
                        : "border border-(--app-border) bg-(--app-surface-2) hover:border-(--app-accent)",
                      !selectedSnippet || loading
                        ? "opacity-40 cursor-not-allowed"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{action.icon}</span>
                      <div className="min-w-0">
                        <div className="font-medium text-sm">
                          {loading && activeAction === action.key
                            ? "Analyzing..."
                            : action.label}
                        </div>
                        <div className="text-xs text-(--app-text-dim)">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-xs text-(--app-text-dim) mb-2 font-medium uppercase tracking-wide">
                {ACTIONS.find((a) => a.key === activeAction)?.label}
              </div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          )}
        </div>
      </aside>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 items-center gap-2 rounded-l-2xl border border-(--app-border) bg-(--app-alt)/85 px-3 py-2 text-sm backdrop-blur hover:border-(--app-accent) transition"
          style={{ boxShadow: "var(--app-shadow)" }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--app-secondary)" }}
          />
          <span className="text-(--app-text-dim)">AI</span>
          <span className="font-medium">{"←"}</span>
        </button>
      )}
    </>
  );
}
