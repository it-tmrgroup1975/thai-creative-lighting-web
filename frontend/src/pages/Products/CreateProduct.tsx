import { useNavigate } from "react-router-dom";
import { ProductForm } from "../../components/dashboard/ProductForm";
import api from "../../services/api";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function CreateProduct() {
  const navigate = useNavigate();

  const handleCreate = async (values: any) => {
    // แปลงข้อมูลเป็น FormData เพื่อรองรับไฟล์ภาพ
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'images' && values.images) {
        // วนลูปเพิ่มไฟล์ทีละภาพ
        for (let i = 0; i < values.images.length; i++) {
          formData.append('images[]', values.images[i]);
        }
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      await api.post("/add_product.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product created successfully!");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={18} /> Back
      </Button>
      
      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Add New Product</h2>
        <p className="text-slate-500 mb-8 font-medium">Define your new lighting product details below.</p>
        <ProductForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}