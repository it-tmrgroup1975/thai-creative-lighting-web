import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";
import { Loader2, X, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../../components/ui/form";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category_id: z.string().min(1, "Category is required"),
  application_id: z.string().min(1, "Application is required"),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  style: z.string().min(2),
  wattage: z.coerce.number().min(0),
  color_temp_k: z.coerce.number().min(1000),
  ip_rating: z.string().min(2),
  images: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: any) => void;
  isEditing?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, isEditing = false }: ProductFormProps) {
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [applications, setApplications] = useState<{ id: number, name: string }[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      category_id: defaultValues?.category_id?.toString() || "",
      application_id: defaultValues?.application_id?.toString() || "",
      price: defaultValues?.price || 0,
      stock: defaultValues?.stock || 0,
      style: defaultValues?.style || "",
      wattage: defaultValues?.wattage || 0,
      color_temp_k: defaultValues?.color_temp_k || 3000,
      ip_rating: defaultValues?.ip_rating || "IP20",
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, appRes] = await Promise.all([
          api.get("/get_categories.php"),
          api.get("/get_applications.php")
        ]);
        setCategories(catRes.data);
        setApplications(appRes.data);
      } catch (error) {
        toast.error("Failed to load options");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length > 5) {
        toast.error("Max 5 images allowed");
        return;
      }
      const previews = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
      form.setValue("images", files);
    }
  };

  if (loadingOptions) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="name" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="category_id" render={({ field }) => (
            <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />
          <FormField name="application_id" render={({ field }) => (
            <FormItem><FormLabel>Application Area</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger><SelectContent>{applications.map((a) => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />
          <FormField name="price" render={({ field }) => (
            <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="stock" render={({ field }) => (
            <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="style" render={({ field }) => (
            <FormItem><FormLabel>Style</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField name="wattage" render={({ field }) => (
            <FormItem><FormLabel>Wattage (W)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* ระบบอัปโหลดรูปภาพ (แก้ไข Error โดยใช้ Label ธรรมดาแทน FormLabel) */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Product Images (Max 5)
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 bg-white/50">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors">
              <Upload size={32} /> <span>Click to upload images</span>
            </label>
            <div className="flex gap-2 flex-wrap justify-center">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <img src={src} className="w-full h-full object-cover rounded-lg border border-slate-200" />
                  <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1" onClick={() => setImagePreviews(prev => prev.filter((_, i) => i !== idx))}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-600 h-11 text-white font-bold text-lg hover:shadow-lg">
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}