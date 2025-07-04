// frontend/App.jsx
import { useState } from "react";
import { uploadFile, sendQuery } from "./api";

function App() {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("user123");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [time, setTime] = useState(0);

  const handleUpload = async () => {
    if (!file) return alert("❗Vui lòng chọn file");
    setUploading(true);
    try {
      const res = await uploadFile(userId, file);
      alert("✅ " + res.msg);
    } catch (e) {
      alert("❌ Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");
    setSources([]);
    const start = performance.now();
    try {
      const res = await sendQuery(userId, query);
      setAnswer(res.answer);
      setSources(res.sources || []);
    } catch (e) {
      setAnswer("❌ Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
      setTime(((performance.now() - start) / 1000).toFixed(2));
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white text-gray-800 p-6 sm:p-10 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">🤖 Trợ Lý RAG Chatbot</h1>

        {/* User ID */}
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="🔑 Nhập ID người dùng (mặc định: user123)"
        />

        {/* Upload */}
        <div className="space-y-2">
          <label className="block text-gray-600 font-semibold">📄 Tài liệu (PDF / TXT)</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "⏳ Đang tải lên..." : "📤 Tải lên tài liệu"}
          </button>
        </div>

        {/* Ask */}
        <div className="space-y-2">
          <label className="block text-gray-600 font-semibold">💬 Câu hỏi</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Ví dụ: YOLOv10 là gì?"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? "🤔 Đang suy nghĩ..." : "🚀 Hỏi"}
          </button>
        </div>

        {/* Answer */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">📌 Trợ lý trả lời:</h2>
          <p className="whitespace-pre-line">{answer || "..."}</p>
          {time > 0 && (
            <p className="mt-2 text-sm text-gray-500">⏱️ Xử lý trong {time}s</p>
          )}
        </div>

        {/* Sources */}
        {sources.length > 0 && (
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">📚 Tài liệu tham khảo:</h2>
            {sources.map((src, i) => (
              <p key={i} className="text-sm text-gray-700 mb-2">👉 {src}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
