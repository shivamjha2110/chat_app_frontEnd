import { useState, useEffect } from "react";

export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<{ id: number; user: string; content: string; timestamp: string }[]>([]);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setStatus("Connected");
    ws.onmessage = (event) => setMessages((prev) => [...prev, JSON.parse(event.data)]);
    ws.onclose = () => setStatus("Disconnected");

    return () => ws.close();
  }, [url]);

  const sendMessage = (message: string) => {
    const ws = new WebSocket(url);
    ws.send(JSON.stringify({ user: "User1", content: message, timestamp: new Date().toLocaleTimeString() }));
  };

  return { messages, sendMessage, status };
}
