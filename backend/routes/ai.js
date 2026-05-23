const express = require("express");
const router = express.Router();

const MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_PROMPT = `Sen AptekFinder ilovasining AI yordamchisisisan. 
Toshkent va O'zbekistondagi dorixonalar, dori-darmonlar, ularning ta'siri, 
dozalash, nojo'ya ta'sirlar va tibbiy maslahatlar bo'yicha yordam berasan.
Har doim o'zbek tilida javob ber, ixcham va foydali bo'l.
Jiddiy tibbiy holatlarda shifokorga murojaat qilishni tavsiya et.`;

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res
      .status(500)
      .json({
        error: "GEMINI_API_KEY sozlanmagan (Render Environment Variables)",
      });
  }

  const { contents } = req.body;

  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ error: "contents massivi kerak" });
  }

  // System prompt + history
  const fullContents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    {
      role: "model",
      parts: [
        {
          text: "Tushunarli! Men AptekFinder AI yordamchisiman. Qanday yordam bera olaman?",
        },
      ],
    },
    ...contents,
  ];

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: fullContents,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const msg = data?.error?.message || `Gemini xatosi: ${geminiRes.status}`;
      return res.status(geminiRes.status).json({ error: msg });
    }

    res.json(data);
  } catch (err) {
    console.error("Gemini fetch xatosi:", err);
    res.status(500).json({ error: "Server ichki xatosi" });
  }
});

module.exports = router;
