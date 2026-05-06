import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import {
  Wallet, TrendingUp, TrendingDown, Target, Pin, MoreHorizontal, ExternalLink,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { api } from '../../lib/api';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutContext {
  openDrawer: () => void;
  refreshKey: number;
}

const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

function formatMoney(amount: number) {
  return Math.abs(amount).toLocaleString('vi-VN') + ' ₫';
}

function getCategoryIcon(category: string) {
  const map: Record<string, string> = {
    'Ăn uống': '🍜', 'Di chuyển': '🚗', 'Mua sắm': '🛍️', 'Sức khỏe': '💊',
    'Giải trí': '🎬', 'Giáo dục': '📚', 'Nhà ở': '🏠', 'Hóa đơn': '🧾',
    'Du lịch': '✈️', 'Lương': '💼', 'Thưởng': '🎁', 'Đầu tư': '📈',
    'Freelance': '💻', 'Thu nhập khác': '💰', 'Khác': '➕',
  };
  return map[category] || '💳';
}

export function Dashboard() {
  const { c, isDark } = useTheme();
  const { openDrawer, refreshKey } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl p-3" style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: c.text, marginBottom: 6 }}>{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
              {p.name}: {(p.value / 1_000_000).toFixed(1)}tr ₫
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const [overview, setOverview] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [ov, trend, txs, nts] = await Promise.all([
        api.getStatisticsOverview(),
        api.getTrendData(),
        api.getTransactions(),
        api.getNotes(),
      ]);
      setOverview(ov);
      setTrendData(trend.map((d: any, i: number) => ({
        month: MONTH_LABELS[i] || d.month,
        thu: d.income,
        chi: d.expense,
      })));
      setTransactions(txs.slice(0, 5));
      setNotes(nts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [refreshKey]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const note = await api.createNote(newNote.trim());
      setNotes([...notes, note]);
      setNewNote('');
    } catch (e) { console.error(e); }
  };

  const summaryCards = [
    {
      title: 'Tổng số dư',
      value: overview ? formatMoney(overview.balance) : '—',
      sub: `So với tháng trước ${overview?.balanceChange >= 0 ? '↑' : '↓'}${Math.abs(overview?.balanceChange || 0)}%`,
      icon: Wallet,
      iconColor: c.green,
      iconBg: c.greenBg,
      valueColor: c.text,
    },
    {
      title: 'Thu vào tháng này',
      value: overview ? '+' + formatMoney(overview.income) : '—',
      sub: `So với tháng trước ${overview?.incomeChange >= 0 ? '↑' : '↓'}${Math.abs(overview?.incomeChange || 0)}%`,
      icon: TrendingUp,
      iconColor: c.green,
      iconBg: c.greenBg,
      valueColor: c.green,
    },
    {
      title: 'Chi ra tháng này',
      value: overview ? '-' + formatMoney(overview.expense) : '—',
      sub: `So với tháng trước ${overview?.expenseChange >= 0 ? '↑' : '↓'}${Math.abs(overview?.expenseChange || 0)}%`,
      icon: TrendingDown,
      iconColor: c.red,
      iconBg: c.redBg,
      valueColor: c.red,
    },
    {
      title: 'Tiết kiệm tháng này',
      value: overview ? formatMoney(Math.max(0, overview.income - overview.expense)) : '—',
      sub: 'Thu nhập trừ chi tiêu',
      icon: Target,
      iconColor: c.blue,
      iconBg: c.blueBg,
      valueColor: c.text,
    },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Row 1 — Summary Cards */}
      <div className="grid grid-cols-4 gap-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-2xl p-5 transition-colors duration-300"
              style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p style={{ fontSize: 12, color: c.textMuted, fontWeight: 500, marginBottom: 4 }}>{card.title}</p>
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
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon size={22} color={card.iconColor} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: c.textMuted }}>{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Chart + Notes */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 0.6fr' }}>
        {/* Bar Chart */}
        <div
          className="rounded-2xl p-6 transition-colors duration-300"
          style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: c.text }}>
              Biểu đồ Thu/Chi {new Date().getFullYear()}
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00C896' }} />
                <span style={{ fontSize: 12, color: c.textMuted }}>Thu vào</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF5C5C' }} />
                <span style={{ fontSize: 12, color: c.textMuted }}>Chi ra</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData} barGap={4} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#243040' : '#F0F2F5'} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: c.textMuted }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1e6).toFixed(0)}tr`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="thu" name="Thu vào" fill="#00C896" radius={[4, 4, 0, 0]} />
              <Bar dataKey="chi" name="Chi ra" fill="#FF5C5C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Notes */}
        <div
          className="rounded-2xl p-5 transition-colors duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB',
            border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#FDE68A'}`,
            boxShadow: c.cardShadow,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Pin size={16} color="#F59E0B" />
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 15, color: isDark ? '#FCD34D' : '#92400E' }}>
              Ghi chú
            </h3>
          </div>
          <div className="space-y-3 mb-4" style={{ maxHeight: 160, overflowY: 'auto' }}>
            {notes.length === 0 && (
              <p style={{ fontSize: 12, color: isDark ? '#FBBF24' : '#A16207' }}>Chưa có ghi chú nào</p>
            )}
            {notes.map((note) => (
              <div key={note.id} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                <p style={{ fontSize: 13, color: isDark ? '#FDE68A' : '#78350F', lineHeight: 1.5 }}>{note.content}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNote()}
              placeholder="Thêm ghi chú..."
              className="flex-1 px-3 py-2 rounded-lg outline-none text-sm transition-colors duration-300"
              style={{ backgroundColor: c.input, border: `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#FDE68A'}`, fontSize: 13, color: c.text }}
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
        className="rounded-2xl p-6 transition-colors duration-300"
        style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: c.text }}>
            Chi tiêu gần đây
          </h3>
          <button
            onClick={() => navigate('/app/history')}
            className="flex items-center gap-1.5"
            style={{ color: '#00C896', fontSize: 13, fontWeight: 600 }}
          >
            Xem tất cả <ExternalLink size={14} />
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: 14, color: c.textMuted, textAlign: 'center', padding: '20px 0' }}>Đang tải...</p>
        ) : transactions.length === 0 ? (
          <p style={{ fontSize: 14, color: c.textMuted, textAlign: 'center', padding: '20px 0' }}>Chưa có giao dịch nào</p>
        ) : (
          <>
            {/* Table header */}
            <div
              className="grid gap-4 px-4 py-2 rounded-lg mb-2 transition-colors duration-300"
              style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 32px', backgroundColor: c.input }}
            >
              {['Danh mục', 'Ghi chú', 'Nguồn ví', 'Ngày', 'Số tiền', ''].map((h) => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y" style={{ borderColor: c.divider }}>
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid gap-4 px-4 py-3.5 items-center rounded-xl transition-colors cursor-pointer"
                  style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 32px', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tx.type === 'income' ? c.greenBg : c.tag }}
                    >
                      <span style={{ fontSize: 18 }}>{getCategoryIcon(tx.category || '')}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{tx.category || tx.type}</span>
                  </div>
                  <span style={{ fontSize: 13, color: c.textMuted }}>{tx.description || tx.note || '—'}</span>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: c.pillBg,
                      color: c.textSub,
                      fontSize: 11,
                      fontWeight: 600,
                      width: 'fit-content',
                    }}
                  >
                    {tx.account || '—'}
                  </span>
                  <span style={{ fontSize: 13, color: c.textMuted }}>
                    {new Date(tx.date).toLocaleDateString('vi-VN')}
                  </span>
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
                  <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <MoreHorizontal size={16} color={c.textMuted} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
