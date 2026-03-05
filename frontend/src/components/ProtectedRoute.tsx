import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  
  // ถ้าไม่มี Token ให้ส่งกลับไปหน้า Home หรือ Login
  return token ? <Outlet /> : <Navigate to="/login" />;
}