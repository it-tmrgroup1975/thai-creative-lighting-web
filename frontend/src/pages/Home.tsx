import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 space-y-8">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9]">
          Light Up Your <br />
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Creativity.
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          The next generation ERP for <span className="font-bold text-orange-600">Thai Creative Lighting</span>. 
          Manage orders, analyze data, and grow your factory with precision.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="h-14 px-10 text-lg font-bold rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          >
            Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="ghost" size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl border-2 border-transparent hover:border-orange-100">
            Documentation
          </Button>
        </div>
      </div>
    </div>
  );
}