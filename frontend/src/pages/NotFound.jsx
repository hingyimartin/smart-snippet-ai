import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6 max-w-md">
        <div
          className="text-8xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
          }}
        >
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Page is not found</h1>
          <p className="text-sm text-(--app-text-dim)">
            Seems like you lost. This page is not exists, removed or moved – but
            dont worry, your snippets are safe!
          </p>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <Link
            to="/"
            className="w-full max-w-xs rounded-2xl px-4 py-2 text-sm font-medium text-white text-center"
            style={{
              background:
                "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
            }}
          >
            Back to the homepage
          </Link>

          {user ? (
            <Link
              to="/snippets"
              className="w-full max-w-xs rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition text-center"
            >
              My snippets
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full max-w-xs rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full max-w-xs rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
