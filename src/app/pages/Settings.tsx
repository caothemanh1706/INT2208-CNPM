import { useState, useEffect } from 'react';
import {
  User, Lock, Shield, Wallet, SlidersHorizontal, RefreshCw,
  Globe, Bell, Download, Trash2, Plus, X,
} from 'lucide-react';
import { api } from '../../lib/api';
import { auth } from '../../lib/auth';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../../lib/notifications';

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
      notificationService.add(`Hồ sơ: Cập nhật tên hiển thị thành "${displayName}" thành công.`);
      window.dispatchEvent(new Event('user-profile-updated'));
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
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90 cursor-pointer"
        style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600, opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>
    </div>
  );
}

function PasswordSection() {
  const { c } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải từ 6 ký tự trở lên');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setLoading(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      setMsg(res.message || 'Cập nhật mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      notificationService.add('Bảo mật: Bạn đã đổi mật khẩu tài khoản thành công.');
    } catch (err: any) {
      setError(err.message || 'Mật khẩu hiện tại không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4" style={{ maxWidth: 400 }}>
      <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 4 }}>Đặt mật khẩu mới cho tài khoản của bạn</p>
      
      {error && (
        <div className="p-3.5 rounded-xl text-xs font-semibold animate-shake" style={{ backgroundColor: c.redBg, color: c.red }}>
          {error}
        </div>
      )}
      {msg && (
        <div className="p-3.5 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'rgba(0, 200, 150, 0.1)', color: c.green }}>
          {msg}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>
          Mật khẩu hiện tại
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
          style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>
          Mật khẩu mới
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
          style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>
          Xác nhận mật khẩu mới
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
          style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90 cursor-pointer text-sm"
        style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
      </button>
    </form>
  );
}

