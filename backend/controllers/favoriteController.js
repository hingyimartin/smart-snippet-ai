import pool from "../config/db.js";

export const toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const snippetId = parseInt(req.params.id);

  try {
    const existing = await pool.query(
      "SELECT id FROM snippet_favorites WHERE user_id = $1 AND snippet_id = $2",
      [userId, snippetId],
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM snippet_favorites WHERE user_id = $1 AND snippet_id = $2",
        [userId, snippetId],
      );
      return res.json({ favorited: false });
    }

    await pool.query(
      "INSERT INTO snippet_favorites (user_id, snippet_id) VALUES ($1, $2)",
      [userId, snippetId],
    );
    res.status(201).json({ favorited: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT s.*, u.username,
    COUNT(v.id) FILTER (WHERE v.vote_type = true)  AS upvotes,
    COUNT(v.id) FILTER (WHERE v.vote_type = false) AS downvotes,
    MAX(f.created_at) AS favorited_at
   FROM snippet_favorites f
   JOIN snippets s ON s.id = f.snippet_id
   JOIN users u ON u.id = s.user_id
   LEFT JOIN snippet_votes v ON v.snippet_id = s.id
   WHERE f.user_id = $1
   GROUP BY s.id, u.username
   ORDER BY MAX(f.created_at) DESC`,
      [userId],
    );

    res.json({ snippets: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
