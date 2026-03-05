import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");
  
  // ถ้ามี Token แล้ว (ล็อกอินอยู่) ให้เด้งไป Dashboard
  // ถ้ายังไม่มี Token ให้แสดงหน้านั้นๆ (ผ่าน Outlet)
  return token ? <Navigate to="/dashboard" /> : <Outlet />;
}