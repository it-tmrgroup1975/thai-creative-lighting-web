import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";
import { ProductTable } from "../../components/dashboard/ProductTable";
import { FilterSidebar } from "../../components/catalog/FilterSidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Loader2,
  LayoutGrid,
  ChevronDown,
  X,
  Filter
} from "lucide-react";
import type { Product } from "../../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // สถานะการยุบ/ขยาย Sidebar

  // State สำหรับการกรอง
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const navigate = useNavigate();
  const stylesList = ["Classic", "Modern", "Semi-Modern"];

  const fetchProducts = async () => {
    try {
      const response = await api.get("/get_products.php");
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setProducts(data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFilter = (list: string[], setList: (val: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter(i => i !== value) : [...list, value]);
  };

  // ระบบ Multi-Filter (Search + Style + Application)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStyle =
        selectedStyles.length === 0 || selectedStyles.includes(product.style);

      const matchesApp =
        selectedApps.length === 0 || selectedApps.includes(product.application_name || "");

      return matchesSearch && matchesStyle && matchesApp;
    });
  }, [products, searchQuery, selectedStyles, selectedApps]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid className="text-orange-500" size={24} />
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Product Inventory</h2>
          </div>
          <p className="text-slate-500 font-medium">จัดการรายการโคมไฟและระบบโซล่าเซลล์ของคุณ</p>
        </div>
        <Button
          onClick={() => navigate("/products/create")}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl gap-2 font-bold shadow-lg shadow-orange-500/20 transition-all px-6 h-12"
        >
          <Plus size={20} /> Add Product
        </Button>
      </div>

      <div className="flex gap-6 items-start relative">
        {/* 2. Sidebar ที่ปรับขนาดพื้นที่ได้ (Flexible Sidebar) */}
        {/* <aside
          className={`shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? "w-40 opacity-100" : "w-0 opacity-0"
            }`}
        >
          <FilterSidebar
            selectedApps={selectedApps} // Ensure this state is [string, setString]
            onAppChange={(app) => toggleFilter(selectedApps, setSelectedApps, app)}
          />
        </aside> */}

        {/* 2. Main Content ที่ขยายขนาดตาม Sidebar (Children Area) */}
        <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* ปุ่ม Toggle Sidebar (เพิ่ม UX ในการควบคุมพื้นที่) */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`rounded-xl border-slate-200 transition-colors ${!isSidebarOpen && "bg-orange-50 border-orange-200 text-orange-600"}`}
            >
              <Filter size={20} />
            </Button>

            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <Input
                placeholder="ค้นหาชื่อรุ่น หรือ รหัสสินค้า..."
                className="pl-12 h-12 rounded-2xl bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-orange-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 1. Multi Dropdown สำหรับ Style (ย้ายมาจากด้านซ้าย) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 rounded-2xl gap-2 border-slate-200 bg-white font-bold px-5">
                  สไตล์ (Style)
                  {selectedStyles.length > 0 && (
                    <Badge className="ml-1 bg-orange-500 text-white border-none h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                      {selectedStyles.length}
                    </Badge>
                  )}
                  <ChevronDown size={18} className="text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-2xl p-2 shadow-xl border-slate-100" align="end">
                <DropdownMenuLabel className="text-slate-400 text-[10px] uppercase font-bold px-3">เลือกสไตล์โคมไฟ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {stylesList.map((style) => (
                  <DropdownMenuCheckboxItem
                    key={style}
                    checked={selectedStyles.includes(style)}
                    onCheckedChange={() => toggleFilter(selectedStyles, setSelectedStyles, style)}
                    className="rounded-xl cursor-pointer py-2.5"
                  >
                    {style}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* แสดง Badge เมื่อมีการเลือก Style */}
          {selectedStyles.length > 0 && (
            <div className="flex flex-wrap gap-2 py-1">
              {selectedStyles.map(style => (
                <Badge
                  key={style}
                  variant="secondary"
                  className="rounded-full py-1.5 pl-4 pr-2 gap-2 bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 transition-colors"
                >
                  <span className="font-bold text-xs uppercase tracking-wider">{style}</span>
                  <button
                    onClick={() => toggleFilter(selectedStyles, setSelectedStyles, style)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStyles([])}
                className="text-slate-400 hover:text-rose-500 h-8 font-medium"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Table Area (ปรับขนาดอัตโนมัติ) */}
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
              <p className="font-bold text-slate-400">กำลังรวบรวมข้อมูลสินค้า...</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
              <ProductTable data={filteredProducts} onRefresh={fetchProducts} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}