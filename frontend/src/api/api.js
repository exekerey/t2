import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  const isAuthRoute =
    config.url?.includes("/auth/login") || config.url?.includes("/auth/register");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;