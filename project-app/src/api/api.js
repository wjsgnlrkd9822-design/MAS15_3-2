import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("🔥 토큰 확인:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("🔥 헤더:", config.headers);

  return config;
});

export default api;