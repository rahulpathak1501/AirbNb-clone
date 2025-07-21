import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/SignupForm.css";
import { useNavigate } from "react-router-dom";

interface Props {
  onSignup: () => void;
  switchToLogin: () => void;
}

const SignupForm: React.FC<Props> = ({ onSignup, switchToLogin }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"" | "guest" | "host">(""); // default to guest
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/auth/signup`, {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setError("");
      onSignup();
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup} className="signup-form">
      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "guest" | "host")}
        required
      >
        <option value={""} disabled>
          Select a Role
        </option>
        <option value="guest">Guest</option>
        <option value="host">Host</option>
      </select>

      {error && <p className="error-message">{error}</p>}
      <button type="submit">Sign Up</button>

      <p className="text-sm">
        Already have an account?{" "}
        <button
          type="button"
          className="text-blue-600"
          onClick={() => navigate("/login")}
        >
          Log in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
