import { useState, useEffect } from 'react';
import {
  User, Lock, Shield, Wallet, SlidersHorizontal, RefreshCw,
  Globe, Bell, Download, Trash2, Plus, X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { auth } from '../../lib/auth';
import { useTheme } from '../contexts/ThemeContext';

type SettingSection =
  | 'profile'
  | 'password'
  | 'security'
  | 'wallets'
  | 'budget'
  | 'recurring'
  | 'language'
  | 'notifications'
  | 'export'
  | 'delete';

const menuGroups = [
  {
    label: 'Tài khoản',
    items: [
      { id: 'profile' as SettingSection, label: 'Hồ sơ cá nhân', icon: User },
      { id: 'password' as SettingSection, label: 'Đổi mật khẩu', icon: Lock },
      { id: 'security' as SettingSection, label: 'Bảo mật 2 lớp', icon: Shield },
    ],
  },
  {
    label: 'Tài chính',
    items: [
      { id: 'wallets' as SettingSection, label: 'Quản lý ví', icon: Wallet },
      { id: 'budget' as SettingSection, label: 'Cài đặt hạn mức', icon: SlidersHorizontal },
      { id: 'recurring' as SettingSection, label: 'Giao dịch lặp lại', icon: RefreshCw },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { id: 'language' as SettingSection, label: 'Tiền tệ & Ngôn ngữ', icon: Globe },
      { id: 'notifications' as SettingSection, label: 'Thông báo', icon: Bell },
    ],
  },
  {
    label: 'Dữ liệu',
    items: [
      { id: 'export' as SettingSection, label: 'Xuất dữ liệu', icon: Download },
      { id: 'delete' as SettingSection, label: 'Xóa tài khoản', icon: Trash2 },
    ],
  },
];

function ProfileSection() {
  const { c } = useTheme();
  const currentUser = auth.getUser();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || currentUser?.username || '');
  const [email] = useState(currentUser?.email || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const updated = await api.updateProfile({ displayName });
      auth.setUser({ ...currentUser, ...updated });
      setMsg('Đã lưu thay đổi!');
    } catch { setMsg('Lưu thất bại'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 16 }}>Cập nhật thông tin cá nhân của bạn</p>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: c.green }}>
            <span style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>{auth.getInitials()}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>Tên hiển thị</label>
          <input
            type="text" value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
            style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>Email</label>
          <input type="email" value={email} readOnly
            className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
            style={{ borderColor: c.inputBorder, fontSize: 14, color: c.textMuted, backgroundColor: c.bg }}
          />
        </div>
      </div>
      {msg && <p style={{ fontSize: 13, color: msg.includes('thất') ? c.red : c.green }}>{msg}</p>}
      <button onClick={handleSave} disabled={saving}
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600, opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </div>
  );
}

function PasswordSection() {
  const { c } = useTheme();
  return (
    <div className="space-y-4" style={{ maxWidth: 400 }}>
      <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 4 }}>Đặt mật khẩu mới cho tài khoản của bạn</p>
      {[
        { label: 'Mật khẩu hiện tại', placeholder: '••••••••' },
        { label: 'Mật khẩu mới', placeholder: '••••••••' },
        { label: 'Xác nhận mật khẩu mới', placeholder: '••••••••' },
      ].map((f) => (
        <div key={f.label}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>
            {f.label}
          </label>
          <input
            type="password"
            placeholder={f.placeholder}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
            style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
          />
        </div>
      ))}
      <button
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        Cập nhật mật khẩu
      </button>
    </div>
  );
}

function SecuritySection() {
  const { c } = useTheme();
  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: c.textMuted }}>Bảo vệ tài khoản với xác thực 2 bước</p>
      <div className="flex items-center justify-between p-4 rounded-xl border transition-colors duration-300" style={{ borderColor: c.divider, backgroundColor: c.input, maxWidth: 460 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Xác thực 2 lớp (2FA)</p>
          <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>Sử dụng ứng dụng xác thực hoặc SMS</p>
        </div>
        <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: c.green, color: 'white', fontSize: 13, fontWeight: 600 }}>
          Bật ngay
        </button>
      </div>
    </div>
  );
}

