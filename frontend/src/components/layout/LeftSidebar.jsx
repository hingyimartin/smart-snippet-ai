import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const nav = [
  { to: "/", label: "Home" },
];

export default function LeftSidebar() {
  const { pathname } = useLocation();

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
        {nav.map((item) => {
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

      {/* User section */}
      <div className="mt-auto p-4 border-t border-(--app-border) space-y-3">
        <button className="w-full rounded-2xl px-4 py-2 text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}>Register</button>
        <button className="w-full rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition">Login</button>
         <button className="w-full rounded-2xl border border-(--app-border) bg-(--app-surface-2) px-4 py-2 text-sm hover:border-(--app-accent) transition">Logout</button>
      </div>
    </aside>
  );
}