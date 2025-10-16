import { Link } from "react-router-dom";
import "../index.css";

export default function HomePage() {
  return (
    <div className="homepage-container animate-bgGradient min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <h1 className="homepage-title text-5xl sm:text-6xl font-bold mb-6 animate-fadeIn">
        Welcome to SPCL Task Manager 🚀
      </h1>
      <p className="homepage-subtext text-lg sm:text-xl mb-10 text-center animate-fadeIn delay-200">
        Stay organized, manage your tasks, and build consistency. Your productivity companion is here!
      </p>

      {/* CTA Buttons */}
      <div className="homepage-buttons flex flex-col sm:flex-row gap-6 animate-fadeIn delay-400">
        <Link
          to="/login"
          className="btn-login btn-hover-effect inline-block transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn-register btn-hover-effect inline-block transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50"
        >
          Register
        </Link>
      </div>

      {/* Footer / Branding */}
      <div className="homepage-footer">
        © 2025 SPCL Task Manager. Build, organize, repeat.
      </div>
    </div>
  );
}
