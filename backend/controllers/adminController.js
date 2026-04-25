import pool from "../config/db.js";

export const getStats = async (req, res) => {
  try {
    const [users, snippets, votes, aiUsage] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM snippets"),
      pool.query("SELECT COUNT(*) FROM snippet_votes"),
      pool.query("SELECT COALESCE(SUM(count), 0) AS total FROM ai_usage"),
    ]);

    res.json({
      users: parseInt(users.rows[0].count),
      snippets: parseInt(snippets.rows[0].count),
      votes: parseInt(votes.rows[0].count),
      ai_requests: parseInt(aiUsage.rows[0].total),
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.role, u.created_at,
        COUNT(DISTINCT s.id) AS snippet_count,
        COALESCE((
          SELECT SUM(a.count) FROM ai_usage a WHERE a.user_id = u.id
        ), 0) AS ai_requests
       FROM users u
       LEFT JOIN snippets s ON s.user_id = u.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`,
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: "You cannot change your own role." });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role",
      [role, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: "You cannot delete yourself." });
  }

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User deleted." });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const getSnippets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.username,
        COUNT(v.id) FILTER (WHERE v.vote_type = true)  AS upvotes,
        COUNT(v.id) FILTER (WHERE v.vote_type = false) AS downvotes
       FROM snippets s
       JOIN users u ON u.id = s.user_id
       LEFT JOIN snippet_votes v ON v.snippet_id = s.id
       GROUP BY s.id, u.username
       ORDER BY s.created_at DESC`,
    );
    res.json({ snippets: result.rows });
  } catch (err) {
    console.error("Admin get snippets error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const deleteSnippet = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM snippets WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found." });
    }
    res.json({ message: "Snippet deleted." });
  } catch (err) {
    console.error("Admin delete snippet error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const toggleSnippetVisibility = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE snippets SET is_public = NOT is_public WHERE id = $1 RETURNING id, is_public",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found." });
    }
    res.json({ snippet: result.rows[0] });
  } catch (err) {
    console.error("Toggle visibility error:", err);
    res.status(500).json({ error: "Server error." });
  }
};
