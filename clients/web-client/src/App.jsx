import { useEffect, useState } from "react";
import { Button, Card, StatusBadge } from "@monorepo/ui-components";

const API_BASE = "/api";

export default function App() {
  const [health, setHealth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [error, setError] = useState("");

  async function loadHealth() {
    try {
      const res = await fetch("/health");
      const json = await res.json();
      setHealth(json.data);
    } catch {
      setHealth(null);
    }
  }

  async function loadTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const json = await res.json();
      if (res.ok) setTasks(json.data || []);
    } catch {
      /* task-service or Mongo not reachable yet */
    }
  }

  useEffect(() => {
    loadHealth();
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    setError("");
    if (!newTitle.trim()) return;

    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      return;
    }

    setNewTitle("");
    loadTasks();
  }

  async function askAi(e) {
    e.preventDefault();
    setError("");
    setAiReply("");
    if (!prompt.trim()) return;

    const res = await fetch(`${API_BASE}/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
      return;
    }

    setAiReply(json.data.text);
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: "22px" }}>web-client</h1>
      <p style={{ color: "#6b7280", marginTop: "-8px" }}>Talks to task-service on :5001</p>

      <Card title="Service health">
        {health ? (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <StatusBadge label="Mongo" status={health.mongo} />
            <StatusBadge label="Redis" status={health.redis} />
          </div>
        ) : (
          <p>Can't reach task-service - is it running on port 5001?</p>
        )}
        <div style={{ marginTop: "10px" }}>
          <Button variant="secondary" onClick={loadHealth}>Refresh</Button>
        </div>
      </Card>

      <Card title="Tasks (Mongo)">
        <form onSubmit={addTask} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New task title"
            style={{ flex: 1, padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
          />
          <Button type="submit">Add</Button>
        </form>
        <ul style={{ paddingLeft: "18px" }}>
          {tasks.map((t) => (
            <li key={t._id}>{t.title} - {t.status}</li>
          ))}
          {tasks.length === 0 && <p style={{ color: "#6b7280" }}>No tasks yet.</p>}
        </ul>
      </Card>

      <Card title="Ask Gemini">
        <form onSubmit={askAi} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something..."
            style={{ flex: 1, padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" }}
          />
          <Button type="submit">Ask</Button>
        </form>
        {aiReply && <p>{aiReply}</p>}
      </Card>

      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
    </div>
  );
}
