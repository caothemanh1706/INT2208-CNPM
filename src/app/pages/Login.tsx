import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, CheckCircle, TrendingUp } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  const bullets = [
    'Ghi chép thu chi dễ dàng, nhanh chóng',
    'Biểu đồ phân tích tài chính trực quan',
    'Đặt và theo dõi mục tiêu tiết kiệm',
  ];

  return (
    <div className="flex h-screen" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Left panel */}
      <div
        className="flex flex-col items-center justify-center"
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
      <div className="flex-1 flex items-center justify-center bg-white" style={{ padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
              fontSize: 28,
              color: '#1A2332',
              marginBottom: 8,
            }}
          >
            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
          </h2>
          <p style={{ color: '#8A9AB0', fontSize: 15, marginBottom: 28 }}>
            {isLogin ? 'Đăng nhập để tiếp tục' : 'Bắt đầu hành trình tài chính của bạn'}
          </p>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <button
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-all hover:bg-gray-50"
              style={{ borderColor: '#E8EBF0', fontSize: 14, fontWeight: 500, color: '#1A2332' }}
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
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-all hover:bg-gray-50"
              style={{ borderColor: '#E8EBF0', fontSize: 14, fontWeight: 500, color: '#1A2332' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Tiếp tục với Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8EBF0' }} />
            <span style={{ color: '#8A9AB0', fontSize: 13 }}>hoặc</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E8EBF0' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@email.com"
                className="w-full px-4 py-3 rounded-xl border outline-none transition-all"
                style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
                onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                onBlur={(e) => (e.target.style.borderColor = '#E8EBF0')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-all pr-12"
                  style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
                  onFocus={(e) => (e.target.style.borderColor = '#00C896')}
                  onBlur={(e) => (e.target.style.borderColor = '#E8EBF0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} color="#8A9AB0" /> : <Eye size={18} color="#8A9AB0" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" style={{ color: '#00C896', fontSize: 13, fontWeight: 600 }}>
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl transition-all hover:opacity-90"
              style={{ backgroundColor: '#00C896', color: 'white', fontSize: 15, fontWeight: 600, marginTop: 4 }}
            >
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#8A9AB0', marginTop: 20 }}>
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: '#00C896', fontWeight: 600 }}
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
