// components/LoginForm.jsx
import { useState } from "react";

function LoginForm({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Đăng nhập thất bại");

      localStorage.setItem("token", data.access_token);
      setMsg("✅ Đăng nhập thành công");
      setToken(data.access_token);
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-blue-700">🔐 Đăng nhập</h2>
      <input
        type="email"
        className="w-full border rounded p-2 text-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full border rounded p-2 text-black"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleLogin}
      >
        🚪 Đăng nhập
      </button>
      {msg && <p className="text-sm text-red-500">{msg}</p>}
    </div>
  );
}

export default LoginForm;
