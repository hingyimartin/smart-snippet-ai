import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PUBLIC_LINKS = [
  { to: "/", label: "Home", description: "Landing page" },
  {
    to: "/explore",
    label: "Explore",
    description: "Browse public snippets from the community",
  },
  { to: "/login", label: "Sign in", description: "Log in to your account" },
  { to: "/register", label: "Register", description: "Create a new account" },
];

const PRIVATE_LINKS = [
  {
    to: "/snippets",
    label: "My Snippets",
    description: "View and manage your snippets",
  },
  {
    to: "/snippets/new",
    label: "New Snippet",
    description: "Create a new code snippet",
  },
  {
    to: "/favorites",
    label: "Favorites",
    description: "Your starred snippets",
  },
  {
    to: "/profile",
    label: "Profile",
    description: "Edit your account details and password",
  },
];

export default function Sitemap() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sitemap</h1>
        <p className="text-sm text-(--app-text-dim) mt-1">
          All available pages on Smart Snippet AI.
        </p>
      </div>

      {/* Public */}
      <div className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4">
        <h2 className="font-semibold">Public Pages</h2>
        <div className="space-y-2">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center justify-between rounded-xl border border-(--app-border) bg-(--app-surface-2) px-4 py-3 hover:border-(--app-accent) transition group"
            >
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{link.label}</div>
                <div className="text-xs text-(--app-text-dim)">
                  {link.description}
                </div>
              </div>
              <span className="text-(--app-text-dim) group-hover:text-(--app-text) transition">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Private */}
      <div className="rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Account Pages</h2>
          {!user && (
            <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
              Sign in required
            </span>
          )}
        </div>
        <div className="space-y-2">
          {PRIVATE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={[
                "flex items-center justify-between rounded-xl border px-4 py-3 transition group",
                user
                  ? "border-(--app-border) bg-(--app-surface-2) hover:border-(--app-accent)"
                  : "border-(--app-border) bg-(--app-surface-2) opacity-50 pointer-events-none",
              ].join(" ")}
            >
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{link.label}</div>
                <div className="text-xs text-(--app-text-dim)">
                  {link.description}
                </div>
              </div>
              <span className="text-(--app-text-dim) group-hover:text-(--app-text) transition">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
