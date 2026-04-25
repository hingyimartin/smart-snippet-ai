import OpenAI from "openai";
import pool from "../config/db.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DAILY_LIMIT = 20;

const PROMPTS = {
  explain: (code, language) =>
    `Explain this ${language} code snippet simply, step by step. Be concise and clear:\n\n${code}`,
  improve: (code, language) =>
    `Improve and optimize this ${language} code snippet. Show the better version and explain why it's better:\n\n${code}`,
  bugs: (code, language) =>
    `Find bugs and potential issues in this ${language} code snippet. If there are no bugs, state that clearly. Be specific:\n\n${code}`,
};

export const getUsage = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT count FROM ai_usage WHERE user_id = $1 AND date = CURRENT_DATE`,
      [userId],
    );

    const count = result.rows[0]?.count || 0;
    res.json({ count, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - count });
  } catch (err) {
    console.error("Get usage error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

export const analyzeSnippet = async (req, res) => {
  const { code, language, type } = req.body;
  const userId = req.user.id;

  if (!code || !language || !type) {
    return res
      .status(400)
      .json({ error: "code, language and type are required." });
  }

  if (!PROMPTS[type]) {
    return res
      .status(400)
      .json({ error: "Invalid type. Must be: explain, improve, bugs." });
  }

  try {
    // Check daily limit
    const usageResult = await pool.query(
      `INSERT INTO ai_usage (user_id, date, count)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (user_id, date)
       DO UPDATE SET count = ai_usage.count + 1
       RETURNING count`,
      [userId],
    );

    const currentCount = usageResult.rows[0].count;

    if (currentCount > DAILY_LIMIT) {
      await pool.query(
        `UPDATE ai_usage SET count = $1 WHERE user_id = $2 AND date = CURRENT_DATE`,
        [DAILY_LIMIT, userId],
      );
      return res.status(429).json({
        error: `Daily limit of ${DAILY_LIMIT} AI requests reached. Try again tomorrow.`,
      });
    }

    // Streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: PROMPTS[type](code, language) }],
      stream: true,
      max_tokens: 1000,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI error occurred." });
  }
};
