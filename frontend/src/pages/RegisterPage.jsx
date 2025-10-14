import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../index.css"; // Import your CSS file

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/tasks"); // redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h1 className="register-title">Register</h1>
        {error && <p className="register-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="register-input"
          required
        />

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
}
