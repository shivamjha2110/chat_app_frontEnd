import { useState, useEffect } from "react";
import Image from "next/image"; // Import the Image component

interface Message {
  user: string;
  content: string;
  timestamp: string;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState("Disconnected");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("https://chat-app-backen-x8ic.onrender.com/ws");
    setWs(websocket);

    websocket.onopen = () => setStatus("Connected");
    websocket.onclose = () => setStatus("Disconnected");
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => {
        const updatedMessages = [...prev, data];
        return updatedMessages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ); // Sort messages by timestamp
      });
    };

    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected yet!");
      return;
    }

    if (input.trim()) {
      const messageObj: Message = {
        user: "Admin",
        content: input,
        timestamp: new Date().toISOString(),
      };

      ws.send(JSON.stringify(messageObj));
      setMessages((prev) => [...prev, messageObj]); // Append and keep sorted
      setInput("");
    }
  };

  const sendFile = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const fileMessage: Message = {
          user: "Admin",
          content: `📎 ${file.name}`,
          timestamp: new Date().toISOString(),
        };

        ws.send(JSON.stringify({ type: "file", name: file.name, data: reader.result }));
        setMessages((prev) => [...prev, fileMessage]); // Append and sort
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-blue-100">
      <div className="bg-white w-full max-w-lg p-4 rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-center">Admin</h1>
        <p className={`text-center mb-2 ${status === "Connected" ? "text-green-500" : "text-red-500"}`}>
          {status}
        </p>

        {/* User Avatar */}
        <div className="flex justify-center mb-4">
          <Image src="/avatar.png" alt="User Avatar" width={100} height={100} />
        </div>

        {/* Message List */}
        <div className="border w-full h-64 overflow-auto p-2 rounded bg-gray-100">
          {messages.map((msg, index) => (
            <p key={index} className="p-2 bg-white my-1 rounded shadow">
              <strong>{msg.user}:</strong> {msg.content}
              <span className="text-gray-500 text-sm ml-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </p>
          ))}
        </div>

        {/* Input Field & Send Button */}
        <div className="flex w-full mt-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button className="p-2 bg-blue-500 text-white rounded-r" onClick={sendMessage}>
            Send
          </button>
        </div>

        {/* File Upload */}
        <div className="mt-2 flex items-center gap-2">
          <input
            type="file"
            className="border p-2 rounded"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          <button className="p-2 bg-green-500 text-white rounded" onClick={sendFile}>
            Upload 📎
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
