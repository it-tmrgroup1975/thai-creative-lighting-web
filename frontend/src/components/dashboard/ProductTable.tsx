import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
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
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../types/product";

interface ProductTableProps {
  data: Product[];
  onRefresh: () => void;
}

export function ProductTable({ data, onRefresh }: ProductTableProps) {
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const BASE_URL = "https://thai-creative-lighting-web.test/";

  const performDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/delete_product.php?id=${productToDelete}`);
      toast.success("Product deleted successfully");
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setProductToDelete(null); // ปิด Modal
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl p-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-orange-100">
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id} className="hover:bg-orange-50/50 transition-colors">
              <TableCell>
                <img
                  src={product.images[0] ? `${BASE_URL}${product.images[0]}` : `${BASE_URL}/images/placeholder.png`}
                  alt={product.name}
                  className="w-24 h-24 rounded-lg object-cover border border-orange-100"
                  onError={(e) => { e.currentTarget.src = `${BASE_URL}/images/placeholder.png`; }}
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="font-bold text-orange-600">
                ${Number(product.price).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/products/${product.id}/edit`)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    {/* เปลี่ยนจากการลบโดยตรง มาเป็นการ set state เพื่อเปิด Modal */}
                    <DropdownMenuItem className="text-rose-600 focus:text-rose-600" onClick={() => setProductToDelete(product.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* AlertDialog (Modal ยืนยันการลบ) */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete} className="bg-rose-600 hover:bg-rose-700">Delete Product</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}