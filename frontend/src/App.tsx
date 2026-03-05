import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import Register from "./pages/Register";
import PublicRoute from "./components/PublicRoute";
import Products from "./pages/Products/Products";
import CreateProduct from "./pages/Products/CreateProduct";
import ShowProduct from "./pages/Products/ShowProduct";
import EditProduct from "./pages/Products/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />

      <Routes>
        {/* หน้า Public ทั่วไป */}
        <Route path="/" element={<Home />} />

        {/* หน้าสำหรับ Guest เท่านั้น (ถ้าล็อกอินแล้วเข้าไม่ได้) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* หน้าสำหรับ Member เท่านั้น (ถ้าไม่ได้ล็อกอินเข้าไม่ได้) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products/:id" element={<ShowProduct />} />
            <Route path="/products/:id/edit" element={<EditProduct />} />
            {/* หน้าอื่นๆ ที่ต้องล็อกอิน */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;