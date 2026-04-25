import { useEffect, useState } from "react";
import {
  BiCheck,
  BiCopy,
  BiLike,
  BiSolidLike,
  BiDislike,
  BiSolidDislike,
} from "react-icons/bi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { voteSnippet, toggleFavorite } from "../../api/snippetApi";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SnippetDetail({ snippet, onClose }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (snippet) {
      setUserVote(snippet.user_vote ?? null);
      setUpvotes(parseInt(snippet.upvotes) || 0);
      setDownvotes(parseInt(snippet.downvotes) || 0);
      setIsFavorited(snippet.is_favorited ?? false);
    }
  }, [snippet]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
    } catch {}
  };

  if (!snippet) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-(--app-border) bg-(--app-alt) p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h2 className="text-lg font-semibold">{snippet.title}</h2>
            {snippet.description && (
              <p className="text-sm text-(--app-text-dim)">
                {snippet.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition shrink-0"
          >
            ✕ Close
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
            {snippet.language}
          </span>
          {snippet.is_public && (
            <span
              className="text-xs rounded-full px-2 py-0.5 text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
              }}
            >
              public
            </span>
          )}
          {snippet.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-(--app-border) bg-(--app-surface-2) px-4 py-3 space-y-2">
          {snippet.username && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-(--app-text-dim)">User</span>
              <span className="font-medium">@{snippet.username}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-(--app-text-dim)">Created</span>
            <span className="font-medium">
              {formatDate(snippet.created_at)}
            </span>
          </div>
          {snippet.updated_at !== snippet.created_at && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-(--app-text-dim)">Last updated</span>
              <span className="font-medium">
                {formatDate(snippet.updated_at)}
              </span>
            </div>
          )}
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
            {copied ? <BiCheck size={18} /> : <BiCopy size={18} />}
          </button>
          <SyntaxHighlighter
            language={snippet.language}
            style={oneLight}
            customStyle={{
              borderRadius: "0.75rem",
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>

        <div className="flex items-center justify-between pt-1 pb-4 border-t border-(--app-border)">
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
    </div>
  );
}
