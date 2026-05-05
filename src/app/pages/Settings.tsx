import { useState } from 'react';
import {
  User, Lock, Shield, Wallet, SlidersHorizontal, RefreshCw,
  Globe, Bell, Download, Trash2, Edit2, Plus, X, ChevronRight,
} from 'lucide-react';

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

const wallets = [
  { id: 1, icon: '💵', name: 'Ví tiền mặt', balance: 2500000, isDefault: true, color: '#00C896' },
  { id: 2, icon: '🏦', name: 'Tài khoản TPBank', balance: 35200000, isDefault: false, color: '#4B9EFF' },
  { id: 3, icon: '💳', name: 'Thẻ Visa Techcombank', balance: 12000000, isDefault: false, color: '#7B68EE' },
];

function ProfileSection() {
  return (
    <div className="space-y-5">
      <div>
        <p style={{ fontSize: 13, color: '#8A9AB0', marginBottom: 16 }}>Cập nhật thông tin cá nhân của bạn</p>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00C896' }}>
            <span style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>NT</span>
          </div>
          <button
            className="px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
            style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#5A6A7A', fontWeight: 600 }}
          >
            Đổi ảnh đại diện
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Họ và tên', value: 'Nguyễn Văn Tuấn', type: 'text' },
          { label: 'Email', value: 'nguyen.tuan@email.com', type: 'email' },
          { label: 'Số điện thoại', value: '0912 345 678', type: 'tel' },
          { label: 'Ngày sinh', value: '1995-06-15', type: 'date' },
        ].map((field) => (
          <div key={field.label}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>
              {field.label}
            </label>
            <input
              type={field.type}
              defaultValue={field.value}
              className="w-full px-4 py-3 rounded-xl border outline-none"
              style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
            />
          </div>
        ))}
      </div>
      <button
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        Lưu thay đổi
      </button>
    </div>
  );
}

function PasswordSection() {
  return (
    <div className="space-y-4" style={{ maxWidth: 400 }}>
      <p style={{ fontSize: 13, color: '#8A9AB0', marginBottom: 4 }}>Đặt mật khẩu mới cho tài khoản của bạn</p>
      {[
        { label: 'Mật khẩu hiện tại', placeholder: '••••••••' },
        { label: 'Mật khẩu mới', placeholder: '••••••••' },
        { label: 'Xác nhận mật khẩu mới', placeholder: '••••••••' },
      ].map((f) => (
        <div key={f.label}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>
            {f.label}
          </label>
          <input
            type="password"
            placeholder={f.placeholder}
            className="w-full px-4 py-3 rounded-xl border outline-none"
            style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
          />
        </div>
      ))}
      <button
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        Cập nhật mật khẩu
      </button>
    </div>
  );
}

