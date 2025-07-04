function UploadForm({ file, setFile, handleUpload, uploading }) {
  return (
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
  );
}
export default UploadForm;