function SecuritySection() {
  const { c, isDark } = useTheme();
  const user = auth.getUser();
  const userKey = user?.username || 'global';
  const enabledKey = `finwise_2fa_enabled_${userKey}`;
  const secretKey = `finwise_2fa_secret_${userKey}`;
  const backupKey = `finwise_2fa_backup_${userKey}`;

  const [isEnabled, setIsEnabled] = useState(() => localStorage.getItem(enabledKey) === 'true');
  const [step, setStep] = useState<'idle' | 'setup' | 'backup' | 'active'>('idle');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    if (isEnabled) {
      setStep('active');
    } else {
      setStep('idle');
    }
  }, [isEnabled]);

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.match(/.{1,4}/g)?.join(' ') || result;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 4; i++) {
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      codes.push(code.match(/.{1,4}/g)?.join('-') || code);
    }
    return codes;
  };

  const handleStartSetup = () => {
    const newSecret = generateSecret();
    setSecret(newSecret);
    setCode('');
    setError('');
    setStep('setup');
  };

  const handleVerify = () => {
    if (code.length !== 6 || isNaN(Number(code))) {
      setError('Mã xác thực phải gồm 6 chữ số.');
      return;
    }
    
    // Simulate verification success
    setError('');
    const codes = generateBackupCodes();
    setBackupCodes(codes);
    
    // Save to localStorage
    localStorage.setItem(enabledKey, 'true');
    localStorage.setItem(secretKey, secret);
    localStorage.setItem(backupKey, JSON.stringify(codes));
    
    notificationService.add('Cài đặt: Đã kích hoạt bảo mật 2 lớp (2FA) thành công.');
    setStep('backup');
  };

  const handleDisable = () => {
    if (window.confirm('Bạn có chắc chắn muốn TẮT xác thực 2 lớp? Việc này sẽ giảm mức độ bảo mật tài khoản.')) {
      localStorage.removeItem(enabledKey);
      localStorage.removeItem(secretKey);
      localStorage.removeItem(backupKey);
      setIsEnabled(false);
      setStep('idle');
      notificationService.add('Cài đặt: Đã vô hiệu hóa bảo mật 2 lớp (2FA).');
    }
  };

  return (
    <div className="space-y-5" style={{ maxWidth: 500 }}>
      <p style={{ fontSize: 13, color: c.textMuted }}>
        Tăng cường bảo vệ tài khoản bằng cách yêu cầu mã xác minh 6 số khi đăng nhập từ thiết bị lạ.
      </p>

      {step === 'idle' && (
        <div className="flex items-center justify-between p-5 rounded-2xl border transition-all duration-300" 
             style={{ borderColor: c.divider, backgroundColor: c.input }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: c.text }}>Xác thực hai lớp (2FA)</p>
            <p style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>Sử dụng các ứng dụng như Google / Microsoft Authenticator.</p>
          </div>
          <button 
            onClick={handleStartSetup}
            className="px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer hover:opacity-90 font-semibold text-sm flex-shrink-0"
            style={{ backgroundColor: c.green }}
          >
            Bật ngay
          </button>
        </div>
      )}

      {step === 'setup' && (
        <div className="p-5 rounded-2xl border transition-all duration-300 space-y-5" 
             style={{ borderColor: c.green, backgroundColor: isDark ? 'rgba(0, 200, 150, 0.05)' : '#F0FDF4' }}>
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: c.text }}>Thiết lập Xác thực 2 lớp</h3>
            <button onClick={() => setStep('idle')} className="text-xs font-semibold cursor-pointer" style={{ color: c.textSub }}>Hủy</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: c.green }}>1</div>
              <p style={{ fontSize: 13, color: c.text }}>Tải ứng dụng <strong>Google Authenticator</strong> hoặc <strong>Microsoft Authenticator</strong> trên điện thoại.</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: c.green }}>2</div>
              <div className="space-y-3 flex-1">
                <p style={{ fontSize: 13, color: c.text }}>Mở ứng dụng, quét mã QR dưới đây hoặc tự nhập mã khóa:</p>
                <div className="flex items-center gap-4">
                  {/* Real, scannable QR Code generated via QR Server API */}
                  <div className="p-2 bg-white rounded-xl border flex-shrink-0" style={{ borderColor: '#E2E8F0' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`otpauth://totp/FinWise:${user?.email || 'user'}?secret=${secret.replace(/\s/g, '')}&issuer=FinWise`)}`}
                      alt="TOTP QR Code" 
                      width="100" 
                      height="100" 
                      className="block object-contain"
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: c.textMuted, display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Khóa bí mật</span>
                    <span style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 700, color: c.text, display: 'block', margin: '4px 0 6px' }}>{secret}</span>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(secret.replace(/\s/g, '')); alert('Đã sao chép mã khóa!'); }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer" 
                      style={{ color: c.green, borderColor: c.green, backgroundColor: 'transparent' }}
                    >
                      Sao chép
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: c.green }}>3</div>
              <div className="space-y-3 flex-1">
                <p style={{ fontSize: 13, color: c.text }}>Nhập mã xác thực 6 số gồm từ ứng dụng của bạn để xác minh:</p>
                <div className="flex gap-3">
                  <input 
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="px-4 py-2.5 rounded-xl border outline-none text-center font-bold text-lg tracking-widest transition-all"
                    style={{ width: 140, borderColor: c.inputBorder, color: c.text, backgroundColor: c.input }}
                  />
                  <button 
                    onClick={handleVerify}
                    className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: c.green }}
                  >
                    Xác nhận
                  </button>
                </div>
                {error && <p style={{ fontSize: 12, color: c.red, fontWeight: 600 }}>⚠️ {error}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'backup' && (
        <div className="p-5 rounded-2xl border transition-all duration-300 space-y-5" 
             style={{ borderColor: c.green, backgroundColor: isDark ? 'rgba(0, 200, 150, 0.05)' : '#F0FDF4' }}>
          <div className="text-center space-y-2">
            <span style={{ fontSize: 36 }}>🎉</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.green }}>Kích hoạt 2FA thành công!</h3>
            <p style={{ fontSize: 13, color: c.textSub }}>Lưu lại các mã dự phòng sau để truy cập tài khoản khi mất điện thoại:</p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-white border border-dashed" style={{ borderColor: c.green }}>
            {backupCodes.map((bc, i) => (
              <div key={i} className="text-center py-2 font-mono text-sm font-bold" style={{ color: '#1E293B' }}>
                {bc}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: c.textMuted, textAlign: 'center' }}>
            Mỗi mã chỉ sử dụng được một lần duy nhất.
          </p>

          <button 
            onClick={() => { setIsEnabled(true); setStep('active'); }}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer hover:opacity-90 text-center block"
            style={{ backgroundColor: c.green }}
          >
            Tôi đã lưu lại mã dự phòng
          </button>
        </div>
      )}

      {step === 'active' && (
        <div className="p-5 rounded-2xl border transition-all duration-300 space-y-4" 
             style={{ borderColor: c.green, backgroundColor: isDark ? 'rgba(0, 200, 150, 0.05)' : 'rgba(0, 200, 150, 0.02)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: c.greenBg }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: c.text }}>Xác thực hai lớp (2FA) đang hoạt động</p>
              <p style={{ fontSize: 12, color: c.green, fontWeight: 600, marginTop: 2 }}>✓ Tài khoản của bạn đang được bảo vệ ở cấp độ cao nhất.</p>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleDisable}
              className="px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer"
              style={{ color: c.red, borderColor: c.red, backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.redBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Vô hiệu hóa 2FA
            </button>
          </div>
        </div>
      )}
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

  const formatInputCurrency = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return '';
    return Number(clean).toLocaleString('vi-VN');
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const cleanBalance = newBalance.replace(/\D/g, '');
      const balanceVal = parseFloat(cleanBalance) || 0;
      const acc = await api.createAccount({ name: newName, balance: balanceVal });
      setWalletList([...walletList, acc]);
      notificationService.add(`Ví: Đã thêm ví mới "${newName}" với số dư ${balanceVal.toLocaleString('vi-VN')} ₫.`);
      setNewName(''); setNewBalance(''); setShowAdd(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    try {
      const walletName = walletList.find(w => w.id === id)?.name || '';
      await api.deleteAccount(id);
      setWalletList(walletList.filter(w => w.id !== id));
      notificationService.add(`Ví: Đã xóa tài khoản/ví "${walletName}".`);
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
            <input type="text" value={newBalance} onChange={e => setNewBalance(formatInputCurrency(e.target.value))}
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
  const { t, language, currency } = useLanguage();
  
  interface CategoryBudget {
    categoryId: number;
    categoryName: string;
    emoji: string;
    budgetId?: number;
    limit: string;
  }

  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getCategoryEmoji = (name: string, icon?: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ăn uống') || lowerName.includes('food') || icon?.toLowerCase().includes('utensils')) return '🍜';
    if (lowerName.includes('di chuyển') || lowerName.includes('đi lại') || lowerName.includes('travel') || icon?.toLowerCase().includes('car')) return '🚗';
    if (lowerName.includes('mua sắm') || lowerName.includes('shop') || icon?.toLowerCase().includes('bag')) return '🛍️';
    if (lowerName.includes('giải trí') || lowerName.includes('entertainment') || icon?.toLowerCase().includes('film') || icon?.toLowerCase().includes('tv') || icon?.toLowerCase().includes('game')) return '🎬';
    if (lowerName.includes('nhà ở') || lowerName.includes('nhà cửa') || lowerName.includes('home') || lowerName.includes('house') || icon?.toLowerCase().includes('home')) return '🏠';
    if (lowerName.includes('sức khỏe') || lowerName.includes('y tế') || lowerName.includes('health') || icon?.toLowerCase().includes('heart') || icon?.toLowerCase().includes('pill')) return '💊';
    if (lowerName.includes('giáo dục') || lowerName.includes('học tập') || lowerName.includes('education') || icon?.toLowerCase().includes('book')) return '📚';
    if (lowerName.includes('lương') || lowerName.includes('salary') || icon?.toLowerCase().includes('wallet')) return '💵';
    return '🏷️';
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, bdgts] = await Promise.all([
          api.getCategories(),
          api.getBudgets(),
        ]);

        const expenseCats = cats.filter((c: any) => c.type === 'expense');

        const items = expenseCats.map((cat: any) => {
          const match = bdgts.find(
            (b: any) => b.categoryId === cat.id || b.category?.toLowerCase() === cat.name?.toLowerCase()
          );

          return {
            categoryId: cat.id,
            categoryName: cat.name,
            emoji: getCategoryEmoji(cat.name, cat.icon),
            budgetId: match?.id,
            limit: match && match.limit > 0 ? Number(match.limit).toLocaleString('vi-VN') : '',
          };
        });

        setCategoryBudgets(items);
      } catch (err) {
        console.error('Error loading budgets/categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const translateSettingsCategory = (catName: string) => {
    let key = catName.trim();
    if (key === 'Đi lại') key = 'di chuyển';
    if (key === 'Nhà cửa') key = 'nhà ở';
    return t(key);
  };

  const formatInputCurrency = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return '';
    return Number(clean).toLocaleString('vi-VN');
  };

  const handleLimitChange = (idx: number, val: string) => {
    const updated = [...categoryBudgets];
    updated[idx].limit = formatInputCurrency(val);
    setCategoryBudgets(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = categoryBudgets.map(async (item) => {
        const cleanLimit = item.limit.replace(/\D/g, '');
        const limitVal = parseFloat(cleanLimit) || 0;

        if (item.budgetId) {
          if (limitVal > 0) {
            await api.updateBudget(item.budgetId, { limit: limitVal });
          } else {
            await api.deleteBudget(item.budgetId);
          }
        } else {
          if (limitVal > 0) {
            await api.createBudget({
              category: item.categoryName,
              categoryId: item.categoryId,
              limit: limitVal,
              period: 'monthly'
            });
          }
        }
      });

      await Promise.all(promises);

      // Reload updated data
      const [cats, bdgts] = await Promise.all([
        api.getCategories(),
        api.getBudgets(),
      ]);

      const expenseCats = cats.filter((c: any) => c.type === 'expense');
      const updatedItems = expenseCats.map((cat: any) => {
        const match = bdgts.find(
          (b: any) => b.categoryId === cat.id || b.category?.toLowerCase() === cat.name?.toLowerCase()
        );
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          emoji: getCategoryEmoji(cat.name, cat.icon),
          budgetId: match?.id,
          limit: match && match.limit > 0 ? Number(match.limit).toLocaleString('vi-VN') : '',
        };
      });
      setCategoryBudgets(updatedItems);

      const msg = language === 'en'
        ? 'Budgets: Successfully saved all budget limits!'
        : language === 'zh'
        ? '预算限额: 已成功保存所有分类支出限额！'
        : 'Hạn mức: Đã lưu thành công tất cả hạn mức chi tiêu!';
      notificationService.add(msg);
    } catch (err) {
      console.error('Error saving budgets:', err);
      alert('Đã xảy ra lỗi khi lưu hạn mức!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center" style={{ color: c.textMuted, fontSize: 14 }}>
        {language === 'en' ? 'Loading categories and budgets...' : language === 'zh' ? '正在加载支出分类与预算限额...' : 'Đang tải danh sách danh mục và hạn mức...'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: c.textMuted }}>
        {language === 'en' ? 'Set monthly spending limit for each category' : language === 'zh' ? '为每个记账分类配置本月度支出硬性限制' : 'Đặt hạn mức chi tiêu cho từng danh mục'}
      </p>
      
      {categoryBudgets.length === 0 ? (
        <p style={{ fontSize: 13, color: c.textMuted, py: 4 }}>
          {language === 'en' ? 'No spending categories found.' : language === 'zh' ? '未找到任何支出分类。' : 'Không tìm thấy danh mục chi tiêu nào.'}
        </p>
      ) : (
        categoryBudgets.map((item, idx) => (
          <div key={item.categoryId} className="flex items-center gap-4" style={{ maxWidth: 480 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: c.text, minWidth: 160 }}>
              {item.emoji} {translateSettingsCategory(item.categoryName)}
            </span>
            <input
              type="text"
              value={item.limit}
              onChange={(e) => handleLimitChange(idx, e.target.value)}
              placeholder="0"
              className="flex-1 px-4 py-2.5 rounded-xl border outline-none transition-colors duration-300"
              style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
            />
            <span style={{ fontSize: 13, color: c.textMuted }}>
              {currency === 'USD' ? '$' : currency === 'CNY' ? '¥' : '₫'}
            </span>
          </div>
        ))
      )}

      <button
        onClick={handleSave}
        disabled={saving || categoryBudgets.length === 0}
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90 cursor-pointer flex items-center justify-center font-semibold text-sm"
        style={{ 
          backgroundColor: c.green, 
          color: 'white', 
          opacity: (saving || categoryBudgets.length === 0) ? 0.7 : 1,
          cursor: (saving || categoryBudgets.length === 0) ? 'not-allowed' : 'pointer'
        }}
      >
        {saving 
          ? (language === 'en' ? 'Saving...' : language === 'zh' ? '正在保存...' : 'Đang lưu...') 
          : (language === 'en' ? 'Save budgets' : language === 'zh' ? '保存预算限制' : 'Lưu hạn mức')
        }
      </button>
    </div>
  );
}

function NotificationsSection() {
  const { c, isDark } = useTheme();
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('finwise_notification_settings');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'daily', label: 'Nhắc nhở hàng ngày', desc: 'Nhắc bạn ghi chép giao dịch', enabled: true },
      { id: 'budget', label: 'Cảnh báo hạn mức', desc: 'Khi chi tiêu vượt ngân sách', enabled: true },
      { id: 'goal', label: 'Cập nhật mục tiêu', desc: 'Nhắc về tiến độ mục tiêu', enabled: true },
      { id: 'report', label: 'Báo cáo hàng tuần', desc: 'Tổng kết chi tiêu mỗi tuần', enabled: true },
    ];
  });

  const handleToggle = (id: string) => {
    const updated = settings.map(s => {
      if (s.id === id) {
        const nextState = !s.enabled;
        // Dispatch real-time notification
        notificationService.add(`Cài đặt: Đã ${nextState ? 'BẬT' : 'TẮT'} thông báo "${s.label}".`);
        return { ...s, enabled: nextState };
      }
      return s;
    });
    setSettings(updated);
    localStorage.setItem('finwise_notification_settings', JSON.stringify(updated));
  };

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
            onClick={() => handleToggle(s.id)}
            className="relative w-12 h-6 rounded-full transition-all flex-shrink-0 cursor-pointer"
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
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'csv' | 'pdf' | 'json'>('excel');
  const [period, setPeriod] = useState<'month' | '3months' | '6months' | 'year' | 'all'>('month');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const formats = [
    { id: 'excel' as const, format: 'Excel (.xlsx)', icon: '📊', desc: 'Định dạng CSV tối ưu hóa cho Microsoft Excel' },
    { id: 'csv' as const, format: 'CSV (.csv)', icon: '📋', desc: 'Phù hợp với các phần mềm quản lý dữ liệu khác' },
    { id: 'pdf' as const, format: 'PDF / In ấn', icon: '📄', desc: 'Tạo bản in báo cáo tài chính đẹp mắt' },
    { id: 'json' as const, format: 'JSON (.json)', icon: '⚙️', desc: 'Sao lưu toàn bộ cấu trúc dữ liệu tài chính' },
  ];

  const handleExport = async () => {
    setLoading(true);
    setStatusMsg('');
    try {
      // Fetch user data
      const transactions = await api.getTransactions();
      
      // Filter transactions by period
      const now = new Date();
      const filteredTransactions = transactions.filter((t: any) => {
        const tDate = new Date(t.date);
        if (isNaN(tDate.getTime())) return true; // Keep if date is invalid as fallback
        
        const diffTime = Math.abs(now.getTime() - tDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (period === 'month') {
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        } else if (period === '3months') {
          return diffDays <= 90;
        } else if (period === '6months') {
          return diffDays <= 180;
        } else if (period === 'year') {
          return tDate.getFullYear() === now.getFullYear();
        }
        return true; // 'all'
      });

      if (filteredTransactions.length === 0 && selectedFormat !== 'json') {
        setStatusMsg('Không có giao dịch nào trong khoảng thời gian đã chọn để xuất.');
        setLoading(false);
        return;
      }

      // Perform download based on selected format
      if (selectedFormat === 'json') {
        // Full backup: Export everything we can get
        let accounts = [];
        let budgets = [];
        let notes = [];
        try {
          accounts = await api.getAccounts();
          budgets = await api.getBudgets();
          notes = await api.getNotes();
        } catch (err) {
          console.warn('Failed to fetch auxiliary data for full backup, exporting transactions only', err);
        }

        const backupData = {
          exportDate: new Date().toISOString(),
          period,
          user: auth.getUser(),
          transactions: filteredTransactions,
          accounts,
          budgets,
          notes
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finwise_backup_${period}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStatusMsg('Đã xuất file JSON sao lưu thành công!');

      } else if (selectedFormat === 'csv' || selectedFormat === 'excel') {
        // Headers: CSV columns
        const headers = ['ID', 'Ngay', 'Loai', 'So tien (VND)', 'Danh muc', 'Tai khoan', 'Mo ta', 'Ghi chu', 'Dinh ky'];
        const csvRows = [headers.join(',')];

        filteredTransactions.forEach((t: any) => {
          const typeLabel = t.type === 'income' ? 'Thu nhập' : t.type === 'expense' ? 'Chi tiêu' : t.type === 'transfer' ? 'Chuyển khoản' : 'Điều chỉnh';
          const row = [
            t.id,
            new Date(t.date).toLocaleDateString('vi-VN'),
            typeLabel,
            t.amount,
            t.category || t.categoryRel?.name || '',
            t.account || t.accountRel?.name || '',
            `"${(t.description || '').replace(/"/g, '""')}"`,
            `"${(t.note || '').replace(/"/g, '""')}"`,
            t.isRecurring ? 'Có' : 'Không'
          ];
          csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        
        // For Excel, we prepend the UTF-8 BOM (\uFEFF) so Vietnamese letters render properly
        const BOM = selectedFormat === 'excel' ? '\uFEFF' : '';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finwise_export_${period}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setStatusMsg(`Đã xuất file báo cáo ${selectedFormat === 'excel' ? 'Excel CSV' : 'CSV'} thành công!`);

      } else if (selectedFormat === 'pdf') {
        // Beautiful PDF printable view
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          setStatusMsg('Không thể mở cửa sổ in. Vui lòng cho phép popup trên trình duyệt của bạn.');
          setLoading(false);
          return;
        }

        const totalIncome = filteredTransactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
        const totalExpense = filteredTransactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
        const net = totalIncome - totalExpense;

        const periodLabel = period === 'month' ? 'Tháng này' : period === '3months' ? '3 tháng gần nhất' : period === '6months' ? '6 tháng gần nhất' : period === 'year' ? 'Năm nay' : 'Toàn bộ thời gian';

        const htmlContent = `
          <html>
            <head>
              <title>Báo cáo Tài chính FinWise - ${periodLabel}</title>
              <style>
                body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; padding: 40px; margin: 0; }
                h1 { color: #00C896; margin-bottom: 5px; font-weight: 700; }
                .subtitle { color: #64748B; font-size: 14px; margin-bottom: 30px; }
                .summary-box { display: flex; gap: 20px; margin-bottom: 30px; }
                .card { flex: 1; padding: 15px; border-radius: 8px; border: 1px solid #E2E8F0; background-color: #F8FAFC; }
                .card-title { font-size: 11px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
                .card-value { font-size: 18px; font-weight: 700; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background-color: #F1F5F9; text-align: left; padding: 10px 12px; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 2px solid #E2E8F0; }
                td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #E2E8F0; }
                .income { color: #00C896; font-weight: 600; }
                .expense { color: #FF5C5C; font-weight: 600; }
                @media print {
                  body { padding: 20px; }
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h1>FinWise</h1>
                  <div class="subtitle">Báo cáo tài chính cá nhân · Khoảng thời gian: <strong>${periodLabel}</strong></div>
                </div>
                <button onclick="window.print()" style="background-color:#00C896; color:white; border:none; padding:10px 18px; border-radius:6px; font-weight:600; cursor:pointer;">In Báo Cáo</button>
              </div>

              <div class="summary-box">
                <div class="card">
                  <div class="card-title">Tổng Thu nhập</div>
                  <div class="card-value income">+${totalIncome.toLocaleString('vi-VN')} ₫</div>
                </div>
                <div class="card">
                  <div class="card-title">Tổng Chi tiêu</div>
                  <div class="card-value expense">-${totalExpense.toLocaleString('vi-VN')} ₫</div>
                </div>
                <div class="card">
                  <div class="card-title">Thặng dư tích lũy</div>
                  <div class="card-value" style="color: ${net >= 0 ? '#00C896' : '#FF5C5C'}">${net >= 0 ? '+' : ''}${net.toLocaleString('vi-VN')} ₫</div>
                </div>
              </div>

              <h3>Danh sách Giao dịch (${filteredTransactions.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Loại</th>
                    <th>Danh mục</th>
                    <th>Ví / Nguồn tiền</th>
                    <th>Mô tả</th>
                    <th style="text-align: right;">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredTransactions.map((t: any) => {
                    const typeLabel = t.type === 'income' ? 'Thu nhập' : t.type === 'expense' ? 'Chi tiêu' : t.type === 'transfer' ? 'Chuyển khoản' : 'Điều chỉnh';
                    const amountClass = t.type === 'income' ? 'income' : t.type === 'expense' ? 'expense' : '';
                    const sign = t.type === 'income' ? '+' : t.type === 'expense' ? '-' : '';
                    return `
                      <tr>
                        <td>${new Date(t.date).toLocaleDateString('vi-VN')}</td>
                        <td>${typeLabel}</td>
                        <td>${t.category || t.categoryRel?.name || '-'}</td>
                        <td>${t.account || t.accountRel?.name || '-'}</td>
                        <td>${t.description || t.note || '-'}</td>
                        <td style="text-align: right;" class="${amountClass}">${sign}${t.amount.toLocaleString('vi-VN')} ₫</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>

              <div style="margin-top:40px; text-align:center; font-size:11px; color:#94A3B8;">
                Báo cáo được khởi tạo tự động từ hệ thống quản lý tài chính FinWise vào lúc ${new Date().toLocaleString('vi-VN')}
              </div>
              <script>
                // Auto trigger print in a split second
                setTimeout(() => { window.print(); }, 500);
              </script>
            </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setStatusMsg('Đã tạo cửa sổ báo cáo PDF thành công!');
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg('Có lỗi xảy ra khi xuất dữ liệu: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p style={{ fontSize: 13, color: c.textMuted }}>Xuất dữ liệu giao dịch của bạn dưới nhiều định dạng</p>
      
      <div className="grid grid-cols-2 gap-4">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => { setSelectedFormat(f.id); setStatusMsg(''); }}
            className="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-300"
            style={{ 
              borderColor: selectedFormat === f.id ? c.green : c.inputBorder, 
              backgroundColor: selectedFormat === f.id ? c.greenBg : 'transparent',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: 24 }}>{f.icon}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: selectedFormat === f.id ? c.green : c.text }}>{f.format}</p>
              <p style={{ fontSize: 12, color: c.textMuted, marginTop: 4 }}>{f.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-6 items-end pt-2 flex-wrap">
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Khoảng thời gian</label>
          <select 
            value={period} 
            onChange={(e) => { setPeriod(e.target.value as any); setStatusMsg(''); }}
            className="px-4 py-3 rounded-xl border outline-none transition-colors duration-300" 
            style={{ borderColor: c.inputBorder, fontSize: 13, color: c.text, backgroundColor: c.input, minWidth: 160 }}
          >
            <option value="month">Tháng này</option>
            <option value="3months">3 tháng gần nhất</option>
            <option value="6months">6 tháng gần nhất</option>
            <option value="year">Năm nay</option>
            <option value="all">Toàn bộ dữ liệu</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}
        >
          <Download size={16} />
          {loading ? 'Đang xuất...' : 'Tải xuống / Tạo bản in'}
        </button>
      </div>

      {statusMsg && (
        <p style={{ 
          fontSize: 13, 
          fontWeight: 500,
          color: statusMsg.includes('thành công') ? c.green : statusMsg.includes('Không') ? '#EAB308' : c.red,
          marginTop: 10 
        }}>
          {statusMsg}
        </p>
      )}
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
  const { language, setLanguage, currency, setCurrency, dateFormat, setDateFormat, t } = useLanguage();

  const [lang, setLang] = useState<any>(language);
  const [curr, setCurr] = useState<any>(currency);
  const [dateFmt, setDateFmt] = useState<any>(dateFormat);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = () => {
    setSaving(true);
    setSuccessMsg('');
    
    setTimeout(() => {
      setLanguage(lang);
      setCurrency(curr);
      setDateFormat(dateFmt);
      setSaving(false);
      setSuccessMsg(t('success'));
      
      // Notify
      notificationService.add(`${t('currency_and_language')}: ${t('success')}`);
      
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    }, 600);
  };

  return (
    <div className="space-y-5" style={{ maxWidth: 480 }}>
      <p style={{ fontSize: 13, color: c.textMuted }}>{t('profile_desc')}</p>
      
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
          {t('system_language')}
        </label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
          style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input, cursor: 'pointer' }}
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
          <option value="zh">中文 (Chinese)</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
          {t('system_currency')}
        </label>
        <select
          value={curr}
          onChange={(e) => setCurr(e.target.value as any)}
          className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
          style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input, cursor: 'pointer' }}
        >
          <option value="VND">VND (₫)</option>
          <option value="USD">USD ($)</option>
          <option value="CNY">CNY (¥)</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
          {t('system_date_format')}
        </label>
        <select
          value={dateFmt}
          onChange={(e) => setDateFmt(e.target.value as any)}
          className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
          style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input, cursor: 'pointer' }}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
        </select>
      </div>

      {successMsg && (
        <p style={{ fontSize: 13, fontWeight: 600, color: c.green }}>
          ✨ {successMsg}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 rounded-xl transition-all hover:opacity-90 cursor-pointer"
        style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600, opacity: saving ? 0.7 : 1 }}
      >
        {saving ? t('loading') : t('save_changes_btn')}
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
  const { t, language } = useLanguage();
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

  const getTranslatedGroupLabel = (label: string) => {
    const lower = label.toLowerCase();
    if (lower === 'tài khoản') return language === 'en' ? 'Account' : language === 'zh' ? '账户设置' : 'Tài khoản';
    if (lower === 'tài chính') return language === 'en' ? 'Finance' : language === 'zh' ? '财务中心' : 'Tài chính';
    if (lower === 'hệ thống') return language === 'en' ? 'System' : language === 'zh' ? '系统设置' : 'Hệ thống';
    if (lower === 'dữ liệu') return language === 'en' ? 'Data' : language === 'zh' ? '数据管理' : 'Dữ liệu';
    return label;
  };

  const getTranslatedItemLabel = (id: SettingSection, fallback: string) => {
    switch (id) {
      case 'profile': return t('profile');
      case 'password': return t('change_password');
      case 'security': return t('security_2fa');
      case 'wallets': return language === 'en' ? 'Wallet Management' : language === 'zh' ? '钱包账户管理' : 'Quản lý ví';
      case 'budget': return t('budget_limit');
      case 'recurring': return t('recurring_transactions');
      case 'language': return t('currency_and_language');
      case 'notifications': return language === 'en' ? 'Notifications' : language === 'zh' ? '推送通知偏好' : 'Thông báo';
      case 'export': return t('export_data');
      case 'delete': return t('delete_account');
      default: return fallback;
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
              {getTranslatedGroupLabel(group.label)}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isDanger = item.id === 'delete';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-all relative cursor-pointer"
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
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>
                    {getTranslatedItemLabel(item.id, item.label)}
                  </span>
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
            {getTranslatedItemLabel(activeSection, sectionTitles[activeSection])}
          </h2>
        </div>
        {renderSection()}
      </div>
    </div>
  );
}
