// frontend/src/pages/Products/CreateProduct.tsx
import { useNavigate } from "react-router-dom";
import { ProductForm } from "../../components/dashboard/ProductForm";
import api from "../../services/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Box } from "lucide-react";

export default function CreateProduct() {
  const navigate = useNavigate();

  const handleCreate = async (values: any) => {
    const formData = new FormData();
    
    // 1. จัดการข้อมูล Text และ Number ทั้งหมดลง FormData
    Object.keys(values).forEach((key) => {
      if (key !== "images") {
        formData.append(key, values[key]);
      }
    });

    // 2. จัดการไฟล์รูปภาพ (ถ้ามี)
    if (values.images && values.images.length > 0) {
      Array.from(values.images as FileList).forEach((file) => {
        formData.append("images[]", file);
      });
    }

    try {
      // ส่งข้อมูลไปยัง add_product.php
      const response = await api.post("/add_product.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        toast.success("เพิ่มสินค้าใหม่เรียบร้อยแล้ว");
        navigate("/products");
      } else {
        toast.error(response.data.message || "ไม่สามารถเพิ่มสินค้าได้");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
          <Box className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h2>
          <p className="text-slate-500 font-medium">เพิ่มรายการโคมไฟใหม่เข้าสู่คลังสินค้า</p>
        </div>
      </div>

      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}