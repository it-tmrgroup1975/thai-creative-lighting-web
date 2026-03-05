import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";
import { ProductTable } from "../../components/dashboard/ProductTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import type { Product } from "../../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันดึงข้อมูลหลัก
  const fetchProducts = async () => {
    try {
      const response = await api.get("/get_products.php");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ระบบ Filter ข้อมูล (แสดงผลเฉพาะที่ค้นหา)
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Products Inventory</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your lighting and solar products here.</p>
        </div>
        <Button 
          onClick={() => navigate("/products/create")}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl gap-2 font-bold shadow-lg shadow-orange-500/20 transition-all"
        >
          <Plus size={20} /> Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <Input 
          placeholder="Search by name or category..." 
          className="pl-10 h-11 rounded-xl bg-white/70 border-white/50 shadow-sm backdrop-blur-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-white/50 rounded-3xl backdrop-blur-md border border-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
          <p className="font-bold text-slate-600">Loading Inventory...</p>
        </div>
      ) : (
        // ส่ง filteredProducts และ fetchProducts (onRefresh) ไปยังตาราง
        <ProductTable data={filteredProducts} onRefresh={fetchProducts} />
      )}
    </div>
  );
}