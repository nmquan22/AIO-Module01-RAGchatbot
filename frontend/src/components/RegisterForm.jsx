import { useState } from "react";

function RegisterForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Đăng ký thất bại");
      setMsg("✅ Đăng ký thành công, bạn có thể đăng nhập");
      onRegisterSuccess(); // chuyển sang login
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-700">📝 Đăng ký tài khoản</h2>
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
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={handleRegister}
      >
        ✅ Đăng ký
      </button>
      {msg && <p className="text-sm text-red-500">{msg}</p>}
    </div>
  );
}

export default RegisterForm;
