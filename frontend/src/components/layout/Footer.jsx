import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-(--app-border) bg-(--app-alt) px-6 py-8 mt-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 space-y-2">
          <div className="font-semibold">
            Smart Snippet{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
              }}
            >
              AI
            </span>
          </div>
          <p className="text-xs text-(--app-text-dim) leading-relaxed">
            AI-powered code snippet & learning platform for developers.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-(--app-text-dim)">
            Navigation
          </div>
          <ul className="space-y-1.5">
            <li>
              <Link
                to="/"
                className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
              >
                Explore
              </Link>
            </li>
            <Link
              to="/sitemap"
              className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
            >
              Sitemap
            </Link>
            {user && (
              <li>
                <Link
                  to="/snippets"
                  className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
                >
                  My Snippets
                </Link>
              </li>
            )}
            {user && (
              <li>
                <Link
                  to="/favorites"
                  className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
                >
                  Favorites
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Account */}
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-(--app-text-dim)">
            Account
          </div>
          <ul className="space-y-1.5">
            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/snippets/new"
                    className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
                  >
                    New Snippet
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-(--app-text-dim)">
            Resources
          </div>
          <ul className="space-y-1.5">
            <li>
              <a
                href="https://developer.mozilla.org"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
              >
                MDN Web Docs
              </a>
            </li>
            <li>
              <a
                href="https://devdocs.io"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
              >
                DevDocs
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://stackoverflow.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-(--app-text-dim) hover:text-(--app-text) transition"
              >
                Stack Overflow
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-(--app-border) flex items-center justify-between">
        <div className="text-xs text-(--app-text-dim)">
          © {new Date().getFullYear()} Smart Snippet AI. All rights reserved.
        </div>
        <div className="text-xs text-(--app-text-dim)">
          Built with React & Node.js
        </div>
      </div>
    </footer>
  );
}
