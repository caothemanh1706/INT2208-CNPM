import { auth } from './auth';

export interface NotificationItem {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

export const notificationService = {
  getStorageKey: (): string => {
    const user = auth.getUser();
    const userKey = user ? user.username : 'global';
    return `finwise_notifications_${userKey}`;
  },

  get: (): NotificationItem[] => {
    const key = notificationService.getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    
    // Default welcome notifications
    const defaults: NotificationItem[] = [
      { id: 1, text: 'Hệ thống: Kết nối cơ sở dữ liệu SQLite thành công!', time: '1 giờ trước', read: false },
      { id: 2, text: 'Chào mừng bạn: FinWise đã sẵn sàng giúp bạn tối ưu hóa dòng tiền cá nhân!', time: '3 ngày trước', read: true }
    ];
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  },
  
  add: (text: string) => {
    const list = notificationService.get();
    const newItem: NotificationItem = {
      id: Date.now(),
      text,
      time: 'Vừa xong',
      read: false
    };
    // Keep max 50 notifications to prevent storage bloat
    const updated = [newItem, ...list].slice(0, 50);
    localStorage.setItem(notificationService.getStorageKey(), JSON.stringify(updated));
    window.dispatchEvent(new Event('finwise_notifications_updated'));
  },

  markAllAsRead: () => {
    const list = notificationService.get();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(notificationService.getStorageKey(), JSON.stringify(updated));
    window.dispatchEvent(new Event('finwise_notifications_updated'));
  },

  markAsRead: (id: number) => {
    const list = notificationService.get();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(notificationService.getStorageKey(), JSON.stringify(updated));
    window.dispatchEvent(new Event('finwise_notifications_updated'));
  },

  delete: (id: number) => {
    const list = notificationService.get();
    const updated = list.filter(n => n.id !== id);
    localStorage.setItem(notificationService.getStorageKey(), JSON.stringify(updated));
    window.dispatchEvent(new Event('finwise_notifications_updated'));
  }
};
