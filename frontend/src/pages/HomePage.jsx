import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css"; // ✅ relative import

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to SPCL Task Manager</h1>

      <div className="homepage-buttons">
        <button className="btn-login" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn-register" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>

      <p className="homepage-subtext">
        Manage your tasks efficiently and stay productive. Login or register to start organizing your day!
      </p>
    </div>
  );
}
