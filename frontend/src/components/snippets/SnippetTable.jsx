import { useState } from "react";
import {
  BiLike,
  BiSolidLike,
  BiDislike,
  BiSolidDislike,
  BiCopy,
  BiCheck,
} from "react-icons/bi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { voteSnippet, toggleFavorite } from "../../api/snippetApi";
import { useAuth } from "../../context/AuthContext";

function SnippetTableRow({
  snippet,
  onDetail,
  onEdit,
  onDelete,
  index,
  total,
}) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
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
    } catch {}
  };

  return (
    <tr
      className={[
        "border-b border-(--app-border) hover:bg-(--app-surface-2) transition",
        index === total - 1 ? "border-b-0" : "",
      ].join(" ")}
    >
      <td className="px-4 py-3">
        <div className="font-medium">{snippet.title}</div>
        {snippet.description && (
          <div className="text-xs text-(--app-text-dim) mt-0.5 truncate max-w-48">
            {snippet.description}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-0.5 text-(--app-text-dim)">
          {snippet.language}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {snippet.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-full border border-(--app-border) bg-(--app-surface-2) px-2 py-1 text-(--app-text-dim)"
            >
              #{tag}
            </span>
          ))}
          {snippet.tags?.length > 2 && (
            <span className="text-xs text-(--app-text-dim)">
              +{snippet.tags.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
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
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => handleVote(true)}
            disabled={!user}
            className={[
              "flex items-center gap-1 text-sm transition",
              userVote === true
                ? "text-(--app-primary)"
                : "text-(--app-text-dim) hover:text-(--app-text)",
              !user ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {userVote === true ? (
              <BiSolidLike size={18} />
            ) : (
              <BiLike size={18} />
            )}
            <span>{upvotes}</span>
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={!user}
            className={[
              "flex items-center gap-1 text-sm transition",
              userVote === false
                ? "text-(--app-primary)"
                : "text-(--app-text-dim) hover:text-(--app-text)",
              !user ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {userVote === false ? (
              <BiSolidDislike size={18} />
            ) : (
              <BiDislike size={18} />
            )}
            <span>{downvotes}</span>
          </button>
          <button
            onClick={handleFavorite}
            disabled={!user}
            className={[
              "text-sm transition",
              isFavorited
                ? "text-yellow-400"
                : "text-(--app-text-dim) hover:text-yellow-400",
              !user ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {isFavorited ? <BsStarFill size={16} /> : <BsStar size={16} />}
          </button>
          <button
            onClick={handleCopy}
            className={[
              "text-sm transition",
              copied
                ? "text-green-600"
                : "text-(--app-text-dim) hover:text-(--app-text)",
            ].join(" ")}
          >
            {copied ? <BiCheck size={18} /> : <BiCopy size={18} />}
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onDetail(snippet)}
            className="w-1/3 rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition"
          >
            Details
          </button>
          <button
            onClick={() => onEdit(snippet.id)}
            className="w-1/3 rounded-xl border border-(--app-border) bg-(--app-surface-2) px-3 py-1.5 text-xs hover:border-(--app-accent) transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(snippet.id)}
            className="w-1/3 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:border-red-400 transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function SnippetTable({ snippets, onDetail, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-(--app-border) bg-(--app-alt) overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--app-border) bg-(--app-surface-2)">
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
              Title
            </th>
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
              Language
            </th>
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
              Tags
            </th>
            <th className="text-left px-4 py-3 font-medium text-(--app-text-dim)">
              Visibility
            </th>
            <th className="text-center px-4 py-3 font-medium text-(--app-text-dim)">
              Interactions
            </th>
            <th className="text-right px-4 py-3 font-medium text-(--app-text-dim)">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {snippets.map((snippet, i) => (
            <SnippetTableRow
              key={snippet.id}
              snippet={snippet}
              onDetail={onDetail}
              onEdit={onEdit}
              onDelete={onDelete}
              index={i}
              total={snippets.length}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
