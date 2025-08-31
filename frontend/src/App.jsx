import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // step 1: backend ko request bhejna
  const askAI = async () => {
    const res = await fetch("http://localhost:5000/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🤖 BlinkFixServe AI Helper bot..........</h1>

      {/* user input box */}
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Apna sawal type kare..."
        style={{ width: "300px", marginRight: "10px" }}
      />

      {/* button */}
      <button onClick={askAI}>Ask</button>

      {/* AI ka jawab */}
      <div style={{ marginTop: "20px" }}>
        <b>AI Answer:</b>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default App;
