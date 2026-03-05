// src/services/api.ts
import axios from "axios";

const api = axios.create({
  // เปลี่ยนเป็น URL Backend ของคุณ (เช่น http://localhost/api)
  baseURL: "https://thai-creative-lighting-web.test/backend/api/", 
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: แนบ Token ก่อนส่ง Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // แนบ Bearer Token ใน Header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: ดักจับกรณี Token หมดอายุ (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ถ้าได้รับ 401 แสดงว่า Token หมดอายุหรือไม่ได้ล็อกอิน
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect ไปหน้า Home หรือ Login
    }
    return Promise.reject(error);
  }
);

export default api;