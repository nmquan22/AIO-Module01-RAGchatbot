import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthPage({ setToken }) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-md p-8 w-full max-w-md text-center">
        {showRegister ? (
          <>
            <RegisterForm onRegisterSuccess={() => setShowRegister(false)} />
            <p className="mt-4 text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setShowRegister(false)}
              >
                Đăng nhập
              </button>
            </p>
          </>
        ) : (
          <>
            <LoginForm setToken={setToken} />
            <p className="mt-4 text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setShowRegister(true)}
              >
                Đăng ký
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
