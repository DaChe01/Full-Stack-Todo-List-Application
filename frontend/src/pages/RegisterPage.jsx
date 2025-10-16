import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "../index.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    console.log("Submitting registration", { name, email, password });  //for debugging

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", { name, email, password });

      console.log("Response:", res.data); // ✅ check backend response
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name || name);
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container animate-bgGradient flex items-center justify-center px-4">
      <form onSubmit={handleRegister} className="register-form animate-fadeIn" style={{ animationDelay: "0.2s" }}>
        <h1 className="register-title">Create Account</h1>
        {error && <p className="register-error">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="register-input"
          required
        />
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

        <button type="submit" className="register-button mt-2">
          Register
        </button>

        <p className="register-login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

