// frontend/App.jsx
import { useState } from "react";
import { uploadFile, sendQuery } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("user123");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const handleUpload = async () => {
    const res = await uploadFile(userId, file);
    alert(res.msg);
  };

  const handleAsk = async () => {
    const res = await sendQuery(userId, query);
    setAnswer(res.answer);
    setSources(res.sources);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📚 RAG Chatbot</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="bg-blue-500 text-white p-2 mt-2" onClick={handleUpload}>Upload</button>

      <div className="mt-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Hỏi gì đó..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="bg-green-500 text-white p-2 mt-2" onClick={handleAsk}>Hỏi</button>
      </div>

      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2 text-black">📌 Câu trả lời:</h2>
        <p className="text-black">{answer}</p>
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded">
        <h2 className="font-bold mb-2 text-black">📚 Dẫn chứng:</h2>
        {sources.map((src, i) => (
          <p key={i} className="text-sm text-gray-700 mb-2">👉 {src}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
