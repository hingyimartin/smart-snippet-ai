import pool from '../config/db.js';

export const createSnippet = async (req, res) => {
  const { title, description, code, language, tags, is_public } = req.body;
  const userId = req.user.id;

  if (!title || !code || !language) {
    return res.status(400).json({
      error: 'Cím, kód és nyelv megadása kötelező.',
      required: ['title', 'code', 'language']
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO snippets (user_id, title, description, code, language, tags, is_public)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, title, description || null, code, language, tags || [], is_public || false]
    );

    res.status(201).json({ snippet: result.rows[0] });
  } catch (err) {
    console.error('Create snippet hiba:', err);
    res.status(500).json({ error: 'Szerver hiba.' });
  }
};

export const getSnippets = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM snippets WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ snippets: result.rows });
  } catch (err) {
    console.error('Get snippets hiba:', err);
    res.status(500).json({ error: 'Szerver hiba.' });
  }
};

export const getSnippetById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM snippets WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Snippet nem található.' });
    }

    res.json({ snippet: result.rows[0] });
  } catch (err) {
    console.error('Get snippet hiba:', err);
    res.status(500).json({ error: 'Szerver hiba.' });
  }
};

export const updateSnippet = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, description, code, language, tags, is_public } = req.body;

  try {
    const existing = await pool.query(
      `SELECT * FROM snippets WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Snippet nem található.' });
    }

    const result = await pool.query(
      `UPDATE snippets
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           code = COALESCE($3, code),
           language = COALESCE($4, language),
           tags = COALESCE($5, tags),
           is_public = COALESCE($6, is_public),
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, description, code, language, tags, is_public, id, userId]
    );

    res.json({ snippet: result.rows[0] });
  } catch (err) {
    console.error('Update snippet hiba:', err);
    res.status(500).json({ error: 'Szerver hiba.' });
  }
};

export const deleteSnippet = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM snippets WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Snippet nem található.' });
    }

    res.json({ message: 'Snippet törölve.' });
  } catch (err) {
    console.error('Delete snippet hiba:', err);
    res.status(500).json({ error: 'Szerver hiba.' });
  }
};

export const getPublicSnippets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.username 
       FROM snippets s
       JOIN users u ON s.user_id = u.id
       WHERE s.is_public = true
       ORDER BY s.created_at DESC`
    );

    res.json({ snippets: result.rows });
  } catch (err) {
    console.error('Get public snippets hiba:', err);
    res.status(500).json({ error: 'Szerver hiba.' });
  }
};