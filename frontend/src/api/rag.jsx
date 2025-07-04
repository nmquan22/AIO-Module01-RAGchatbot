export async function uploadFile(token, file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("http://localhost:8000/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  return await res.json();
}

export async function sendQuery(token, query) {
  const form = new FormData();
  form.append("query", query);
  const res = await fetch("http://localhost:8000/ask", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  return await res.json();
}
