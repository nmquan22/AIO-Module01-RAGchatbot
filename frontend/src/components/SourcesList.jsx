function SourcesList({ sources }) {
  if (!sources.length) return null;

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">📚 Tài liệu tham khảo:</h2>
      {sources.map((src, i) => (
        <p key={i} className="text-sm text-gray-700 mb-2">👉 {src}</p>
      ))}
    </div>
  );
}
export default SourcesList;
