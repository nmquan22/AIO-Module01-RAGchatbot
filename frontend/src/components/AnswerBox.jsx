function AnswerBox({ answer, time }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">📌 Trợ lý trả lời:</h2>
      <p className="whitespace-pre-line">{answer || "..."}</p>
      {time > 0 && (
        <p className="mt-2 text-sm text-gray-500">⏱️ Xử lý trong {time}s</p>
      )}
    </div>
  );
}
export default AnswerBox;