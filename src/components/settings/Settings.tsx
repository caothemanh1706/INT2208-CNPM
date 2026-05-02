import { Hexagon, Bell, Shield } from 'lucide-react';

export function Settings() {
  return (
    <div className="h-full flex flex-col pt-2">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Cài đặt</h1>
      
      <div className="space-y-4 max-w-full">
        {/* Card 1: Tài khoản */}
        <button className="w-full flex items-center gap-4 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
          <Hexagon className="w-6 h-6 text-slate-500" />
          <span className="font-medium text-slate-700 text-[15px]">Tài khoản</span>
        </button>

        {/* Card 2: Thông báo */}
        <button className="w-full flex items-center gap-4 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
          <Bell className="w-6 h-6 text-slate-500" />
          <span className="font-medium text-slate-700 text-[15px]">Thông báo</span>
        </button>

        {/* Card 3: Bảo mật */}
        <button className="w-full flex items-center gap-4 bg-white px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
          <Shield className="w-6 h-6 text-slate-500" />
          <span className="font-medium text-slate-700 text-[15px]">Bảo mật</span>
        </button>

        {/* Card 4: Empty box */}
        <div className="w-full h-[58px] bg-white rounded-xl shadow-sm"></div>
      </div>
    </div>
  );
}
