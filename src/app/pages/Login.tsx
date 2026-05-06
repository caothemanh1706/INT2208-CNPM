import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, CheckCircle, TrendingUp, Sun, Moon } from 'lucide-react';
import { api } from '../../lib/api';
import { auth } from '../../lib/auth';
import { useTheme } from '../contexts/ThemeContext';

export function Login() {
  const navigate = useNavigate();
  const { c, isDark, toggle } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2FA login states
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [tempAuthData, setTempAuthData] = useState<any>(null);

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'email' | 'otp'>('email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await api.login(email, password);
        
        // Check if 2FA is enabled for this user
        const userKey = data.user.username;
        const is2FA = localStorage.getItem(`finwise_2fa_enabled_${userKey}`) === 'true';
        
        if (is2FA) {
          setTempAuthData(data);
          setShow2FA(true);
          setLoading(false);
          return;
        }

        auth.setToken(data.token);
        auth.setUser(data.user);
        navigate('/app');
      } else {
        if (!username.trim()) {
          setError('Vui lòng nhập tên người dùng');
          setLoading(false);
          return;
        }
        const data = await api.register(email, username, password);
        auth.setToken(data.token);
        auth.setUser(data.user);
        // Seed default categories for new user
        try { await api.seedCategories(); } catch (_) {}
        navigate('/app');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const isBackupFormat = /^\d{4}-\d{4}$/.test(twoFACode);
    const isStandardFormat = twoFACode.length === 6 && !isNaN(Number(twoFACode));

    if (!isStandardFormat && !isBackupFormat) {
      setError('Mã xác thực phải gồm 6 chữ số hoặc 8 ký tự mã dự phòng (XXXX-XXXX)');
      return;
    }

    if (tempAuthData) {
      auth.setToken(tempAuthData.token);
      auth.setUser(tempAuthData.user);
      navigate('/app');
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotSuccess('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setDemoOtp(res.otp || '');
      setForgotStep('otp');
    } catch (err: any) {
      setError(err.message || 'Yêu cầu mã OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải từ 6 ký tự trở lên');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(forgotEmail, forgotOtp, newPassword);
      setForgotSuccess('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      // Reset forms
      setForgotStep('email');
      setShowForgotPassword(false);
      setForgotEmail('');
      setForgotOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsLogin(true);
    } catch (err: any) {
      setError(err.message || 'Mã OTP không chính xác hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  const bullets = [
    'Ghi chép thu chi dễ dàng, nhanh chóng',
    'Biểu đồ phân tích tài chính trực quan',
    'Đặt và theo dõi mục tiêu tiết kiệm',
  ];

  return (
    <div className="flex h-screen transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif', backgroundColor: c.bg }}>
      {/* Left panel */}
      <div
        className="flex flex-col items-center justify-center relative"
        style={{ flex: '0 0 50%', backgroundColor: '#0F1923', padding: '48px' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00C896' }}>
            <span style={{ color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 20 }}>F</span>
          </div>
          <span style={{ color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 24 }}>FinWise</span>
        </div>

        {/* Illustration */}
        <div
          className="w-full rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.15)', maxWidth: 380 }}
        >
          {/* Mini chart illustration */}
          <div className="flex items-end gap-2 mb-4" style={{ height: 80 }}>
            {[40, 60, 45, 75, 55, 85, 65, 90, 70, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${h}%`,
                  backgroundColor: i % 2 === 0 ? 'rgba(0,200,150,0.7)' : 'rgba(0,200,150,0.3)',
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Tiết kiệm tháng này</p>
              <p style={{ color: '#00C896', fontSize: 22, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                +6,500,000 ₫
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,200,150,0.2)' }}>
              <TrendingUp size={20} color="#00C896" />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <h2
          className="text-center mb-8"
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 700,
            fontSize: 26,
            color: 'white',
            lineHeight: 1.3,
            maxWidth: 340,
          }}
        >
          Kiểm soát chi tiêu.{' '}
          <span style={{ color: '#00C896' }}>Tự do tài chính.</span>
        </h2>

        {/* Bullets */}
        <div className="space-y-3" style={{ maxWidth: 340, width: '100%' }}>
          {bullets.map((b) => (
            <div key={b} className="flex items-center gap-3">
              <CheckCircle size={18} color="#00C896" style={{ flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center transition-colors duration-300" style={{ padding: '48px', backgroundColor: c.card }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: isDark ? '#243040' : '#F0F2F5' }}
        >
          {isDark ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#1A2332" />}
        </button>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {showForgotPassword ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(0, 200, 150, 0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 22, color: c.text }}>Quên mật khẩu</h2>
                <p style={{ color: c.textMuted, fontSize: 13, lineHeight: 1.5 }}>
                  {forgotStep === 'email' 
                    ? 'Nhập email tài khoản của bạn để nhận mã OTP khôi phục mật khẩu.'
                    : 'Nhập mã OTP được gửi về email của bạn để thiết lập mật khẩu mới.'}
                </p>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: c.redBg }}>
                  <p style={{ fontSize: 13, color: c.red, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {forgotStep === 'email' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 8 }}>
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="ban@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                      style={{ borderColor: c.inputBorder, color: c.text, backgroundColor: c.input, fontSize: 14 }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                      onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#00C896', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Đang gửi mã...' : 'Gửi mã xác nhận (OTP)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setError(''); }}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                    style={{ color: c.textSub, borderColor: c.inputBorder, backgroundColor: 'transparent' }}
                  >
                    Quay lại đăng nhập
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div className="p-3.5 rounded-xl space-y-1 text-xs" style={{ backgroundColor: 'rgba(0, 200, 150, 0.08)', border: '1px dashed #00C896' }}>
                    <p style={{ color: '#00C896', fontWeight: 700 }}>[Hỗ trợ chạy thử nghiệm - SMTP Simulator]</p>
                    <p style={{ color: c.text, lineHeight: 1.4 }}>Mã xác thực OTP đã được gửi đến email <strong>{forgotEmail}</strong>. Mã OTP của bạn là: <strong style={{ fontSize: 14, color: '#00C896' }}>{demoOtp}</strong></p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>
                      Mã xác thực OTP
                    </label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="Nhập mã 6 số"
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl border outline-none text-center font-bold tracking-widest transition-all"
                      style={{ borderColor: c.inputBorder, color: c.text, backgroundColor: c.input, fontSize: 16 }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                      onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                      style={{ borderColor: c.inputBorder, color: c.text, backgroundColor: c.input, fontSize: 14 }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                      onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6 }}>
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                      style={{ borderColor: c.inputBorder, color: c.text, backgroundColor: c.input, fontSize: 14 }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                      onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#00C896', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Đang cập nhật...' : 'Xác nhận & Thiết lập mật khẩu'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setForgotStep('email'); setError(''); }}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                    style={{ color: c.textSub, borderColor: c.inputBorder, backgroundColor: 'transparent' }}
                  >
                    Quay lại bước nhập Email
                  </button>
                </form>
              )}
            </div>
          ) : show2FA ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(0, 200, 150, 0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 22, color: c.text }}>Xác thực 2 lớp (2FA)</h2>
                <p style={{ color: c.textMuted, fontSize: 13, lineHeight: 1.5 }}>
                  Tài khoản của bạn đã được kích hoạt bảo mật 2 lớp. Vui lòng nhập mã 6 số từ ứng dụng Authenticator hoặc mã dự phòng để tiếp tục.
                </p>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: c.redBg }}>
                  <p style={{ fontSize: 13, color: c.red, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleVerify2FA} className="space-y-4">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 8, textAlign: 'center' }}>
                    Mã xác nhận 6 số hoặc Mã dự phòng
                  </label>
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    placeholder="e.g. 123456 hoặc XXXX-XXXX"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border outline-none text-center font-bold text-lg tracking-wider transition-all"
                    style={{ borderColor: c.inputBorder, color: c.text, backgroundColor: c.input }}
                    onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                    onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#00C896' }}
                >
                  Xác minh & Đăng nhập
                </button>

                <button
                  type="button"
                  onClick={() => { setShow2FA(false); setTwoFACode(''); setError(''); }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                  style={{ color: c.textSub, borderColor: c.inputBorder, backgroundColor: 'transparent' }}
                >
                  Quay lại đăng nhập
                </button>
              </form>
            </div>
          ) : (
            <>
              <h2
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: 28,
                  color: c.text,
                  marginBottom: 8,
                }}
              >
                {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
              </h2>
              <p style={{ color: c.textMuted, fontSize: 15, marginBottom: 28 }}>
                {isLogin ? 'Đăng nhập để tiếp tục' : 'Bắt đầu hành trình tài chính của bạn'}
              </p>

              {/* Success notifications */}
              {forgotSuccess && (
                <div className="mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(0, 200, 150, 0.1)' }}>
                  <p style={{ fontSize: 13, color: '#00C896', fontWeight: 600 }}>{forgotSuccess}</p>
                </div>
              )}

              {/* Social buttons */}
              <div className="space-y-3 mb-6">
                <button
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-all"
                  style={{ borderColor: c.inputBorder, fontSize: 14, fontWeight: 500, color: c.text, backgroundColor: c.input }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.input)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Tiếp tục với Google
                </button>
                <button
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-all"
                  style={{ borderColor: c.inputBorder, fontSize: 14, fontWeight: 500, color: c.text, backgroundColor: c.input }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.input)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Tiếp tục với Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ backgroundColor: c.divider }} />
                <span style={{ color: c.textMuted, fontSize: 13 }}>hoặc</span>
                <div className="flex-1 h-px" style={{ backgroundColor: c.divider }} />
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: c.redBg, border: `1px solid ${c.redBg}` }}
                >
                  <p style={{ fontSize: 13, color: c.red, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                    style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                    onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                    onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 6 }}>
                      Tên người dùng
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="VD: nguyen_tuan"
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                      style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                      onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 6 }}>
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all pr-12"
                      style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                      onBlur={(e) => (e.target.style.borderColor = c.inputBorder)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={18} color={c.textMuted} /> : <Eye size={18} color={c.textMuted} />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => { setShowForgotPassword(true); setError(''); }}
                      style={{ color: '#00C896', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl transition-all hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#00C896', color: 'white', fontSize: 15, fontWeight: 600, marginTop: 4, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: 14, color: c.textMuted, marginTop: 20 }}>
                {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  style={{ color: '#00C896', fontWeight: 600 }}
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
