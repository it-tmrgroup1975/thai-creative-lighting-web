import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Zap, ShieldCheck, Palette, Gauge } from "lucide-react";

export default function ShowProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const BASE_URL = "https://thai-creative-lighting-web.test/";

    useEffect(() => {
        api.get(`/get_product_detail.php?id=${id}`).then((res) => setProduct(res.data));
    }, [id]);

    if (!product) return <div className="p-20 text-center text-slate-400 font-medium">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-slate-500"><ArrowLeft size={18} /> Back</Button>

            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Modern Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-3xl border border-white shadow-lg">
                        <img
                            src={product?.images?.[0] ? `${BASE_URL}${product.images[0]}` : `${BASE_URL}/images/placeholder.png`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex gap-3">
                        {product?.images?.slice(1, 5).map((img: string, i: number) => (
                            <img key={i} src={`${BASE_URL}${img}`} className="w-20 h-20 rounded-xl object-cover border-2 border-transparent hover:border-orange-400 cursor-pointer transition-all" />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6 py-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{product.name}</h1>
                        <p className="text-3xl font-bold text-orange-600 mt-2">${Number(product.price).toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-white/50">
                            <Zap className="text-orange-500" /> <div><p className="text-xs text-slate-400">Wattage</p><p className="font-bold">{product.wattage}W</p></div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-white/50">
                            <ShieldCheck className="text-orange-500" /> <div><p className="text-xs text-slate-400">IP Rating</p><p className="font-bold">{product.ip_rating}</p></div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-white/50">
                            <Palette className="text-orange-500" /> <div><p className="text-xs text-slate-400">Style</p><p className="font-bold">{product.style}</p></div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-white/50">
                            <Gauge className="text-orange-500" /> <div><p className="text-xs text-slate-400">Color Temp</p><p className="font-bold">{product.color_temp_k}K</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}