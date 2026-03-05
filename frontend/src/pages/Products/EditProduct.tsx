import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ProductForm } from "../../components/dashboard/ProductForm";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    api.get(`/get_product_detail.php?id=${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const handleUpdate = async (values: any) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'images' && values.images) {
        for (let i = 0; i < values.images.length; i++) {
          formData.append('images[]', values.images[i]);
        }
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      await api.post(`/update_product.php?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
      navigate("/products");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  if (!product) return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-slate-500">
        <ArrowLeft size={18} /> Back
      </Button>
      
      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Edit Product</h2>
        <p className="text-slate-500 mb-8 font-medium">Editing: <span className="text-orange-600 font-bold">{product.name}</span></p>
        <ProductForm isEditing={true} defaultValues={product} onSubmit={handleUpdate} />
      </div>
    </div>
  );
}