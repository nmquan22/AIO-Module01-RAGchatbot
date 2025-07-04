import { useState } from "react";
import { uploadFile, sendQuery } from "./api/rag";

import UploadForm from "./components/UploadForm";
import QueryForm from "./components/QueryForm";
import AnswerBox from "./components/AnswerBox";
import SourcesList from "./components/SourcesList";
import AuthPage from "./components/AuthPage"; 



function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [time, setTime] = useState(0);

  // ✅ Xử lý upload file
  const handleUpload = async () => {
    if (!file) return alert("❗ Vui lòng chọn file");
    setUploading(true);
    try {
      const res = await uploadFile(token, file);
      alert("✅ " + res.msg);
    } catch (e) {
      alert("❌ Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Xử lý truy vấn
  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");
    setSources([]);
    const start = performance.now();
    try {
      const res = await sendQuery(token, query);
      setAnswer(res.answer);
      setSources(res.sources || []);
    } catch (e) {
      setAnswer("❌ Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
      setTime(((performance.now() - start) / 1000).toFixed(2));
    }
  };

  // ✅ Nếu chưa login thì render AuthPage (gồm login / register)
  if (!token) {
    return <AuthPage setToken={setToken} />;
  }

  return (
    <div className="min-h-screen w-screen bg-white text-gray-800 p-6 sm:p-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-6 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-700">🤖 Trợ Lý RAG Chatbot</h1>
          <button
            onClick={() => {
            localStorage.removeItem("token");
            setToken("");
            }}
            className="bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-all"
          >
              🔓 Đăng xuất
          </button>
        </div>

        <UploadForm file={file} setFile={setFile} handleUpload={handleUpload} uploading={uploading} />
        <QueryForm query={query} setQuery={setQuery} handleAsk={handleAsk} loading={loading} />
        <AnswerBox answer={answer} time={time} />
        <SourcesList sources={sources} />
      </div>
    </div>
  );
}

export default App;
