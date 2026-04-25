import { useState } from "react";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { voteSnippet, toggleFavorite } from "../../api/snippetApi";
import { useAuth } from "../../context/AuthContext";

export default function SnippetCard({ snippet, onDetail, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [userVote, setUserVote] = useState(snippet.user_vote ?? null);
  const [upvotes, setUpvotes] = useState(parseInt(snippet.upvotes) || 0);
  const [downvotes, setDownvotes] = useState(parseInt(snippet.downvotes) || 0);
  const [isFavorited, setIsFavorited] = useState(snippet.is_favorited ?? false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = async (type) => {
    if (!user) return;
    try {
      const res = await voteSnippet(snippet.id, type);
      const newVote = res.data.vote;

      setUpvotes((prev) => {
        if (userVote === true) prev -= 1;
        if (newVote === true) prev += 1;
        return prev;
      });
      setDownvotes((prev) => {
        if (userVote === false) prev -= 1;
        if (newVote === false) prev += 1;
        return prev;
      });

      setUserVote(newVote);
    } catch {}
  };

  const handleFavorite = async () => {
    if (!user) return;
    try {
      const res = await toggleFavorite(snippet.id);
      setIsFavorited(res.data.favorited);
    } catch {
      console.error("Could not add to favorite");
    }
  };

  return (
    <div className="rounded-2xl border border-(--app-border) bg-(--app-alt) p-5 space-y-3 hover:border-(--app-accent) transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h2 className="font-medium">{snippet.title}</h2>
          {snippet.description && (
            <p className="text-sm text-(--app-text-dim)">
              {snippet.description}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onDetail(snippet)}
            className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition"
          >
            Details
          </button>
          <button
            onClick={() => onEdit(snippet.id)}
            className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(snippet.id)}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:border-red-400 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={handleCopy}
          className={[
            "absolute top-2 right-2 rounded-lg border px-2 py-1 text-xs transition",
            copied
              ? "border-green-300 bg-green-50 text-green-600"
              : "border-(--app-border) bg-(--app-alt) text-(--app-text-dim) hover:border-(--app-accent)",
          ].join(" ")}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
        <pre className="rounded-xl bg-(--app-surface-2) p-3 text-xs overflow-x-auto">
          <code>{snippet.code}</code>
        </pre>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          {snippet.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
            {snippet.language}
          </span>
          {snippet.is_public ? (
            <span
              className="text-xs rounded-full px-2 py-0.5 text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
              }}
            >
              public
            </span>
          ) : (
            <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
              private
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVote(true)}
            disabled={!user}
            className={[
              "flex items-center gap-1.5 text-sm transition",
              userVote === true
                ? "text-(--app-primary)"
                : "text-(--app-text-dim) hover:text-(--app-text)",
              !user ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {userVote === true ? (
              <BiSolidLike size={20} />
            ) : (
              <BiLike size={20} />
            )}
            <span>{upvotes}</span>
          </button>

          <button
            onClick={() => handleVote(false)}
            disabled={!user}
            className={[
              "flex items-center gap-1.5 text-sm transition",
              userVote === false
                ? "text-(--app-primary)"
                : "text-(--app-text-dim) hover:text-(--app-text)",
              !user ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {userVote === false ? (
              <BiSolidDislike size={20} />
            ) : (
              <BiDislike size={20} />
            )}
            <span>{downvotes}</span>
          </button>
        </div>

        <button
          onClick={handleFavorite}
          disabled={!user}
          className={[
            "flex items-center gap-1.5 text-sm transition",
            isFavorited
              ? "text-yellow-400"
              : "text-(--app-text-dim) hover:text-yellow-400",
            !user ? "opacity-40 cursor-not-allowed" : "",
          ].join(" ")}
        >
          {isFavorited ? <BsStarFill size={18} /> : <BsStar size={18} />}
        </button>
      </div>
    </div>
  );
}