function WalletsSection() {
  const [walletList, setWalletList] = useState(wallets);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: '#8A9AB0' }}>Quản lý các ví và nguồn tiền của bạn</p>

      {walletList.map((w) => (
        <div
          key={w.id}
          className="flex items-center gap-4 px-4 py-4 rounded-xl border"
          style={{ borderColor: '#F0F2F5', backgroundColor: '#FAFBFC' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: w.color + '20' }}
          >
            <span style={{ fontSize: 22 }}>{w.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{w.name}</p>
              {w.isDefault && (
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#E8FBF5', color: '#00A87A', fontSize: 11, fontWeight: 600 }}
                >
                  Mặc định
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#00C896', fontWeight: 600, marginTop: 2 }}>
              {w.balance.toLocaleString('vi-VN')} ₫
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Edit2 size={15} color="#5A6A7A" />
            </button>
            {!w.isDefault && (
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                onClick={() => setWalletList(walletList.filter(ww => ww.id !== w.id))}
              >
                <Trash2 size={15} color="#FF5C5C" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add wallet */}
      {showAdd ? (
        <div className="p-4 rounded-xl border-2" style={{ borderColor: '#00C896', borderStyle: 'dashed' }}>
          <div className="flex gap-3 mb-3">
            <input
              placeholder="Tên ví"
              className="flex-1 px-3 py-2 rounded-lg border outline-none"
              style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#1A2332' }}
            />
            <input
              type="number"
              placeholder="Số dư ban đầu"
              className="flex-1 px-3 py-2 rounded-lg border outline-none"
              style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#1A2332' }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-2 rounded-lg border"
              style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#5A6A7A', fontWeight: 600 }}
            >
              Hủy
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-2 rounded-lg"
              style={{ backgroundColor: '#00C896', color: 'white', fontSize: 13, fontWeight: 600 }}
            >
              Thêm ví
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
          style={{ borderColor: '#E8EBF0', borderStyle: 'dashed', color: '#8A9AB0' }}
        >
          <Plus size={18} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Thêm ví mới</span>
        </button>
      )}
    </div>
  );
}

function NotificationsSection() {
  const [settings, setSettings] = useState([
    { id: 'daily', label: 'Nhắc nhở hàng ngày', desc: 'Nhắc bạn ghi chép giao dịch', enabled: true },
    { id: 'budget', label: 'Cảnh báo hạn mức', desc: 'Khi chi tiêu vượt ngân sách', enabled: true },
    { id: 'goal', label: 'Cập nhật mục tiêu', desc: 'Nhắc về tiến độ mục tiêu', enabled: false },
    { id: 'report', label: 'Báo cáo hàng tuần', desc: 'Tổng kết chi tiêu mỗi tuần', enabled: true },
  ]);

  return (
    <div className="space-y-3">
      <p style={{ fontSize: 13, color: '#8A9AB0', marginBottom: 8 }}>Quản lý thông báo và nhắc nhở</p>
      {settings.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between px-4 py-4 rounded-xl border"
          style={{ borderColor: '#F0F2F5' }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{s.label}</p>
            <p style={{ fontSize: 12, color: '#8A9AB0', marginTop: 2 }}>{s.desc}</p>
          </div>
          <button
            onClick={() => setSettings(settings.map(ss => ss.id === s.id ? { ...ss, enabled: !ss.enabled } : ss))}
            className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
            style={{ backgroundColor: s.enabled ? '#00C896' : '#D1D9E0' }}
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
  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: '#8A9AB0' }}>Xuất dữ liệu giao dịch của bạn</p>
      <div className="grid grid-cols-2 gap-4">
        {[
          { format: 'Excel (.xlsx)', icon: '📊', desc: 'Phù hợp để phân tích và chỉnh sửa' },
          { format: 'CSV (.csv)', icon: '📋', desc: 'Phù hợp với phần mềm khác' },
          { format: 'PDF (.pdf)', icon: '📄', desc: 'Phù hợp để in và lưu trữ' },
          { format: 'JSON (.json)', icon: '⚙️', desc: 'Dành cho nhà phát triển' },
        ].map((f) => (
          <button
            key={f.format}
            className="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all hover:border-green-400 hover:bg-green-50"
            style={{ borderColor: '#E8EBF0' }}
          >
            <span style={{ fontSize: 24 }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{f.format}</p>
              <p style={{ fontSize: 12, color: '#8A9AB0', marginTop: 2 }}>{f.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-4 items-center pt-2">
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', display: 'block', marginBottom: 6 }}>Khoảng thời gian</label>
          <select className="px-4 py-3 rounded-xl border outline-none" style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#1A2332' }}>
            <option>Tháng này</option>
            <option>3 tháng gần nhất</option>
            <option>6 tháng gần nhất</option>
            <option>Năm nay</option>
            <option>Toàn bộ dữ liệu</option>
          </select>
        </div>
        <button
          className="mt-5 flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
        >
          <Download size={16} />
          Tải xuống
        </button>
      </div>
    </div>
  );
}

function DeleteSection() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FECDD3' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#9F1239', marginBottom: 4 }}>⚠️ Cảnh báo quan trọng</p>
        <p style={{ fontSize: 13, color: '#BE123C', lineHeight: 1.6 }}>
          Hành động này sẽ xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn.
          Thao tác này không thể hoàn tác. Vui lòng xuất dữ liệu trước khi xóa.
        </p>
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', display: 'block', marginBottom: 6 }}>
          Nhập email để xác nhận
        </label>
        <input
          type="email"
          placeholder="ban@email.com"
          className="w-full px-4 py-3 rounded-xl border outline-none"
          style={{ borderColor: '#FECDD3', fontSize: 14, color: '#1A2332', maxWidth: 400 }}
        />
      </div>
      <button
        className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all"
        style={{ backgroundColor: '#FF5C5C', color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        <Trash2 size={16} />
        Xóa tài khoản vĩnh viễn
      </button>
    </div>
  );
}

function LanguageSection() {
  return (
    <div className="space-y-5" style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 13, color: '#8A9AB0' }}>Cài đặt ngôn ngữ và đơn vị tiền tệ</p>
      {[
        { label: 'Ngôn ngữ', options: ['Tiếng Việt', 'English', '日本語'] },
        { label: 'Đơn vị tiền tệ', options: ['VND (₫)', 'USD ($)', 'EUR (€)', 'JPY (¥)'] },
        { label: 'Định dạng ngày', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      ].map((f) => (
        <div key={f.label}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', display: 'block', marginBottom: 6 }}>
            {f.label}
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border outline-none"
            style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
          >
            {f.options.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <button
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        Lưu cài đặt
      </button>
    </div>
  );
}

const sectionComponents: Record<SettingSection, React.ReactNode> = {
  profile: <ProfileSection />,
  password: <PasswordSection />,
  security: (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: '#8A9AB0' }}>Bảo vệ tài khoản với xác thực 2 bước</p>
      <div className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: '#F0F2F5', maxWidth: 460 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>Xác thực 2 lớp (2FA)</p>
          <p style={{ fontSize: 12, color: '#8A9AB0', marginTop: 2 }}>Sử dụng ứng dụng xác thực hoặc SMS</p>
        </div>
        <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#00C896', color: 'white', fontSize: 13, fontWeight: 600 }}>
          Bật ngay
        </button>
      </div>
    </div>
  ),
  wallets: <WalletsSection />,
  budget: (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: '#8A9AB0' }}>Đặt hạn mức chi tiêu cho từng danh mục</p>
      {[
        { cat: '🍜 Ăn uống', limit: 3000000 },
        { cat: '🚗 Đi lại', limit: 2000000 },
        { cat: '🛍️ Mua sắm', limit: 2000000 },
        { cat: '🎬 Giải trí', limit: 1000000 },
        { cat: '🏠 Nhà cửa', limit: 4000000 },
      ].map((b) => (
        <div key={b.cat} className="flex items-center gap-4" style={{ maxWidth: 480 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1A2332', minWidth: 140 }}>{b.cat}</span>
          <input
            type="number"
            defaultValue={b.limit}
            className="flex-1 px-4 py-2.5 rounded-xl border outline-none"
            style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
          />
          <span style={{ fontSize: 13, color: '#8A9AB0' }}>₫</span>
        </div>
      ))}
      <button
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
      >
        Lưu hạn mức
      </button>
    </div>
  ),
  recurring: (
    <div>
      <p style={{ fontSize: 13, color: '#8A9AB0', marginBottom: 16 }}>Các giao dịch tự động lặp lại</p>
      <div className="space-y-3">
        {[
          { name: 'Netflix Premium', amount: -150000, period: 'Hàng tháng', next: '01/07/2025', wallet: 'Thẻ Visa' },
          { name: 'Thuê nhà', amount: -4500000, period: 'Hàng tháng', next: '05/07/2025', wallet: 'TPBank' },
          { name: 'Bảo hiểm sức khỏe', amount: -350000, period: 'Hàng tháng', next: '10/07/2025', wallet: 'TPBank' },
        ].map((r) => (
          <div
            key={r.name}
            className="flex items-center gap-4 p-4 rounded-xl border"
            style={{ borderColor: '#F0F2F5' }}
          >
            <div className="flex-1">
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{r.name}</p>
              <p style={{ fontSize: 12, color: '#8A9AB0', marginTop: 1 }}>{r.period} · Kế tiếp: {r.next} · {r.wallet}</p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#FF5C5C', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              -{Math.abs(r.amount).toLocaleString('vi-VN')} ₫
            </p>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50">
              <Trash2 size={15} color="#FF5C5C" />
            </button>
          </div>
        ))}
      </div>
    </div>
  ),
  language: <LanguageSection />,
  notifications: <NotificationsSection />,
  export: <ExportSection />,
  delete: <DeleteSection />,
};

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
  const [activeSection, setActiveSection] = useState<SettingSection>('wallets');

  return (
    <div className="flex gap-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Left menu */}
      <div
        className="flex-shrink-0 bg-white rounded-2xl py-3 overflow-hidden"
        style={{ width: 240, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5', alignSelf: 'flex-start' }}
      >
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <p style={{ fontSize: 10, fontWeight: 700, color: '#8A9AB0', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '8px 16px 4px' }}>
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
                    backgroundColor: isActive ? '#F0FDF8' : 'transparent',
                    color: isDanger ? '#FF5C5C' : isActive ? '#00C896' : '#5A6A7A',
                    borderLeft: isActive ? '3px solid #00C896' : '3px solid transparent',
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
        className="flex-1 bg-white rounded-2xl p-6"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5', minHeight: 500 }}
      >
        <div className="mb-6" style={{ borderBottom: '1px solid #F0F2F5', paddingBottom: 16 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 20, color: '#1A2332', marginBottom: 4 }}>
            {sectionTitles[activeSection]}
          </h2>
        </div>
        {sectionComponents[activeSection]}
      </div>
    </div>
  );
}
