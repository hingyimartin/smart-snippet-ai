import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPTS = {
  explain: (code, language) =>
    `Explain this ${language} code snippet simply, step by step. Be concise and clear:\n\n${code}`,
  improve: (code, language) =>
    `Improve and optimize this ${language} code snippet. Show the better version and explain why it's better:\n\n${code}`,
  bugs: (code, language) =>
    `Find bugs and potential issues in this ${language} code snippet. If there are no bugs, state that clearly. Be specific:\n\n${code}`,
};

export const analyzeSnippet = async (req, res) => {
  const { code, language, type } = req.body;

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
