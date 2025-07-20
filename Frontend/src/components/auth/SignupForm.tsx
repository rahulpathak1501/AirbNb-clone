import React, { useState } from "react";
import axios from "axios";

interface Props {
  onSignup: () => void;
  switchToLogin: () => void;
}

const SignupForm: React.FC<Props> = ({ onSignup, switchToLogin }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/auth/signup`, {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError("");
      onSignup();
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <input
        type="text"
        placeholder="Name"
        className="border p-2 mb-3 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button className="bg-green-600 text-white py-2 px-4 rounded w-full">
        Sign Up
      </button>
      <p className="text-sm mt-3 text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="text-blue-600 underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
