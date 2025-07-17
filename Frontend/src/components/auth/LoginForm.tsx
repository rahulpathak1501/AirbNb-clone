import React, { useState } from "react";
import axios from "axios";

interface Props {
  onLogin: () => void;
  switchToSignup: () => void;
}

const LoginForm: React.FC<Props> = ({ onLogin, switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError("");
      onLogin();
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-3 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-3 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button className="bg-blue-600 text-white py-2 px-4 rounded w-full">
        Login
      </button>

      <p className="text-sm mt-3 text-center">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={switchToSignup}
          className="text-blue-600 underline"
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
