import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.id, u.username, u.email, u.first_name, u.last_name, u.role, u.created_at,
        COUNT(DISTINCT s.id) AS snippet_count,
        COALESCE(SUM(v.upvotes), 0) AS total_upvotes,
        COALESCE(SUM(v.downvotes), 0) AS total_downvotes
       FROM users u
       LEFT JOIN snippets s ON s.user_id = u.id
       LEFT JOIN (
         SELECT snippet_id,
           COUNT(*) FILTER (WHERE vote_type = true)  AS upvotes,
           COUNT(*) FILTER (WHERE vote_type = false) AS downvotes
         FROM snippet_votes
         GROUP BY snippet_id
       ) v ON v.snippet_id = s.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.user.id],
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { username, email, first_name, last_name } = req.body;

  if (!username || !email || !first_name || !last_name) {
    return res.status(400).json({ error: "Fields with * are required" });
  }

  try {
    const existingUsername = await pool.query(
      "SELECT id FROM users WHERE username = $1 AND id != $2",
      [username, req.user.id],
    );
    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const existingEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, req.user.id],
    );
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ error: "Email is already exists" });
    }

    const result = await pool.query(
      `UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, username, email, first_name, last_name, role`,
      [username, email, first_name.trim(), last_name.trim(), req.user.id],
    );

    res.json({ message: "Profil updated", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const passwordErrors = [];
  if (new_password.length < 8) passwordErrors.push("At least 8 characters");
  if (!/[A-Z]/.test(new_password))
    passwordErrors.push("At least 1 uppercase character");
  if (!/[a-z]/.test(new_password))
    passwordErrors.push("At least 1 lowercase character");
  if (!/[0-9]/.test(new_password)) passwordErrors.push("At least 1 number");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(new_password))
    passwordErrors.push("At least 1 special character");

  if (passwordErrors.length > 0) {
    return res
      .status(400)
      .json({
        error: "Password is not strong enough. ",
        details: passwordErrors,
      });
  }

  try {
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.user.id],
    );
    const match = await bcrypt.compare(
      current_password,
      result.rows[0].password,
    );

    if (!match) {
      return res.status(401).json({ error: "Current password is invalid" });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [hashed, req.user.id],
    );

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
