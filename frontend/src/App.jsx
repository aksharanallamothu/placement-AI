import { useState, useRef, useEffect } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error connecting to backend" },
      ]);
    }
  };

  const sendFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Uploaded: ${file.name}` },
    ]);

    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", content: data.reply },
    ]);
  };

  return (
    <div style={styles.app}>
      {/* CHAT AREA */}
      <div style={styles.chatContainer}>
        {messages.length === 0 && (
          <div style={styles.empty}>
            <h2>Placement AI</h2>
            <p>Start chatting ✨</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageRow,
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={
                msg.role === "user"
                  ? styles.userBubble
                  : styles.aiBubble
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* INPUT BAR */}
      <div style={styles.inputWrapper}>
        <div style={styles.inputBox}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Placement AI..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
          />

          <button onClick={sendMessage} style={styles.sendBtn}>
            ➤
          </button>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={styles.file}
          />

          <button onClick={sendFile} style={styles.uploadBtn}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    background: "#212121",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "white",
    fontFamily: "system-ui",
  },

  chatContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "40px 20px",
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto",
  },

  empty: {
    textAlign: "center",
    marginTop: "150px",
    color: "#9ca3af",
  },

  messageRow: {
    display: "flex",
    marginBottom: "12px",
  },

  userBubble: {
    background: "#2f2f2f",
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "70%",
  },

  aiBubble: {
    background: "#444654",
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "70%",
  },

  inputWrapper: {
    padding: "15px",
    borderTop: "1px solid #333",
    display: "flex",
    justifyContent: "center",
  },

  inputBox: {
    display: "flex",
    gap: "10px",
    width: "100%",
    maxWidth: "800px",
    background: "#2f2f2f",
    padding: "10px",
    borderRadius: "12px",
    alignItems: "center",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "14px",
  },

  sendBtn: {
    background: "#10a37f",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "white",
  },

  uploadBtn: {
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "white",
  },

  file: {
    color: "white",
  },
};