import pool from "../config/db.js";

export const vote = async (req, res) => {
  const userId = req.user.id;
  const snippetId = parseInt(req.params.id);
  const { vote_type } = req.body;

  if (vote_type === undefined || vote_type === null) {
    return res.status(400).json({ error: "Required" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM snippet_votes WHERE user_id = $1 AND snippet_id = $2",
      [userId, snippetId],
    );

    if (existing.rows.length > 0) {
      const current = existing.rows[0];

      if (current.vote_type === vote_type) {
        await pool.query(
          "DELETE FROM snippet_votes WHERE user_id = $1 AND snippet_id = $2",
          [userId, snippetId],
        );
        return res.json({ message: "Vote deleted", vote: null });
      }

      await pool.query(
        "UPDATE snippet_votes SET vote_type = $1, updated_at = NOW() WHERE user_id = $2 AND snippet_id = $3",
        [vote_type, userId, snippetId],
      );
      return res.json({ message: "Vote updated", vote: vote_type });
    }

    await pool.query(
      "INSERT INTO snippet_votes (user_id, snippet_id, vote_type) VALUES ($1, $2, $3)",
      [userId, snippetId, vote_type],
    );
    res.status(201).json({ message: "Vote saved", vote: vote_type });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
