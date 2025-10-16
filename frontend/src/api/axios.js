import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-application-w05c.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});

// Add JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // token from login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

