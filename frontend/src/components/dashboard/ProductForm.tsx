// frontend/src/components/dashboard/ProductForm.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge"; // แก้ไข ReferenceError: Badge
import { toast } from "sonner";
import { 
  Loader2, 
  X, 
  Upload, 
  Lightbulb, 
  Ruler, 
  Layers, 
  Hash, 
  Box // แก้ไข ReferenceError: Box
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../../components/ui/form";

// กำหนด Schema ตามโครงสร้างฐานข้อมูลใหม่
const productSchema = z.object({
  sku: z.string().min(2, "รหัสสินค้า (SKU) จำเป็นต้องระบุ"),
  name: z.string().min(2, "ชื่อสินค้าจำเป็นต้องระบุ"),
  category_id: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  application_id: z.string().min(1, "กรุณาเลือกประเภทการใช้งาน"),
  price: z.coerce.number().min(0, "ราคาต้องไม่ต่ำกว่า 0"),
  style: z.string().min(1, "กรุณาเลือกสไตล์"),
  material: z.string().optional(),
  size_info: z.string().optional(),
  bulb_type: z.string().optional(),
  stock_status: z.enum(["Ready to Ship", "Out of Stock"]).default("Ready to Ship"),
  images: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: any;
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
      sku: defaultValues?.sku || "",
      name: defaultValues?.name || "",
      category_id: defaultValues?.category_id?.toString() || "",
      application_id: defaultValues?.application_id?.toString() || "",
      price: defaultValues?.price || 0,
      style: defaultValues?.style || "Classic",
      material: defaultValues?.material || "",
      size_info: defaultValues?.size_info || "",
      bulb_type: defaultValues?.bulb_type || "E27",
      stock_status: defaultValues?.stock_status || "Ready to Ship",
    },
  });

  // โหลดข้อมูล Category และ Application จาก API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, appRes] = await Promise.all([
          api.get("/get_categories.php"),
          api.get("/get_applications.php")
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || []);
        setApplications(Array.isArray(appRes.data) ? appRes.data : appRes.data.data || []);
      } catch (error) {
        toast.error("โหลดข้อมูลหมวดหมู่ไม่สำเร็จ");
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
        toast.error("อัปโหลดได้สูงสุด 5 รูป");
        return;
      }
      const previews = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
      form.setValue("images", files);
    }
  };

  if (loadingOptions) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      <p className="font-bold text-slate-500 text-lg italic">กำลังเตรียมข้อมูล...</p>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-8">
          
          {/* ส่วนที่ 1: ข้อมูลพื้นฐาน */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Box className="text-orange-500" size={24} /> ข้อมูลเบื้องต้น
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="sku" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2"><Hash size={14} /> รหัสสินค้า (SKU)</FormLabel>
                  <FormControl><Input placeholder="เช่น JUSTIN-B15" className="h-11 rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">ชื่อรุ่นสินค้า</FormLabel>
                  <FormControl><Input placeholder="เช่น CHANKAPOR" className="h-11 rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category_id" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">หมวดหมู่หลัก</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="application_id" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">ประเภทการใช้งาน</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="เลือกการใช้งาน" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {applications.map((a) => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* ส่วนที่ 2: รายละเอียดทางเทคนิคตาม sky-website.pdf */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Lightbulb className="text-orange-500" size={24} /> รายละเอียดทางเทคนิค
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="style" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">สไตล์ (Style)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Classic">Classic</SelectItem>
                      <SelectItem value="Modern">Modern</SelectItem>
                      <SelectItem value="Semi-Modern">Semi-Modern</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="material" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2"><Layers size={14} /> วัสดุ</FormLabel>
                  <FormControl><Input placeholder="เช่น อลูมิเนียม" className="h-11 rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="size_info" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2"><Ruler size={14} /> ขนาด</FormLabel>
                  <FormControl><Input placeholder="เช่น 18x23x33 cm." className="h-11 rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* ส่วนที่ 3: ราคาและสถานะ */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-orange-600">ราคาจำหน่าย (฿)</FormLabel>
                  <FormControl><Input type="number" className="h-11 rounded-xl border-orange-100" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="stock_status" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">สถานะสต็อก</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Ready to Ship">พร้อมส่ง (Ready to Ship)</SelectItem>
                      <SelectItem value="Out of Stock">สินค้าหมด (Out of Stock)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* ส่วนที่ 4: การจัดการรูปภาพ */}
          <div className="space-y-4 pt-6 border-t border-slate-50">
            <label className="text-sm font-black text-slate-800 uppercase tracking-wider">
              รูปภาพสินค้า (สูงสุด 5 รูป)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-orange-50/30 transition-all cursor-pointer group">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3 text-slate-400 group-hover:text-orange-500">
                <Upload size={40} /> 
                <span className="font-black text-lg text-slate-600">คลิกเพื่ออัปโหลดรูปภาพ</span>
              </label>
              
              <div className="flex gap-4 flex-wrap justify-center mt-4">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <img src={src} className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-md" />
                    <button 
                      type="button" 
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg" 
                      onClick={() => setImagePreviews(prev => prev.filter((_, i) => i !== idx))}
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                    {idx === 0 && (
                      <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-[10px] py-0 px-2 rounded-full border-none">
                        รูปหลัก
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-600 h-14 rounded-2xl text-white font-black text-xl hover:shadow-2xl transition-all active:scale-95">
          {isEditing ? "อัปเดตข้อมูลสินค้า" : "ยืนยันการเพิ่มสินค้าใหม่"}
        </Button>
      </form>
    </Form>
  );
}