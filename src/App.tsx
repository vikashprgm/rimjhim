import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [selectedModel, setSelectedModel] = useState<string>("gemma3:270m");
  const [embmodel,setEmbmodel] = useState<string>("snowflake-arctic-embed:22m")
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAsk() {
    if (!prompt.trim() || !selectedModel) return;
    setLoading(true);
    setResponse("");
    try {
      const result = await invoke<string>("ask", { model: selectedModel, prompt });
      setResponse(result);
    } catch (e) {
      setResponse(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  async function gen_embed () {
    try{
      const res = await invoke<string>("generate_embedding" , { input : "Hello World", model : embmodel })
      setResponse(res);
    }
    catch (e){
      setResponse(`Error: ${e}`);
    }
  }

  return (
    <div>
      <section style={{ marginTop: 24 }}>
        <label><strong>Prompt</strong></label>
        <textarea
          rows={4}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ask something…"
          style={{ background:"#000000", display: "block", width: "100%", marginTop: 6, padding: "8px", boxSizing: "border-box", color:"#FFFFFF" }}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !selectedModel}
          style={{ marginTop: 8 }}
        >
          {loading ? "Thinking…" : "Send"}
        </button>
      </section>

      {response && (
        <section style={{ marginTop: 24,}}>
          <label><strong>Response</strong></label>
          <pre style={{
            background: "#000000", padding: 12, borderRadius: 6,
            whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 6, 
          }}>
            {response}
          </pre>
        </section>
      )}

      <div>
        <button onClick={gen_embed}>
          Click to Generate Embedding
        </button>
      </div>
    </div>
  );
}

export default App;
