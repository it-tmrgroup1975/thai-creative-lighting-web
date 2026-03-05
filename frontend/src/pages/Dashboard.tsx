import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TrendingUp, Users, Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h2>
        <p className="text-slate-500 font-medium">Welcome back! Here's what's happening today.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard 
          title="Total Revenue" 
          value="$45,231.89" 
          desc="+20.1% from last month" 
          icon={<TrendingUp className="text-orange-500" />} 
          trend="up"
        />
        <StatsCard 
          title="Subscriptions" 
          value="+2,350" 
          desc="+180.1% from last month" 
          icon={<Users className="text-pink-500" />} 
          trend="up"
        />
        <StatsCard 
          title="Active Now" 
          value="573" 
          desc="+201 since last hour" 
          icon={<Activity className="text-rose-500" />} 
          trend="up"
        />
      </div>
    </div>
  );
}

function StatsCard({ title, value, desc, icon, trend }: any) {
  return (
    <Card className="group border-none bg-white/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-500 rounded-[2rem] overflow-hidden border-t border-white/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-slate-900 mb-1">{value}</div>
        <p className="text-xs font-bold text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-full">{desc}</p>
      </CardContent>
    </Card>
  );
}