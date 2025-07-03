export async function uploadFile(userId, file) {
  const form = new FormData();
  form.append("user_id", userId);
  form.append("file", file);
  const res = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: form,
  });
  return await res.json();
}

export async function sendQuery(userId, query) {
  const form = new FormData();
  form.append("user_id", userId);
  form.append("query", query);
  const res = await fetch("http://localhost:8000/ask", {
    method: "POST",
    body: form,
  });
  return await res.json();
}
