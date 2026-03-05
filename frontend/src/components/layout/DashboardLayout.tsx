import { useState } from "react";
// 1. แก้ไข Import ตรงนี้
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Zap,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
  Home
} from "lucide-react";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 2. ประกาศใช้ hook useNavigate
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    // 3. เรียกใช้ navigate ในรูปแบบฟังก์ชัน
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-50 via-white to-pink-50">

      {/* Sidebar - Animated Collapsible */}
      <aside
        className={cn(
          "bg-white/70 backdrop-blur-xl p-4 hidden md:flex flex-col border-r border-orange-100/50 shadow-2xl transition-all duration-500 ease-in-out relative",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 bg-white border border-orange-100 shadow-md rounded-full p-1 text-orange-600 hover:scale-110 transition-transform z-50"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Top Section: Logo */}
        <div className={cn("flex items-center gap-3 mb-10 px-2", isCollapsed && "justify-center")}>
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-2 rounded-xl shadow-lg shadow-orange-200 shrink-0">
            <Zap className="text-white w-6 h-6" />
          </div>
          {!isCollapsed && (
            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent truncate">
              TCL Visual
            </h1>
          )}
        </div>

        {/* Middle Section: Navigation */}
        <nav className="space-y-2 flex-1">
          <NavItem to="/" icon={<HomeIcon size={20} />} label="Home" active={pathname === "/"} isCollapsed={isCollapsed} />
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === "/dashboard"} isCollapsed={isCollapsed} />
          <NavItem to="/products" icon={<Package size={20} />} label="Products" active={pathname === "/products"} isCollapsed={isCollapsed} />

        </nav>

        {/* Bottom Section: Footer */}
        <div className={cn("pt-6 mt-6 border-t border-orange-100/50 space-y-2", isCollapsed && "items-center")}>
          <Link
            to="/docs"
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group text-slate-500 hover:bg-orange-50 hover:text-orange-600",
              isCollapsed && "justify-center"
            )}
          >
            <FileText size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span className="font-semibold">Documents</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group text-rose-500 hover:bg-rose-50 hover:text-rose-600",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut size={20} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-semibold">Exit</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// NavItem Component (ไม่มีการเปลี่ยนแปลง)
function NavItem({ to, icon, label, active, isCollapsed }: any) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group",
        active
          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-200"
          : "text-slate-500 hover:bg-orange-50 hover:text-orange-600",
        isCollapsed && "justify-center"
      )}
    >
      <span className={cn("shrink-0", active ? "text-white" : "group-hover:scale-110 transition-transform")}>
        {icon}
      </span>
      {!isCollapsed && <span className="font-semibold">{label}</span>}
    </Link>
  );
}