function WalletsSection() {
  const { c, isDark } = useTheme();
  const [walletList, setWalletList] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    api.getAccounts().then(setWalletList).catch(console.error);
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const acc = await api.createAccount({ name: newName, balance: parseFloat(newBalance) || 0 });
      setWalletList([...walletList, acc]);
      setNewName(''); setNewBalance(''); setShowAdd(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteAccount(id);
      setWalletList(walletList.filter(w => w.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: c.textMuted }}>Quản lý các ví và nguồn tiền của bạn</p>

      {walletList.map((w) => (
        <div
          key={w.id}
          className="flex items-center gap-4 px-4 py-4 rounded-xl border transition-colors duration-300"
          style={{ borderColor: c.divider, backgroundColor: c.input }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: (w.color || c.green) + '20' }}
          >
            <span style={{ fontSize: 22 }}>{w.icon || '🏦'}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{w.name}</p>
              {w.isDefault && (
                <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: c.greenBg, color: c.green, fontSize: 11, fontWeight: 600 }}>Mặc định</span>
              )}
            </div>
            <p style={{ fontSize: 13, color: c.green, fontWeight: 600, marginTop: 2 }}>
              {(w.balance || 0).toLocaleString('vi-VN')} ₫
            </p>
          </div>
          <div className="flex gap-2">
            {!w.isDefault && (
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.redBg)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={() => handleDelete(w.id)}
              >
                <Trash2 size={15} color={c.red} />
              </button>
            )}
          </div>
        </div>
      ))}

      {showAdd ? (
        <div className="p-4 rounded-xl border-2 transition-colors duration-300" style={{ borderColor: c.green, borderStyle: 'dashed' }}>
          <div className="flex gap-3 mb-3">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Tên ví" className="flex-1 px-3 py-2 rounded-lg border outline-none transition-colors duration-300"
              style={{ borderColor: c.inputBorder, fontSize: 13, color: c.text, backgroundColor: c.card }}
            />
            <input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)}
              placeholder="Số dư ban đầu" className="flex-1 px-3 py-2 rounded-lg border outline-none transition-colors duration-300"
              style={{ borderColor: c.inputBorder, fontSize: 13, color: c.text, backgroundColor: c.card }}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border transition-colors duration-300"
              style={{ borderColor: c.inputBorder, fontSize: 13, color: c.textSub, fontWeight: 600, backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >Hủy</button>
            <button onClick={handleAdd} className="flex-1 py-2 rounded-lg"
              style={{ backgroundColor: c.green, color: 'white', fontSize: 13, fontWeight: 600 }}>Thêm ví</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-colors duration-300"
          style={{ borderColor: c.inputBorder, borderStyle: 'dashed', color: c.textMuted, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Plus size={18} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Thêm ví mới</span>
        </button>
      )}
    </div>
  );
}

function BudgetSection() {
  const { c } = useTheme();
  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: c.textMuted }}>Đặt hạn mức chi tiêu cho từng danh mục</p>
      {[
        { cat: '🍜 Ăn uống', limit: 3000000 },
        { cat: '🚗 Đi lại', limit: 2000000 },
        { cat: '🛍️ Mua sắm', limit: 2000000 },
        { cat: '🎬 Giải trí', limit: 1000000 },
        { cat: '🏠 Nhà cửa', limit: 4000000 },
      ].map((b) => (
        <div key={b.cat} className="flex items-center gap-4" style={{ maxWidth: 480 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: c.text, minWidth: 140 }}>{b.cat}</span>
          <input
            type="number"
            defaultValue={b.limit}
            className="flex-1 px-4 py-2.5 rounded-xl border outline-none transition-colors duration-300"
            style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
          />
          <span style={{ fontSize: 13, color: c.textMuted }}>₫</span>
        </div>
      ))}
      <button
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        Lưu hạn mức
      </button>
    </div>
  );
}

