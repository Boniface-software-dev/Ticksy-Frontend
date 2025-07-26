import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5555",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

export default axiosInstance;