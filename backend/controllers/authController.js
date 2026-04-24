import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
};

const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [userId, token, expiresAt],
  );
};

export const register = async (req, res) => {
  const { username, email, first_name, last_name, password } = req.body;

  if (!username || !email || !first_name || !last_name || !password) {
    return res.status(400).json({
      error: "Fields with * are required",
      required: ["username", "email", "first_name", "last_name", "password"],
    });
  }

  if (
    !/^[a-zA-Z0-9_-]+$/.test(username) ||
    username.length < 3 ||
    username.length > 50
  ) {
    return res.status(400).json({
      error: "Username must be between 3-50",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (first_name.trim().length < 2 || last_name.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "First and lastname must be at least 2 characters" });
  }

  const passwordErrors = [];
  if (password.length < 8) passwordErrors.push("At least 8 characters");
  if (!/[A-Z]/.test(password))
    passwordErrors.push("At least 1 uppercase character");
  if (!/[a-z]/.test(password))
    passwordErrors.push("At least 1 lowercase character");
  if (!/[0-9]/.test(password)) passwordErrors.push("At least 1 number");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    passwordErrors.push("At least 1 special characgter");

  if (passwordErrors.length > 0) {
    return res
      .status(400)
      .json({
        error: "Password is not string enough. ",
        details: passwordErrors,
      });
  }

  try {
    const existingEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const existingUsername = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );
    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, first_name, last_name, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, first_name, last_name, role, created_at`,
      [username, email, first_name.trim(), last_name.trim(), hashedPassword],
    );

    const user = result.rows[0];

    res.status(201).json({
      message: "Successful register",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Username/email is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $1",
      [identifier],
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid username/email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username/email" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Successful login",
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "Refresh token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const stored = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
      [token],
    );

    if (stored.rows.length === 0) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);
    const user = userResult.rows[0];

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Successful logout" });
};

export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = $1",
      [req.user.id],
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
