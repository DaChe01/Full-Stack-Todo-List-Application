import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend URL
});

// Add a request interceptor to include JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
