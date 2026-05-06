import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, BarChart2, Clock, Target, Settings,
  LogOut, Bell, ChevronDown, Sun, Moon, Plus,
} from 'lucide-react';
import { TransactionDrawer } from './TransactionDrawer';
import { auth } from '../../lib/auth';

const navItems = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/statistics', label: 'Thống kê', icon: BarChart2 },
  { path: '/app/history', label: 'Lịch sử', icon: Clock },
  { path: '/app/goals', label: 'Mục tiêu', icon: Target },
  { path: '/app/settings', label: 'Cài đặt', icon: Settings },
];

const pageTitles: Record<string, string> = {
  '/app': 'Tổng quan',
  '/app/statistics': 'Thống kê & Phân tích',
  '/app/history': 'Lịch sử Giao dịch',
  '/app/goals': 'Mục tiêu Tiết kiệm',
  '/app/settings': 'Cài đặt',
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const user = auth.getUser();
  const initials = auth.getInitials();
  const displayName = user?.displayName || user?.username || user?.email?.split('@')[0] || 'User';

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8F9FB', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside className="flex flex-col flex-shrink-0" style={{ width: 240, backgroundColor: '#1A2332' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#00C896' }}
          >
            <span style={{ color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 16 }}>F</span>
          </div>
          <span style={{ color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 20 }}>FinWise</span>
        </div>

        {/* Nav menu */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isActive ? '#00C896' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                <span style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div
          className="flex items-center gap-3 px-4 py-5 mx-3 mb-3 rounded-xl"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#00C896' }}
          >
            <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{displayName}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Cá nhân</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <LogOut size={16} style={{ color: 'rgba(255,255,255,0.45)' }} />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex-shrink-0 h-16 flex items-center justify-between px-8 bg-white"
          style={{ borderBottom: '1px solid #E8EBF0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 18, color: '#1A2332' }}>
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{ borderColor: '#E8EBF0', color: '#5A6A7A', fontSize: 13 }}
            >
              <span>Tất cả tài sản</span>
              <ChevronDown size={14} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#F8F9FB' }}
            >
              {darkMode ? <Sun size={17} color="#1A2332" /> : <Moon size={17} color="#1A2332" />}
            </button>
            <div className="relative">
              <button
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#F8F9FB' }}
              >
                <Bell size={17} color="#1A2332" />
              </button>
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#FF5C5C' }}
              />
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#00C896' }}
            >
              <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{initials}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#F8F9FB' }}>
          <Outlet context={{ openDrawer: () => setDrawerOpen(true), refreshKey }} />
        </main>
      </div>

      {/* FAB */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center z-40 transition-transform hover:scale-110"
        style={{ backgroundColor: '#00C896', boxShadow: '0 8px 24px rgba(0,200,150,0.35)' }}
      >
        <Plus size={26} color="white" />
      </button>

      {/* Transaction Drawer */}
      <TransactionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSaved={() => setRefreshKey(k => k + 1)} />
    </div>
  );
}
