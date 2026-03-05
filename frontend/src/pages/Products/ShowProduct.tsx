import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ChevronLeft, Box, Lightbulb, Ruler, Layers } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../../types/product";

export default function ShowProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://thai-creative-lighting-web.test/";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/get_product_detail.php?id=${id}`);
        setProduct(response.data);
      } catch (error) {
        toast.error("ไม่พบข้อมูลสินค้า");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold">กำลังโหลดข้อมูล...</div>;
  if (!product) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => navigate("/products")} className="gap-2 text-slate-500 font-bold">
        <ChevronLeft size={20} /> กลับไปที่รายการสินค้า
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* ฝั่งซ้าย: Gallery รูปภาพ */}
        <div className="space-y-4">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-50">
            <img 
              src={`${BASE_URL}${product.images?.[0] || 'images/placeholder.png'}`} 
              className="w-full h-full object-cover" 
              alt={product.name} 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md cursor-pointer hover:border-orange-500 transition-all">
                <img src={`${BASE_URL}${img}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* ฝั่งขวา: รายละเอียดสินค้า */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="bg-orange-100 text-orange-600 border-none font-black uppercase tracking-widest">{product.style}</Badge>
            <h1 className="text-5xl font-black text-slate-900 leading-tight">{product.name}</h1>
            <p className="text-slate-400 font-bold text-xl uppercase tracking-tighter">SKU: {product.sku}</p>
          </div>

          <div className="text-4xl font-black text-orange-600">฿{Number(product.price).toLocaleString()}</div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
              <Layers className="text-orange-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">วัสดุ</p>
                <p className="font-bold text-slate-700">{product.material || "อลูมิเนียม"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
              <Ruler className="text-orange-500" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">ขนาด</p>
                <p className="font-bold text-slate-700">{product.size_info || "18x23x33 cm."}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
            <Lightbulb className="text-orange-600" />
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase">ชนิดหลอดไฟ</p>
              <p className="font-bold text-orange-700">{product.bulb_type || "E27"}</p>
            </div>
          </div>

          <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            {product.stock_status === 'Ready to Ship' ? "พร้อมส่ง (Ready to Ship)" : "สินค้าหมด"}
          </Button>
        </div>
      </div>
    </div>
  );
}