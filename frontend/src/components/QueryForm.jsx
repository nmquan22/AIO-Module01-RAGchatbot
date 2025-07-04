function QueryForm({ query, setQuery, handleAsk, loading }) {
  return (
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
  );
}
export default QueryForm;