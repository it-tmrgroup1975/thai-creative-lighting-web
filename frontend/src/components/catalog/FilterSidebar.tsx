// frontend/src/components/catalog/FilterSidebar.tsx
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface FilterSidebarProps {
  // เปลี่ยนเป็น selectedApps และกำหนดให้เป็น Optional พร้อมค่าเริ่มต้นเพื่อป้องกัน Error
  selectedApps?: string[]; 
  onAppChange: (app: string) => void;
}

export function FilterSidebar({ 
  selectedApps = [], // กำหนดค่าเริ่มต้นเป็น Array ว่างเพื่อป้องกัน Error 'includes' of undefined
  onAppChange 
}: FilterSidebarProps) {
  
  // รายการการใช้งานอ้างอิงตามโครงสร้างใน sky-website.pdf
  const applications = ["ไฟผนัง", "ไฟหัวเสา", "ไฟทางเดิน"];

  return (
    <div className="w-full space-y-4 p-6 bg-white/80 backdrop-blur-md rounded-4 shadow-sm border border-slate-100 animate-in slide-in-from-left duration-500">
      <div>
        <h3 className="text-sm font-light mb-5 text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
          การใช้งาน (Usage)
        </h3>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox 
                id={app} 
                // ตรวจสอบสถานะการเลือกจาก selectedApps
                checked={selectedApps.includes(app)}
                onCheckedChange={() => onAppChange(app)}
                className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 transition-colors"
              />
              <Label 
                htmlFor={app} 
                className="text-sm font-light text-slate-600 cursor-pointer group-hover:text-orange-600 transition-colors"
              >
                {app}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* เพิ่มส่วนการกรองราคา (Price Range) ในอนาคตตาม sky-website.pdf */}
      {/* <div className="pt-4 border-t border-slate-50">
        <p className="text-xs font-light text-slate-400 uppercase tracking-widest">
          Thai Creative Lighting
        </p>
      </div> */}
    </div>
  );
}