function NotificationsSection() {
  const { c, isDark } = useTheme();
  const [settings, setSettings] = useState([
    { id: 'daily', label: 'Nhắc nhở hàng ngày', desc: 'Nhắc bạn ghi chép giao dịch', enabled: true },
    { id: 'budget', label: 'Cảnh báo hạn mức', desc: 'Khi chi tiêu vượt ngân sách', enabled: true },
    { id: 'goal', label: 'Cập nhật mục tiêu', desc: 'Nhắc về tiến độ mục tiêu', enabled: false },
    { id: 'report', label: 'Báo cáo hàng tuần', desc: 'Tổng kết chi tiêu mỗi tuần', enabled: true },
  ]);

  return (
    <div className="space-y-3">
      <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 8 }}>Quản lý thông báo và nhắc nhở</p>
      {settings.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between px-4 py-4 rounded-xl border transition-colors duration-300"
          style={{ borderColor: c.divider, backgroundColor: c.input }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{s.label}</p>
            <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{s.desc}</p>
          </div>
          <button
            onClick={() => setSettings(settings.map(ss => ss.id === s.id ? { ...ss, enabled: !ss.enabled } : ss))}
            className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
            style={{ backgroundColor: s.enabled ? c.green : (isDark ? '#243040' : '#D1D9E0') }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
              style={{ left: s.enabled ? 26 : 2 }}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

function ExportSection() {
  const { c, isDark } = useTheme();
  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: c.textMuted }}>Xuất dữ liệu giao dịch của bạn</p>
      <div className="grid grid-cols-2 gap-4">
        {[
          { format: 'Excel (.xlsx)', icon: '📊', desc: 'Phù hợp để phân tích và chỉnh sửa' },
          { format: 'CSV (.csv)', icon: '📋', desc: 'Phù hợp với phần mềm khác' },
          { format: 'PDF (.pdf)', icon: '📄', desc: 'Phù hợp để in và lưu trữ' },
          { format: 'JSON (.json)', icon: '⚙️', desc: 'Dành cho nhà phát triển' },
        ].map((f) => (
          <button
            key={f.format}
            className="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors duration-300"
            style={{ borderColor: c.inputBorder, backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.green; e.currentTarget.style.backgroundColor = c.greenBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.inputBorder; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span style={{ fontSize: 24 }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{f.format}</p>
              <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{f.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-4 items-center pt-2">
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Khoảng thời gian</label>
          <select className="px-4 py-3 rounded-xl border outline-none transition-colors duration-300" style={{ borderColor: c.inputBorder, fontSize: 13, color: c.text, backgroundColor: c.input }}>
            <option>Tháng này</option>
            <option>3 tháng gần nhất</option>
            <option>6 tháng gần nhất</option>
            <option>Năm nay</option>
            <option>Toàn bộ dữ liệu</option>
          </select>
        </div>
        <button
          className="mt-5 flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
        >
          <Download size={16} />
          Tải xuống
        </button>
      </div>
    </div>
  );
}

function DeleteSection() {
  const { c, isDark } = useTheme();
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl transition-colors duration-300" style={{ backgroundColor: isDark ? 'rgba(255,92,92,0.1)' : '#FFF5F5', border: `1px solid ${isDark ? 'rgba(255,92,92,0.3)' : '#FECDD3'}` }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#FF8A8A' : '#9F1239', marginBottom: 4 }}>⚠️ Cảnh báo quan trọng</p>
        <p style={{ fontSize: 13, color: isDark ? '#FFBDBD' : '#BE123C', lineHeight: 1.6 }}>
          Hành động này sẽ xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn.
          Thao tác này không thể hoàn tác. Vui lòng xuất dữ liệu trước khi xóa.
        </p>
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
          Nhập email để xác nhận
        </label>
        <input
          type="email"
          placeholder="ban@email.com"
          className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
          style={{ borderColor: isDark ? 'rgba(255,92,92,0.5)' : '#FECDD3', fontSize: 14, color: c.text, backgroundColor: c.input, maxWidth: 400 }}
        />
      </div>
      <button
        className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all"
        style={{ backgroundColor: c.red, color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        <Trash2 size={16} />
        Xóa tài khoản vĩnh viễn
      </button>
    </div>
  );
}

function LanguageSection() {
  const { c } = useTheme();
  return (
    <div className="space-y-5" style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 13, color: c.textMuted }}>Cài đặt ngôn ngữ và đơn vị tiền tệ</p>
      {[
        { label: 'Ngôn ngữ', options: ['Tiếng Việt', 'English', '日本語'] },
        { label: 'Đơn vị tiền tệ', options: ['VND (₫)', 'USD ($)', 'EUR (€)', 'JPY (¥)'] },
        { label: 'Định dạng ngày', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      ].map((f) => (
        <div key={f.label}>
          <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
            {f.label}
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
            style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
          >
            {f.options.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <button
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        Lưu cài đặt
      </button>
    </div>
  );
}

function RecurringSection() {
  const { c } = useTheme();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    api.getRecurring().then(setList).catch(console.error);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.deleteRecurring(id);
      setList(list.filter(r => r.id !== id));
    } catch (e) { console.error(e); }
  };

  const freqLabel: Record<string, string> = {
    daily: 'Hàng ngày', weekly: 'Hàng tuần', monthly: 'Hàng tháng', yearly: 'Hàng năm'
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 16 }}>Các giao dịch tự động lặp lại</p>
      {list.length === 0 && <p style={{ fontSize: 13, color: c.textMuted }}>Chưa có giao dịch lặp lại nào</p>}
      <div className="space-y-3">
        {list.map((r) => (
          <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl border transition-colors duration-300" style={{ borderColor: c.divider, backgroundColor: c.input }}>
            <div className="flex-1">
              <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{r.name}</p>
              <p style={{ fontSize: 12, color: c.textMuted, marginTop: 1 }}>
                {freqLabel[r.frequency] || r.frequency} · Kế tiếp: {new Date(r.nextDueDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: r.type === 'income' ? c.green : c.red, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {r.type === 'income' ? '+' : '-'}{r.amount.toLocaleString('vi-VN')} ₫
            </p>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.redBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => handleDelete(r.id)}>
              <Trash2 size={15} color={c.red} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionTitles: Record<SettingSection, string> = {
  profile: 'Hồ sơ cá nhân',
  password: 'Đổi mật khẩu',
  security: 'Bảo mật 2 lớp',
  wallets: 'Quản lý Ví / Nguồn tiền',
  budget: 'Cài đặt hạn mức',
  recurring: 'Giao dịch lặp lại',
  language: 'Tiền tệ & Ngôn ngữ',
  notifications: 'Thông báo',
  export: 'Xuất dữ liệu',
  delete: 'Xóa tài khoản',
};

export function Settings() {
  const { c } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingSection>('wallets');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection />;
      case 'password': return <PasswordSection />;
      case 'security': return <SecuritySection />;
      case 'wallets': return <WalletsSection />;
      case 'budget': return <BudgetSection />;
      case 'recurring': return <RecurringSection />;
      case 'language': return <LanguageSection />;
      case 'notifications': return <NotificationsSection />;
      case 'export': return <ExportSection />;
      case 'delete': return <DeleteSection />;
      default: return null;
    }
  };

  return (
    <div className="flex gap-6 transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Left menu */}
      <div
        className="flex-shrink-0 rounded-2xl py-3 overflow-hidden transition-colors duration-300"
        style={{ width: 240, backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}`, alignSelf: 'flex-start' }}
      >
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <p style={{ fontSize: 10, fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '8px 16px 4px' }}>
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isDanger = item.id === 'delete';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-all relative"
                  style={{
                    backgroundColor: isActive ? c.greenBg : 'transparent',
                    color: isDanger ? c.red : isActive ? c.green : c.textSub,
                    borderLeft: isActive ? `3px solid ${c.green}` : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = c.rowHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={16} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        className="flex-1 rounded-2xl p-6 transition-colors duration-300"
        style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}`, minHeight: 500 }}
      >
        <div className="mb-6 transition-colors duration-300" style={{ borderBottom: `1px solid ${c.divider}`, paddingBottom: 16 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 20, color: c.text, marginBottom: 4 }}>
            {sectionTitles[activeSection]}
          </h2>
        </div>
        {renderSection()}
      </div>
    </div>
  );
}
