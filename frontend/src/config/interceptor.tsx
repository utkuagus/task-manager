import axios from "axios";

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    console.log("interceptor request called");
    const token = localStorage.getItem("access");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("interceptor response called");

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        const res = await axios.post("/api/api/token/refresh/", {
          refresh: refreshToken,
        });
        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest); // retry the original request
      } catch (err) {
        console.error("Token refresh failed:", err);
        // redirect to login or logout user
      }
    }

    return Promise.reject(error);
  }
);

export default api;
