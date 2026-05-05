import { useNavigate } from 'react-router';
import { CheckCircle, TrendingUp, BarChart2, Wallet, Twitter, Facebook, Instagram } from 'lucide-react';

const heroImageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGZpbmFuY2UlMjBkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBtb2Rlcm58ZW58MXx8fHwxNzc3OTcwNzI4fDA&ixlib=rb-4.1.0&q=80&w=1080';

const features = [
  {
    icon: TrendingUp,
    color: '#00C896',
    bg: '#E8FBF5',
    title: 'Ghi chép nhanh',
    desc: 'Thêm giao dịch chỉ trong vài giây với giao diện trực quan, hỗ trợ nhiều danh mục.',
  },
  {
    icon: BarChart2,
    color: '#4B9EFF',
    bg: '#E8F1FF',
    title: 'Thống kê trực quan',
    desc: 'Biểu đồ thu chi rõ ràng theo ngày, tháng, năm giúp bạn hiểu rõ tài chính của mình.',
  },
  {
    icon: Wallet,
    color: '#FF9F43',
    bg: '#FFF3E0',
    title: 'Quản lý nhiều ví',
    desc: 'Theo dõi tiền mặt, tài khoản ngân hàng và thẻ tín dụng trong cùng một nơi.',
  },
];

// Mini dashboard mockup component
function DashboardMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        transform: 'rotate(-3deg)',
        background: '#F8F9FB',
        border: '1px solid #E8EBF0',
        width: '100%',
        maxWidth: 420,
      }}
    >
      {/* Topbar mock */}
      <div className="flex items-center justify-between px-4 py-3 bg-white" style={{ borderBottom: '1px solid #F0F2F5' }}>
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: '#1A2332' }}>
          FinWise
        </span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5C5C' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFD43B' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00C896' }} />
        </div>
      </div>
      {/* Cards row */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {[
          { label: 'Tổng số dư', value: '45,200,000 ₫', color: '#1A2332', bg: 'white' },
          { label: 'Thu vào', value: '+15,000,000 ₫', color: '#00C896', bg: '#E8FBF5' },
          { label: 'Chi ra', value: '-8,500,000 ₫', color: '#FF5C5C', bg: '#FFE8E8' },
          { label: 'Tiết kiệm', value: '68%', color: '#4B9EFF', bg: '#E8F1FF' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-3"
            style={{ background: card.bg, border: '1px solid rgba(0,0,0,0.04)' }}
          >
            <p style={{ fontSize: 10, color: '#8A9AB0', marginBottom: 4 }}>{card.label}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: card.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
      {/* Chart mock */}
      <div className="mx-3 mb-3 rounded-xl p-3 bg-white" style={{ border: '1px solid #F0F2F5' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#1A2332', marginBottom: 8 }}>Thu/Chi 6 tháng</p>
        <div className="flex items-end gap-1.5" style={{ height: 60 }}>
          {[
            { inc: 70, exp: 50 }, { inc: 80, exp: 55 }, { inc: 65, exp: 60 },
            { inc: 85, exp: 45 }, { inc: 90, exp: 65 }, { inc: 100, exp: 55 },
          ].map((bar, i) => (
            <div key={i} className="flex gap-0.5 items-end flex-1">
              <div className="rounded-t flex-1" style={{ height: bar.inc * 0.6, backgroundColor: '#00C896' }} />
              <div className="rounded-t flex-1" style={{ height: bar.exp * 0.6, backgroundColor: '#FF5C5C' }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-1.5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#00C896' }} />
            <span style={{ fontSize: 9, color: '#8A9AB0' }}>Thu vào</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#FF5C5C' }} />
            <span style={{ fontSize: 9, color: '#8A9AB0' }}>Chi ra</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', color: '#1A2332' }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10"
        style={{ height: 64, backgroundColor: 'white', borderBottom: '1px solid #F0F2F5' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#00C896' }}
          >
            <span style={{ color: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 14 }}>F</span>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A2332' }}>FinWise</span>
        </div>

        <div className="flex items-center gap-8">
          <a href="#features" style={{ color: '#5A6A7A', fontSize: 14, fontWeight: 500 }}>Tính năng</a>
          <a href="#pricing" style={{ color: '#5A6A7A', fontSize: 14, fontWeight: 500 }}>Bảng giá</a>
          <button onClick={() => navigate('/login')} style={{ color: '#5A6A7A', fontSize: 14, fontWeight: 500 }}>Đăng nhập</button>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
        >
          Bắt đầu miễn phí
        </button>
      </nav>

      {/* Hero */}
      <section
        className="flex items-center min-h-screen pt-16"
        style={{ background: 'linear-gradient(135deg, #F0FDF8 0%, #ffffff 60%, #F8F9FB 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-10 w-full">
          <div className="flex items-center gap-16" style={{ paddingTop: 80, paddingBottom: 80 }}>
            {/* Left */}
            <div style={{ flex: '0 0 58%' }}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ backgroundColor: '#E8FBF5', border: '1px solid #B8F0E0' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00C896' }} />
                <span style={{ color: '#00A87A', fontSize: 13, fontWeight: 600 }}>Miễn phí · Không cần thẻ tín dụng</span>
              </div>
              <h1
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 800,
                  fontSize: 52,
                  lineHeight: 1.15,
                  color: '#1A2332',
                  marginBottom: 20,
                }}
              >
                Làm chủ tài chính cá nhân —{' '}
                <span style={{ color: '#00C896' }}>dễ hơn bao giờ hết</span>
              </h1>
              <p style={{ fontSize: 16, color: '#5A6A7A', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
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
                  className="px-7 py-3.5 rounded-xl border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: '#1A2332', color: '#1A2332', fontSize: 15, fontWeight: 600 }}
                >
                  Xem demo
                </button>
              </div>

              <div className="flex items-center gap-8 mt-10">
                {[
                  { num: '10,000+', label: 'Người dùng' },
                  { num: '98%', label: 'Hài lòng' },
                  { num: '4.9★', label: 'Đánh giá' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p style={{ fontSize: 22, fontWeight: 700, color: '#1A2332', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {stat.num}
                    </p>
                    <p style={{ fontSize: 13, color: '#8A9AB0' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex-1 flex justify-center">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24" style={{ backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-14">
            <h2
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 36, color: '#1A2332', marginBottom: 12 }}
            >
              Tất cả những gì bạn cần
            </h2>
            <p style={{ fontSize: 16, color: '#5A6A7A', maxWidth: 480, margin: '0 auto' }}>
              Bộ công cụ tài chính cá nhân toàn diện, thiết kế đơn giản cho mọi người.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-8 rounded-2xl transition-all hover:-translate-y-1"
                  style={{ border: '1px solid #F0F2F5', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: f.bg }}
                  >
                    <Icon size={28} color={f.color} />
                  </div>
                  <h3
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A2332', marginBottom: 8 }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20" style={{ backgroundColor: '#00C896' }}>
        <div className="text-center">
          <h2
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 36, color: 'white', marginBottom: 12 }}
          >
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
      <footer className="py-12" style={{ backgroundColor: '#1A2332' }}>
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
                Ứng dụng quản lý tài chính cá nhân thông minh, giúp bạn tự do tài chính.
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
                  <div
                    key={i}
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  >
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
