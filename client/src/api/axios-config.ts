import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (data) => {
    const token = localStorage.getItem("token");
    if (token) data.headers.Authorization = `Bearer ${token}`;
    return data;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
