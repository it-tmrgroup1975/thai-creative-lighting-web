// frontend/src/pages/Products/EditProduct.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "../../components/dashboard/ProductForm";
import api from "../../services/api";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลเดิมมาแสดงในฟอร์ม
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/get_product_detail.php?id=${id}`);
        setProduct(response.data);
      } catch (error) {
        toast.error("ไม่พบข้อมูลสินค้าที่ต้องการแก้ไข");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleUpdate = async (values: any) => {
    const formData = new FormData();
    formData.append("id", id as string); // ส่ง ID ไปเพื่อบอกว่าจะแก้ไขตัวไหน
    
    Object.keys(values).forEach((key) => {
      if (key !== "images") {
        formData.append(key, values[key]);
      }
    });

    if (values.images && values.images.length > 0) {
      Array.from(values.images as FileList).forEach((file) => {
        formData.append("images[]", file);
      });
    }

    try {
      // ส่งข้อมูลไปที่ update_product.php
      const response = await api.post("/update_product.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        toast.success("อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว");
        navigate("/products");
      } else {
        toast.error(response.data.message || "ไม่สามารถอัปเดตสินค้าได้");
      }
    } catch (error: any) {
      toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        <p className="font-bold text-slate-500 text-lg">กำลังเตรียมข้อมูลสินค้า...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
          <Pencil className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Product</h2>
          <p className="text-slate-500 font-medium">แก้ไขรายละเอียดของ {product?.name}</p>
        </div>
      </div>

      <ProductForm 
        defaultValues={product} 
        onSubmit={handleUpdate} 
        isEditing={true} 
      />
    </div>
  );
}