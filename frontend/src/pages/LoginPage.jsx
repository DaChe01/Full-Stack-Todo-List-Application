import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "../index.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name || "Developer");
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container animate-bgGradient flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="login-form animate-fadeIn"
        style={{ animationDelay: "0.2s" }}
      >
        <h1 className="login-title">Welcome Back</h1>
        <p className="homepage-subtext text-center mb-6">
          Log in to manage your tasks and stay productive!
        </p>

        {error && <p className="login-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <button type="submit" className="login-button mt-2">
          Login
        </button>

        {/* Register link */}
        <p>
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
