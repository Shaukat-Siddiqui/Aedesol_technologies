require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }]
            })
        });

        const data = await response.json();
        const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response received.";

        res.json({ reply: aiMessage });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch AI response." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
