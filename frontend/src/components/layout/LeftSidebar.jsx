import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const publicNav = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
];

const privateNav = [
  { to: "/snippets", label: "Snippets" },
];

export default function LeftSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const navItems = user ? [...publicNav, ...privateNav] : publicNav;

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-(--app-border) bg-(--app-alt)">
      <div className="px-5 py-4 border-b border-(--app-border)">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="font-semibold leading-tight">Smart Snippet <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}
            >
              AI
            </span></div>
            <div className="text-xs text-(--app-text-dim) truncate">
              AI-powered snippet tool
            </div>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={[
                "group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-(--app-surface-2) border border-(--app-accent)"
                  : "border border-transparent hover:border-(--app-border) hover:bg-(--app-surface-2)",
              ].join(" ")}
            >
              <span
                className={
                  active
                    ? "font-medium"
                    : "text-(--app-text-dim) group-hover:text-(--app-text)"
                }
              >
                {item.label}
              </span>

              {active && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "var(--app-primary)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-(--app-border) space-y-3">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                style={{ background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}>
                {user.username[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{user.username}</div>
                <div className="text-xs text-(--app-text-dim) truncate">{user.role}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register"
              className="block w-full rounded-2xl px-4 py-2 text-sm font-medium text-white text-center"
              style={{ background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}>
              Register
            </Link>
            <Link to="/login"
              className="block w-full rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition text-center">
              Login
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}