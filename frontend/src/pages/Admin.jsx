import { useEffect, useState } from "react";
import {
  fetchStats,
  fetchUsers,
  fetchAdminSnippets,
  updateUserRole,
  deleteUser,
  deleteAdminSnippet,
  toggleVisibility,
} from "../api/adminApi";
import ConfirmDialog from "../components/ConfirmDialog";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "snippets", label: "Snippets" },
];

export default function Admin() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  useEffect(() => {
    setLoading(true);
    const calls = [fetchStats()];
    if (tab === "users") calls.push(fetchUsers());
    if (tab === "snippets") calls.push(fetchAdminSnippets());

    Promise.all([
      fetchStats(),
      ...(tab === "users" ? [fetchUsers()] : []),
      ...(tab === "snippets" ? [fetchAdminSnippets()] : []),
    ])
      .then(([s, second]) => {
        setStats(s.data);
        if (tab === "users" && second) setUsers(second.data.users);
        if (tab === "snippets" && second) setSnippets(second.data.snippets);
      })
      .finally(() => setLoading(false));
  }, [tab]);

  const handleRoleChange = async (id, role) => {
    try {
      const res = await updateUserRole(id, role);
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, role: res.data.user.role } : u,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Error updating role.");
    }
  };

  const handleDeleteUser = (id, username) => {
    setConfirm({
      message: `Are you sure you want to delete @${username}? This will also delete all their snippets.`,
      onConfirm: async () => {
        try {
          await deleteUser(id);
          setUsers(users.filter((u) => u.id !== id));
          setConfirm(null);
        } catch (err) {
          alert(err.response?.data?.error || "Error deleting user.");
        }
      },
    });
  };

  const handleDeleteSnippet = (id, title) => {
    setConfirm({
      message: `Are you sure you want to delete "${title}"?`,
      onConfirm: async () => {
        try {
          await deleteAdminSnippet(id);
          setSnippets(snippets.filter((s) => s.id !== id));
          setConfirm(null);
        } catch (err) {
          alert(err.response?.data?.error || "Error deleting snippet.");
        }
      },
    });
  };

  const handleToggleVisibility = async (id) => {
    try {
      const res = await toggleVisibility(id);
      setSnippets(
        snippets.map((s) =>
          s.id === id ? { ...s, is_public: res.data.snippet.is_public } : s,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.error || "Error updating visibility.");
    }
  };

  if (loading)
    return <div className="text-(--app-text-dim) text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-(--app-text-dim) mt-1">
          Manage users, snippets and monitor usage
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border border-(--app-border) bg-(--app-surface-2) p-1 gap-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "rounded-lg px-4 py-1.5 text-sm transition",
              tab === t.key
                ? "bg-(--app-alt) border border-(--app-border) font-medium"
                : "text-(--app-text-dim) hover:text-(--app-text)",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.users, icon: "👥" },
            { label: "Total Snippets", value: stats.snippets, icon: "📝" },
            { label: "Total Votes", value: stats.votes, icon: "👍" },
            { label: "AI Requests", value: stats.ai_requests, icon: "🤖" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-(--app-border) bg-(--app-alt) p-5 space-y-2"
            >
              <div className="text-2xl">{stat.icon}</div>
              <div
                className="text-2xl font-semibold"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-(--app-text-dim)">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div className="rounded-2xl border border-(--app-border) bg-(--app-alt) overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--app-border) bg-(--app-surface-2)">
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Snippets
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  AI Requests
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Role
                </th>
                <th className="text-right px-4 py-3 font-medium text-(--app-text-dim)">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  className={[
                    "border-b border-(--app-border) hover:bg-(--app-surface-2) transition",
                    i === users.length - 1 ? "border-b-0" : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">@{u.username}</div>
                    <div className="text-xs text-(--app-text-dim)">
                      {u.first_name} {u.last_name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-(--app-text-dim)">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-xs">{u.snippet_count}</td>
                  <td className="px-4 py-3 text-xs">{u.ai_requests}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="rounded-lg border border-(--app-border) bg-(--app-surface-2) px-2 py-1 text-xs outline-none focus:border-(--app-accent) transition"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:border-red-400 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Snippets */}
      {tab === "snippets" && (
        <div className="rounded-2xl border border-(--app-border) bg-(--app-alt) overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--app-border) bg-(--app-surface-2)">
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Author
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Language
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Votes
                </th>
                <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
                  Visibility
                </th>
                <th className="text-right px-4 py-3 font-medium text-(--app-text-dim)">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {snippets.map((s, i) => (
                <tr
                  key={s.id}
                  className={[
                    "border-b border-(--app-border) hover:bg-(--app-surface-2) transition",
                    i === snippets.length - 1 ? "border-b-0" : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium truncate max-w-48">
                      {s.title}
                    </div>
                    {s.description && (
                      <div className="text-xs text-(--app-text-dim) truncate max-w-48">
                        {s.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-(--app-text-dim)">
                    @{s.username}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
                      {s.language}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    👍 {s.upvotes} · 👎 {s.downvotes}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleVisibility(s.id)}
                      className={[
                        "text-xs rounded-full px-2 py-0.5 border transition",
                        s.is_public
                          ? "border-(--app-accent) text-white"
                          : "border-(--app-border) bg-(--app-surface-2) text-(--app-text-dim) hover:border-(--app-accent)",
                      ].join(" ")}
                      style={
                        s.is_public
                          ? {
                              background:
                                "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                            }
                          : {}
                      }
                    >
                      {s.is_public ? "public" : "private"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDeleteSnippet(s.id, s.title)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:border-red-400 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
