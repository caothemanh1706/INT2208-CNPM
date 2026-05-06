import { useNavigate } from 'react-router';
import { CheckCircle, TrendingUp, BarChart2, Wallet, Twitter, Facebook, Instagram, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const features = [
  { icon: TrendingUp, color: '#00C896', bg: null, title: 'Ghi chép nhanh', desc: 'Thêm giao dịch chỉ trong vài giây với giao diện trực quan, hỗ trợ nhiều danh mục.' },
  { icon: BarChart2, color: '#4B9EFF', bg: null, title: 'Thống kê trực quan', desc: 'Biểu đồ thu chi rõ ràng theo ngày, tháng, năm giúp bạn hiểu rõ tài chính của mình.' },
  { icon: Wallet, color: '#FF9F43', bg: null, title: 'Quản lý nhiều ví', desc: 'Theo dõi tiền mặt, tài khoản ngân hàng và thẻ tín dụng trong cùng một nơi.' },
];

function DashboardMockup({ c, isDark }: { c: any; isDark: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300"
      style={{
        transform: 'rotate(-3deg)',
        background: c.bg,
        border: `1px solid ${c.cardBorder}`,
        width: '100%', maxWidth: 420,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: c.card, borderBottom: `1px solid ${c.divider}` }}>
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: c.text }}>FinWise</span>
        <div className="flex gap-1.5">
          {['#FF5C5C', '#FFD43B', '#00C896'].map(bg => (
            <div key={bg} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bg }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {[
          { label: 'Tổng số dư', value: '45,200,000 ₫', color: c.text, bg: c.card },
          { label: 'Thu vào', value: '+15,000,000 ₫', color: '#00C896', bg: isDark ? 'rgba(0,200,150,0.12)' : '#E8FBF5' },
          { label: 'Chi ra', value: '-8,500,000 ₫', color: '#FF5C5C', bg: isDark ? 'rgba(255,92,92,0.12)' : '#FFE8E8' },
          { label: 'Tiết kiệm', value: '68%', color: '#4B9EFF', bg: isDark ? 'rgba(75,158,255,0.12)' : '#E8F1FF' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-3" style={{ backgroundColor: card.bg, border: `1px solid ${c.cardBorder}` }}>
            <p style={{ fontSize: 10, color: c.textMuted, marginBottom: 4 }}>{card.label}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: card.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mx-3 mb-3 rounded-xl p-3" style={{ backgroundColor: c.card, border: `1px solid ${c.cardBorder}` }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: c.text, marginBottom: 8 }}>Thu/Chi 6 tháng</p>
        <div className="flex items-end gap-1.5" style={{ height: 60 }}>
          {[{ inc: 70, exp: 50 }, { inc: 80, exp: 55 }, { inc: 65, exp: 60 }, { inc: 85, exp: 45 }, { inc: 90, exp: 65 }, { inc: 100, exp: 55 }].map((bar, i) => (
            <div key={i} className="flex gap-0.5 items-end flex-1">
              <div className="rounded-t flex-1" style={{ height: bar.inc * 0.6, backgroundColor: '#00C896' }} />
              <div className="rounded-t flex-1" style={{ height: bar.exp * 0.6, backgroundColor: '#FF5C5C' }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-1.5">
          {[{ color: '#00C896', label: 'Thu vào' }, { color: '#FF5C5C', label: 'Chi ra' }].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded" style={{ backgroundColor: l.color }} />
              <span style={{ fontSize: 9, color: c.textMuted }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const { c, isDark, toggle } = useTheme();

  const heroBg = isDark
    ? 'linear-gradient(135deg, #0C1E14 0%, #0F1923 60%, #0F1923 100%)'
    : 'linear-gradient(135deg, #F0FDF8 0%, #ffffff 60%, #F8F9FB 100%)';

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', color: c.text, backgroundColor: c.bg }} className="transition-colors duration-300">
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 transition-colors duration-300"
        style={{
          height: 64,
          backgroundColor: isDark ? c.topbar : 'white',
          borderBottom: `1px solid ${c.topbarBorder}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00C896' }}>
            <span style={{ color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 14 }}>F</span>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: c.text }}>FinWise</span>
        </div>

        <div className="flex items-center gap-8">
          {['Tính năng', 'Bảng giá'].map(link => (
            <a key={link} href="#" style={{ color: c.textSub, fontSize: 14, fontWeight: 500 }}>{link}</a>
          ))}
          <button onClick={() => navigate('/login')} style={{ color: c.textSub, fontSize: 14, fontWeight: 500 }}>Đăng nhập</button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ backgroundColor: isDark ? '#243040' : '#F0F2F5' }}
          >
            {isDark ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} color="#5A6A7A" />}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
            style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
          >
            Bắt đầu miễn phí
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="flex items-center min-h-screen pt-16 transition-colors duration-300"
        style={{ background: heroBg }}
      >
        <div className="max-w-7xl mx-auto px-10 w-full">
          <div className="flex items-center gap-16" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ flex: '0 0 58%' }}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ backgroundColor: isDark ? 'rgba(0,200,150,0.12)' : '#E8FBF5', border: `1px solid ${isDark ? 'rgba(0,200,150,0.25)' : '#B8F0E0'}` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00C896' }} />
                <span style={{ color: '#00C896', fontSize: 13, fontWeight: 600 }}>Miễn phí · Không cần thẻ tín dụng</span>
              </div>
              <h1
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 52,
                  lineHeight: 1.15, color: c.text, marginBottom: 20,
                }}
              >
                Làm chủ tài chính cá nhân —{' '}
                <span style={{ color: '#00C896' }}>dễ hơn bao giờ hết</span>
              </h1>
              <p style={{ fontSize: 16, color: c.textSub, lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                FinWise giúp bạn theo dõi thu chi, phân tích tài chính và đạt mục tiêu tiết kiệm một cách thông minh và trực quan.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-7 py-3.5 rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ backgroundColor: '#00C896', color: 'white', fontSize: 15, fontWeight: 600 }}
                >
                  Bắt đầu ngay
                </button>
                <button
                  onClick={() => navigate('/app')}
                  className="px-7 py-3.5 rounded-xl border-2 transition-all"
                  style={{ borderColor: c.text, color: c.text, fontSize: 15, fontWeight: 600 }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Xem demo
                </button>
              </div>

              <div className="flex items-center gap-8 mt-10">
                {[{ num: '10,000+', label: 'Người dùng' }, { num: '98%', label: 'Hài lòng' }, { num: '4.9★', label: 'Đánh giá' }].map((stat) => (
                  <div key={stat.label}>
                    <p style={{ fontSize: 22, fontWeight: 700, color: c.text, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat.num}</p>
                    <p style={{ fontSize: 13, color: c.textMuted }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <DashboardMockup c={c} isDark={isDark} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 transition-colors duration-300" style={{ backgroundColor: c.card }}>
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 36, color: c.text, marginBottom: 12 }}>
              Tất cả những gì bạn cần
            </h2>
            <p style={{ fontSize: 16, color: c.textSub, maxWidth: 480, margin: '0 auto' }}>
              Bộ công cụ tài chính cá nhân toàn diện, thiết kế đơn giản cho mọi người.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              const iconBg = f.color === '#00C896' ? (isDark ? 'rgba(0,200,150,0.12)' : '#E8FBF5')
                : f.color === '#4B9EFF' ? (isDark ? 'rgba(75,158,255,0.12)' : '#E8F1FF')
                : (isDark ? 'rgba(255,159,67,0.12)' : '#FFF3E0');
              return (
                <div
                  key={f.title}
                  className="p-8 rounded-2xl transition-all hover:-translate-y-1"
                  style={{ border: `1px solid ${c.cardBorder}`, backgroundColor: c.bg, boxShadow: c.cardShadow }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: iconBg }}>
                    <Icon size={28} color={f.color} />
                  </div>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: c.text, marginBottom: 8 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: c.textSub, lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20" style={{ backgroundColor: '#00C896' }}>
        <div className="text-center">
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 36, color: 'white', marginBottom: 12 }}>
            Bắt đầu quản lý chi tiêu hôm nay
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>
            Tham gia cùng hàng nghìn người đang làm chủ tài chính của mình.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-xl transition-all hover:opacity-90"
            style={{ backgroundColor: 'white', color: '#00C896', fontSize: 15, fontWeight: 700 }}
          >
            Tạo tài khoản miễn phí
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 transition-colors duration-300" style={{ backgroundColor: isDark ? '#060D14' : '#1A2332' }}>
        <div className="max-w-6xl mx-auto px-10">
          <div className="grid grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00C896' }}>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>F</span>
                </div>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 18, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>FinWise</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7 }}>
                Ứng dụng quản lý tài chính cá nhân thông minh.
              </p>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Liên kết</p>
              {['Tính năng', 'Bảng giá', 'Blog', 'Hỗ trợ'].map((link) => (
                <p key={link} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 10 }}>
                  <a href="#" style={{ color: 'inherit' }}>{link}</a>
                </p>
              ))}
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Mạng xã hội</p>
              <div className="flex gap-3">
                {[Twitter, Facebook, Instagram].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <Icon size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>
              © 2025 FinWise. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
