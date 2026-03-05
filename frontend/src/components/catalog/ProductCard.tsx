import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import type { Product } from "../../types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden rounded-3xl border-none shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={product.main_image} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 backdrop-blur-md border-none">
          {product.sku}
        </Badge>
      </div>
      <CardContent className="p-5">
        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
          {product.style}
        </p>
        <h3 className="text-xl font-black text-slate-900 mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-slate-700">
            ฿{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-medium italic">
            {product.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}