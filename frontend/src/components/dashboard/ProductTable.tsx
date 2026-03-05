import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "../../components/ui/alert-dialog";
import { MoreHorizontal, Eye, Pencil, Trash2, Box } from "lucide-react";
import type { Product } from "../../types/product";

interface ProductTableProps {
  data: Product[];
  onRefresh: () => void;
}

export function ProductTable({ data, onRefresh }: ProductTableProps) {
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  // ปรับให้ดึงจาก env หรือ config กลางเพื่อให้ยืดหยุ่นต่อการย้าย server
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://thai-creative-lighting-web.test/";

  const performDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/delete_product.php?id=${productToDelete}`);
      toast.success("ลบข้อมูลสินค้าเรียบร้อยแล้ว");
      onRefresh();
    } catch (error) {
      toast.error("ไม่สามารถลบข้อมูลสินค้าได้");
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-6 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-slate-100 hover:bg-transparent">
            <TableHead className="w-[120px]">รูปสินค้า</TableHead>
            <TableHead>รายละเอียดโคมไฟ</TableHead>
            <TableHead>สไตล์ / การใช้งาน</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>ราคา</TableHead>
            <TableHead className="text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium">
                ไม่พบข้อมูลสินค้าที่ตรงกับการค้นหา
              </TableCell>
            </TableRow>
          ) : (
            data.map((product) => (
              <TableRow key={product.id} className="group hover:bg-orange-50/30 transition-all duration-300 border-b-slate-50">
                <TableCell>
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group-hover:border-orange-200 transition-colors">
                    <img
                      // รองรับทั้งฟิลด์ images (array) และ main_image (string) จาก API ใหม่
                      src={product.main_image 
                            ? `${BASE_URL}${product.main_image}` 
                            : (product.images?.[0] ? `${BASE_URL}${product.images[0]}` : `${BASE_URL}images/placeholder.png`)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.src = `${BASE_URL}images/placeholder.png`; }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-lg uppercase">{product.name}</span>
                    <span className="text-xs font-bold text-slate-400 tracking-wider">SKU: {product.sku || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit bg-white text-orange-600 border-orange-100 text-[10px] uppercase font-bold">
                      {product.style || 'Classic'}
                    </Badge>
                    <span className="text-sm text-slate-500 font-medium">
                      {product.application_name || 'ไฟผนัง'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-bold ${
                    product.stock_status === 'Ready to Ship' 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50" 
                      : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50"
                  }`}>
                    {product.stock_status || 'Ready to Ship'}
                  </Badge>
                </TableCell>
                <TableCell className="font-black text-slate-900 text-lg">
                  ฿{Number(product.price).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-white hover:shadow-md transition-all">
                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-xl border-slate-100 animate-in fade-in zoom-in duration-200">
                      <DropdownMenuLabel className="text-slate-400 text-[10px] uppercase font-bold px-3 pb-2">เมนูจัดการ</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)} className="rounded-xl focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                        <Eye className="mr-3 h-4 w-4" /> ดูรายละเอียด
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/products/${product.id}/edit`)} className="rounded-xl focus:bg-orange-50 focus:text-orange-600 cursor-pointer py-2">
                        <Pencil className="mr-3 h-4 w-4" /> แก้ไขข้อมูล
                      </DropdownMenuItem>
                      <div className="h-px bg-slate-50 my-1" />
                      <DropdownMenuItem 
                        className="rounded-xl text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer py-2" 
                        onClick={() => setProductToDelete(product.id!)}
                      >
                        <Trash2 className="mr-3 h-4 w-4" /> ลบสินค้า
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900">ยืนยันการลบสินค้า?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-base">
              การดำเนินการนี้ไม่สามารถย้อนกลับได้ ข้อมูลสินค้าจะถูกลบออกจากคลังสินค้าของไทยครีเอทีฟไล้ทติ้งถาวร
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold h-12 px-6">ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete} className="rounded-xl bg-rose-600 hover:bg-rose-700 font-bold h-12 px-6">ลบข้อมูลทันที</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}