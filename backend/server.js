const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const fetch = require("node-fetch"); // http request ke liye
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/ask-ai", async (req, res) => {
  const { question } = req.body;

  try {
    // Ollama API ko hit karna
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",   // tumhara model
        prompt: question,  // user ka sawal
      }),
    });

   let finalAnswer = "";

    // Stream ko text reader se read karo
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let { value, done } = await reader.read();

    while (!done) {
      const chunk = decoder.decode(value, { stream: true });
      // Har line ek JSON object hoti hai
      chunk.split("\n").forEach((line) => {
        if (line.trim() !== "") {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              finalAnswer += data.response;
            }
          } catch (err) {
            console.error("JSON parse error:", err);
          }
        }
      });

      ({ value, done } = await reader.read());
    }

    res.json({ answer: finalAnswer });
  } catch (error) {
    console.error("Ollama API Error:", error);
    res.status(500).json({ error: "AI server error" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
