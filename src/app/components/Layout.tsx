import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, BarChart2, Clock, Target, Settings,
  LogOut, Bell, ChevronDown, Sun, Moon, Plus, X, Sparkles,
} from 'lucide-react';
import { TransactionDrawer } from './TransactionDrawer';
import { auth } from '../../lib/auth';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../../lib/notifications';
import { Chatbox } from './chat/Chatbox';

const navItems = [
  { path: '/app', labelKey: 'dashboard', icon: LayoutDashboard },
  { path: '/app/statistics', labelKey: 'statistics', icon: BarChart2 },
  { path: '/app/history', labelKey: 'history', icon: Clock },
  { path: '/app/goals', labelKey: 'goals', icon: Target },
  { path: '/app/settings', labelKey: 'settings', icon: Settings },
];

const pageTitleKeys: Record<string, string> = {
  '/app': 'dashboard',
  '/app/statistics': 'statistics',
  '/app/history': 'history',
  '/app/goals': 'goals',
  '/app/settings': 'settings',
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle, c } = useTheme();
  const { language, t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(() => notificationService.get());

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(notificationService.get());
    };
    window.addEventListener('finwise_notifications_updated', handleUpdate);
    return () => {
      window.removeEventListener('finwise_notifications_updated', handleUpdate);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const deleteNotif = (id: number) => {
    notificationService.delete(id);
  };

  const toggleNotif = () => {
    setShowNotif(!showNotif);
  };

  const [user, setUser] = useState(() => auth.getUser());

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser(auth.getUser());
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdate);
    };
  }, []);

  const initials = user ? (user.displayName || user.username || user.email || '?').slice(0, 2).toUpperCase() : '?';
  const displayName = user?.displayName || user?.username || user?.email?.split('@')[0] || 'User';

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const pageTitle = t(pageTitleKeys[location.pathname] || 'dashboard');

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300" style={{ backgroundColor: c.bg, fontFamily: 'DM Sans, sans-serif' }}>
      {/* Sidebar */}
      <aside className="flex flex-col flex-shrink-0 transition-colors duration-300" style={{ width: 240, backgroundColor: c.sidebar }}>
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
                  color: isActive ? 'white' : c.sidebarText,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                <span style={{ fontWeight: 500, fontSize: 14 }}>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div
          className="flex items-center gap-3 px-4 py-5 mx-3 mb-3 rounded-xl"
          style={{ borderTop: `1px solid ${c.sidebarBorder}` }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#00C896' }}
          >
            <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{displayName}</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{t('personal_finance')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded-lg transition-colors"
            title={t('logout')}
          >
            <LogOut size={16} style={{ color: 'rgba(255,255,255,0.45)' }} />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex-shrink-0 h-16 flex items-center justify-between px-8 transition-colors duration-300"
          style={{
            backgroundColor: c.topbar,
            borderBottom: `1px solid ${c.topbarBorder}`,
            boxShadow: c.topbarShadow,
          }}
        >
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 18, color: c.text }}>
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
              style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 13, backgroundColor: c.input }}
            >
              <span>{t('all_assets')}</span>
              <ChevronDown size={14} />
            </button>
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ backgroundColor: isDark ? '#243040' : '#F8F9FB' }}
              title={isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
            >
              {isDark
                ? <Sun size={17} color="#F59E0B" />
                : <Moon size={17} color="#1A2332" />}
            </button>
            <div className="relative">
              <button
                onClick={toggleNotif}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative cursor-pointer"
                style={{ backgroundColor: isDark ? '#243040' : '#F8F9FB' }}
                title="Thông báo"
              >
                <Bell size={17} color={c.text} />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: '#FF5C5C', fontSize: '9px', fontWeight: 700 }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotif && (
                <>
                  {/* Overlay to close when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotif(false)} 
                  />
                  
                  <div 
                    className="absolute right-0 mt-2 w-96 rounded-2xl shadow-2xl z-50 overflow-hidden border transition-all duration-300"
                    style={{ 
                      backgroundColor: c.card, 
                      borderColor: c.cardBorder,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.25)' 
                    }}
                  >
                    {/* Header */}
                    <div 
                      className="px-4 py-3 flex items-center justify-between border-b"
                      style={{ borderColor: c.divider }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 15, fontWeight: 700, color: c.text }}>{t('notifications')}</span>
                        {unreadCount > 0 && (
                          <span 
                            className="px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: c.green, fontSize: 11, fontWeight: 600 }}
                          >
                            {unreadCount} {language === 'en' ? 'new' : language === 'zh' ? '新' : 'mới'}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs font-semibold cursor-pointer transition-colors"
                          style={{ color: c.green }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          {language === 'en' ? 'Mark all as read' : language === 'zh' ? '标记全部已读' : 'Đánh dấu tất cả đã đọc'}
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                          <Bell size={24} style={{ color: c.textMuted, opacity: 0.5 }} />
                          <p style={{ fontSize: 13, color: c.textMuted }}>
                            {language === 'en' ? 'No notifications' : language === 'zh' ? '暂无通知' : 'Không có thông báo nào'}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y" style={{ borderColor: c.divider }}>
                          {notifications.map((n) => (
                            <div 
                              key={n.id}
                              onClick={() => {
                                notificationService.markAsRead(n.id);
                              }}
                              className="p-4 flex items-start gap-3 transition-colors duration-200 hover:bg-opacity-5 cursor-pointer"
                              style={{ 
                                backgroundColor: n.read ? 'transparent' : (isDark ? 'rgba(0, 200, 150, 0.05)' : 'rgba(0, 200, 150, 0.02)'),
                                hover: { backgroundColor: c.rowHover }
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : (isDark ? 'rgba(0, 200, 150, 0.05)' : 'rgba(0, 200, 150, 0.02)')}
                            >
                              {/* Blue unread dot */}
                              {!n.read && (
                                <span 
                                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                  style={{ backgroundColor: c.green }}
                                />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <p style={{ fontSize: 13, color: n.read ? c.textSub : c.text, fontWeight: n.read ? 500 : 600, lineHeight: 1.4 }}>
                                  {n.text}
                                </p>
                                <p style={{ fontSize: 11, color: c.textMuted, marginTop: 4 }}>
                                  {n.time}
                                </p>
                              </div>

                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotif(n.id);
                                }}
                                className="p-1 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                                style={{ color: c.textMuted }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = c.redBg; e.currentTarget.style.color = c.red; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = c.textMuted; }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
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
        <main className="flex-1 overflow-y-auto p-8 transition-colors duration-300" style={{ backgroundColor: c.bg }}>
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

      {/* Chatbox Widget */}
      <Chatbox />

      {/* Transaction Drawer */}
      <TransactionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSaved={() => setRefreshKey(k => k + 1)} />
    </div>
  );
}
