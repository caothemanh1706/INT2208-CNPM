import { useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  Wallet, TrendingUp, TrendingDown, Target, Pin, MoreHorizontal, ExternalLink,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

interface LayoutContext {
  openDrawer: () => void;
}

const chartData = [
  { month: 'T1', thu: 12, chi: 8 },
  { month: 'T2', thu: 15, chi: 9 },
  { month: 'T3', thu: 13, chi: 10 },
  { month: 'T4', thu: 14, chi: 7 },
  { month: 'T5', thu: 16, chi: 11 },
  { month: 'T6', thu: 18, chi: 9 },
];

const recentTransactions = [
  { id: 1, icon: '🍜', category: 'Ăn uống', note: 'Bữa trưa văn phòng', date: '02/06/2025', wallet: 'Ví tiền mặt', amount: -85000, type: 'expense' },
  { id: 2, icon: '🚗', category: 'Đi lại', note: 'Grab về nhà', date: '02/06/2025', wallet: 'Ví tiền mặt', amount: -35000, type: 'expense' },
  { id: 3, icon: '💼', category: 'Thu nhập', note: 'Lương tháng 6', date: '01/06/2025', wallet: 'TPBank', amount: 15000000, type: 'income' },
  { id: 4, icon: '🎬', category: 'Giải trí', note: 'Netflix Premium', date: '01/06/2025', wallet: 'Thẻ Visa', amount: -150000, type: 'expense' },
  { id: 5, icon: '🛍️', category: 'Mua sắm', note: 'Lazada - Đồ gia dụng', date: '31/05/2025', wallet: 'Thẻ Visa', amount: -250000, type: 'expense' },
];

const notes = [
  { id: 1, text: 'Hạn nộp tiền thuê nhà: 5/6' },
  { id: 2, text: 'Mua quà sinh nhật cho An - ~300k' },
  { id: 3, text: 'Kiểm tra lại hóa đơn điện tháng 5' },
];

function formatMoney(amount: number) {
  return Math.abs(amount).toLocaleString('vi-VN') + ' ₫';
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl p-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid #F0F2F5' }}>
        <p style={{ fontWeight: 600, fontSize: 13, color: '#1A2332', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: {p.value}tr ₫
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function Dashboard() {
  const { openDrawer } = useOutletContext<LayoutContext>();
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState(notes);

  const addNote = () => {
    if (newNote.trim()) {
      setNotesList([...notesList, { id: Date.now(), text: newNote.trim() }]);
      setNewNote('');
    }
  };

  const summaryCards = [
    {
      title: 'Tổng số dư',
      value: '45,200,000 ₫',
      sub: 'Cập nhật hôm nay',
      icon: Wallet,
      iconColor: '#00C896',
      iconBg: '#E8FBF5',
      valueColor: '#1A2332',
    },
    {
      title: 'Thu vào tháng này',
      value: '+15,000,000 ₫',
      sub: 'So với tháng trước ↑12%',
      icon: TrendingUp,
      iconColor: '#00C896',
      iconBg: '#E8FBF5',
      valueColor: '#00C896',
    },
    {
      title: 'Chi ra tháng này',
      value: '-8,520,000 ₫',
      sub: 'So với tháng trước ↑5%',
      icon: TrendingDown,
      iconColor: '#FF5C5C',
      iconBg: '#FFE8E8',
      valueColor: '#FF5C5C',
    },
    {
      title: 'Tiết kiệm',
      value: '6,480,000 ₫',
      sub: 'Mục tiêu tổng thể: 43%',
      icon: Target,
      iconColor: '#4B9EFF',
      iconBg: '#E8F1FF',
      valueColor: '#1A2332',
      showProgress: true,
      progress: 43,
    },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Row 1 — Summary Cards */}
      <div className="grid grid-cols-4 gap-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-5"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p style={{ fontSize: 12, color: '#8A9AB0', fontWeight: 500, marginBottom: 4 }}>{card.title}</p>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: card.valueColor,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon size={22} color={card.iconColor} />
                </div>
              </div>
              {card.showProgress && (
                <div className="mb-3">
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F0F2F5' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${card.progress}%`, backgroundColor: '#4B9EFF' }}
                    />
                  </div>
                </div>
              )}
              <p style={{ fontSize: 11, color: '#8A9AB0' }}>{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Chart + Notes */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 0.6fr' }}>
        {/* Bar Chart */}
        <div
          className="bg-white rounded-2xl p-6"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A2332' }}>
              Biểu đồ Thu/Chi 6 tháng
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00C896' }} />
                <span style={{ fontSize: 12, color: '#8A9AB0' }}>Thu vào</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF5C5C' }} />
                <span style={{ fontSize: 12, color: '#8A9AB0' }}>Chi ra</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={4} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8A9AB0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8A9AB0' }} axisLine={false} tickLine={false} unit="tr" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="thu" name="Thu vào" fill="#00C896" radius={[4, 4, 0, 0]} />
              <Bar dataKey="chi" name="Chi ra" fill="#FF5C5C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Notes */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Pin size={16} color="#F59E0B" />
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 15, color: '#92400E' }}>
              Ghi chú
            </h3>
          </div>
          <div className="space-y-3 mb-4">
            {notesList.map((note) => (
              <div key={note.id} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.5 }}>{note.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNote()}
              placeholder="Thêm ghi chú..."
              className="flex-1 px-3 py-2 rounded-lg outline-none text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #FDE68A', fontSize: 13, color: '#1A2332' }}
            />
            <button
              onClick={addNote}
              className="px-3 py-2 rounded-lg"
              style={{ backgroundColor: '#F59E0B', color: 'white', fontSize: 13, fontWeight: 600 }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Row 3 — Recent Transactions */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A2332' }}>
            Chi tiêu gần đây
          </h3>
          <button
            className="flex items-center gap-1.5"
            style={{ color: '#00C896', fontSize: 13, fontWeight: 600 }}
          >
            Xem tất cả <ExternalLink size={14} />
          </button>
        </div>

        {/* Table header */}
        <div
          className="grid gap-4 px-4 py-2 rounded-lg mb-2"
          style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 32px', backgroundColor: '#F8F9FB' }}
        >
          {['Danh mục', 'Ghi chú', 'Nguồn ví', 'Ngày', 'Số tiền', ''].map((h) => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#8A9AB0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: '#F0F2F5' }}>
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="grid gap-4 px-4 py-3.5 items-center rounded-xl transition-colors hover:bg-gray-50"
              style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 32px' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: tx.type === 'income' ? '#E8FBF5' : '#F8F9FB' }}
                >
                  <span style={{ fontSize: 18 }}>{tx.icon}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{tx.category}</span>
              </div>
              <span style={{ fontSize: 13, color: '#8A9AB0' }}>{tx.note}</span>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: '#F0F2F5',
                  color: '#5A6A7A',
                  fontSize: 11,
                  fontWeight: 600,
                  width: 'fit-content',
                }}
              >
                {tx.wallet}
              </span>
              <span style={{ fontSize: 13, color: '#8A9AB0' }}>{tx.date}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: tx.type === 'income' ? '#00C896' : '#FF5C5C',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
              </span>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">
                <MoreHorizontal size={16} color="#8A9AB0" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
