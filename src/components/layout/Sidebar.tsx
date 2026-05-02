import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings,
  ChevronDown,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddRecord?: () => void;
  activeView: string;
  onChangeView: (view: string) => void;
  onLogout?: () => void;
  user?: any;
}

const navItems = [
  { id: 'dashboard', name: 'Trang chủ', icon: LayoutDashboard },
  { id: 'history', name: 'Lịch sử ghi chép', icon: FileText },
  { id: 'statistics', name: 'Thống kê tài chính', icon: BarChart3 },
  { id: 'settings', name: 'Cài đặt', icon: Settings },
];

export function Sidebar({ isOpen, onClose, onOpenAddRecord, activeView, onChangeView, onLogout, user }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Profile Header */}
        <div className="h-[90px] bg-[#e6e6e6] flex items-center px-6 mb-6 relative">
          <div className="flex items-center gap-4">
            <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-teal-400 border-[3px] border-white shadow-sm flex items-center justify-center">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Jocelyn'}&backgroundColor=transparent&top=longHairStraight&clothes=blazerShirt`} 
                alt={user?.username || 'User'} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <p className="font-medium text-[15px] text-slate-800 leading-tight">
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden absolute top-2 right-2 text-slate-500" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 mb-6">
          <div className="flex shadow-sm rounded-md overflow-hidden">
            <button 
              className="flex-1 bg-[#5c93c4] hover:bg-[#4a7aa6] text-white text-sm font-medium py-2 px-3 flex items-center justify-center transition-colors"
              onClick={onOpenAddRecord}
            >
              <span className="mr-2 text-lg leading-none">+</span> Thêm ghi chép
            </button>
            <button className="w-9 bg-[#5c93c4] hover:bg-[#4a7aa6] text-white border-l border-white/20 flex items-center justify-center transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left",
                    isActive 
                      ? "border border-slate-300 shadow-sm bg-white text-slate-800" 
                      : "text-slate-600 hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-slate-700" : "text-slate-500")} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-all text-left group"
          >
            <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
