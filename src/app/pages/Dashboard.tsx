import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import {
  Wallet, TrendingUp, TrendingDown, Target, Pin, MoreHorizontal, ExternalLink, X, Trash2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { api } from '../../lib/api';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../../lib/notifications';

interface LayoutContext {
  openDrawer: () => void;
  refreshKey: number;
}

function getCategoryIcon(category: string) {
  const map: Record<string, string> = {
    'Ăn uống': '🍜', 'Di chuyển': '🚗', 'Mua sắm': '🛍️', 'Sức khỏe': '💊',
    'Giải trí': '🎬', 'Giáo dục': '📚', 'Nhà ở': '🏠', 'Hóa đơn': '🧾',
    'Du lịch': '✈️', 'Lương': '💼', 'Thưởng': '🎁', 'Đầu tư': '📈',
    'Freelance': '💻', 'Thu nhập khác': '💰', 'Khác': '➕',
    'Food': '🍜', 'Transport': '🚗', 'Shopping': '🛍️', 'Health': '💊',
    'Entertainment': '🎬', 'Education': '📚', 'Housing': '🏠', 'Bills': '🧾',
    'Travel': '✈️', 'Salary': '💼', 'Bonus': '🎁', 'Investment': '📈',
    'Other Income': '💰', 'Other': '➕',
  };
  return map[category] || '💳';
}

export function Dashboard() {
  const { c, isDark } = useTheme();
  const { formatCurrency, formatDate, t, language } = useLanguage();
  const { openDrawer, refreshKey } = useOutletContext<LayoutContext>();
  const navigate = useNavigate();

  const MONTH_LABELS = language === 'en' 
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : language === 'zh'
    ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    : ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl p-3" style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: c.text, marginBottom: 6 }}>{label}</p>
          {payload.map((p: any) => {
            const translatedName = p.name === 'Thu vào' || p.name === 'Thu nhập' ? t('income') : p.name === 'Chi ra' || p.name === 'Chi tiêu' ? t('expense') : p.name;
            return (
              <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
                {translatedName}: {formatCurrency(p.value)}
              </p>
            );
          })}
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
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this transaction?' : language === 'zh' ? '您确定要删除此交易吗？' : 'Bạn có chắc chắn muốn xóa giao dịch này?')) return;
    try {
      await api.deleteTransaction(id);
      loadData();
      window.dispatchEvent(new Event('transaction-saved'));
      notificationService.add(language === 'en' ? 'Transaction deleted' : language === 'zh' ? '交易已删除' : 'Giao dịch: Đã xóa giao dịch thành công!');
    } catch (e) {
      console.error('Failed to delete transaction', e);
    }
  };

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

  useEffect(() => { loadData(); }, [refreshKey, language]);

  useEffect(() => {
    const handleClose = () => setOpenMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const note = await api.createNote(newNote.trim());
      setNotes([...notes, note]);
      setNewNote('');
    } catch (e) { console.error(e); }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (e) {
      console.error('Failed to delete note', e);
    }
  };

  const summaryCards = [
    {
      title: t('total_assets'),
      value: overview ? formatCurrency(overview.balance) : '—',
      sub: `${language === 'en' ? 'vs last month' : language === 'zh' ? '环比上月' : 'So với tháng trước'} ${overview?.balanceChange >= 0 ? '↑' : '↓'}${Math.abs(overview?.balanceChange || 0)}%`,
      icon: Wallet,
      iconColor: c.green,
      iconBg: c.greenBg,
      valueColor: c.text,
    },
    {
      title: `${t('income')} ${language === 'en' ? 'this month' : language === 'zh' ? '本月' : 'tháng này'}`,
      value: overview ? '+' + formatCurrency(overview.income) : '—',
      sub: `${language === 'en' ? 'vs last month' : language === 'zh' ? '环比上月' : 'So với tháng trước'} ${overview?.incomeChange >= 0 ? '↑' : '↓'}${Math.abs(overview?.incomeChange || 0)}%`,
      icon: TrendingUp,
      iconColor: c.green,
      iconBg: c.greenBg,
      valueColor: c.green,
    },
    {
      title: `${t('expense')} ${language === 'en' ? 'this month' : language === 'zh' ? '本月' : 'tháng này'}`,
      value: overview ? '-' + formatCurrency(overview.expense) : '—',
      sub: `${language === 'en' ? 'vs last month' : language === 'zh' ? '环比上月' : 'So với tháng trước'} ${overview?.expenseChange >= 0 ? '↑' : '↓'}${Math.abs(overview?.expenseChange || 0)}%`,
      icon: TrendingDown,
      iconColor: c.red,
      iconBg: c.redBg,
      valueColor: c.red,
    },
    {
      title: `${language === 'en' ? 'Savings this month' : language === 'zh' ? '本月储蓄额' : 'Tiết kiệm tháng này'}`,
      value: overview ? formatCurrency(Math.max(0, overview.income - overview.expense)) : '—',
      sub: language === 'en' ? 'Income minus expense' : language === 'zh' ? '收支相抵后净储蓄' : 'Thu nhập trừ chi tiêu',
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
              {language === 'en' ? `Cash Flow Chart — Year ${new Date().getFullYear()}` : language === 'zh' ? `${new Date().getFullYear()}年度收支分析图表` : `Biểu đồ Thu/Chi ${new Date().getFullYear()}`}
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00C896' }} />
                <span style={{ fontSize: 12, color: c.textMuted }}>{t('income')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF5C5C' }} />
                <span style={{ fontSize: 12, color: c.textMuted }}>{t('expense')}</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData} barGap={4} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#243040' : '#F0F2F5'} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: c.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: c.textMuted }} axisLine={false} tickLine={false} tickFormatter={(v) => {
                if (language === 'en') return `$${(v/25000).toFixed(0)}`;
                if (language === 'zh') return `¥${(v/3500).toFixed(0)}`;
                return `${(v/1e6).toFixed(0)}tr`;
              }} />
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
              {language === 'en' ? 'Sticky Notes' : language === 'zh' ? '备忘录' : 'Ghi chú'}
            </h3>
          </div>
          <div className="space-y-3 mb-4" style={{ maxHeight: 160, overflowY: 'auto' }}>
            {notes.length === 0 && (
              <p style={{ fontSize: 12, color: isDark ? '#FBBF24' : '#A16207' }}>
                {language === 'en' ? 'No notes yet' : language === 'zh' ? '暂无备忘录' : 'Chưa có ghi chú nào'}
              </p>
            )}
            {notes.map((note) => (
              <div key={note.id} className="flex items-start justify-between gap-2.5 group">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                  <p style={{ fontSize: 13, color: isDark ? '#FDE68A' : '#78350F', lineHeight: 1.5 }}>{note.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={{ 
                    color: isDark ? '#FF8A8A' : '#9F1239',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 92, 92, 0.15)' : 'rgba(159, 18, 57, 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title={language === 'en' ? 'Delete note' : language === 'zh' ? '删除备忘' : 'Xóa ghi chú'}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNote()}
              placeholder={language === 'en' ? 'Add a note...' : language === 'zh' ? '添加一条备忘...' : 'Thêm ghi chú...'}
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
            {t('recent_transactions')}
          </h3>
          <button
            onClick={() => navigate('/app/history')}
            className="flex items-center gap-1.5"
            style={{ color: '#00C896', fontSize: 13, fontWeight: 600 }}
          >
            {language === 'en' ? 'View all' : language === 'zh' ? '查看全部' : 'Xem tất cả'} <ExternalLink size={14} />
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: 14, color: c.textMuted, textAlign: 'center', padding: '20px 0' }}>{t('loading')}</p>
        ) : transactions.length === 0 ? (
          <p style={{ fontSize: 14, color: c.textMuted, textAlign: 'center', padding: '20px 0' }}>{t('no_transactions')}</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <div className="min-w-[680px]">
              {/* Table header */}
              <div
                className="grid gap-4 px-4 py-2 rounded-lg mb-2 transition-colors duration-300"
                style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1.2fr 1.5fr 32px', backgroundColor: c.input }}
              >
                {[t('category'), t('description'), t('wallet'), t('date'), t('amount'), ''].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                    style={{ gridTemplateColumns: '2fr 2fr 1.5fr 1.2fr 1.5fr 32px', backgroundColor: 'transparent' }}
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
                      <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>
                        {t(tx.category || tx.type || 'other')}
                      </span>
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
                      {formatDate(tx.date)}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: tx.type === 'income' ? '#00C896' : '#FF5C5C',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    {/* Options */}
                    <div className="relative">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === tx.id ? null : tx.id);
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <MoreHorizontal size={16} color={c.textMuted} />
                      </button>
                      {openMenu === tx.id && (
                        <div
                          className="absolute right-0 top-10 rounded-xl z-10 overflow-hidden"
                          style={{ width: 120, backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2.5 transition-colors cursor-pointer"
                            onClick={() => {
                              handleDeleteTransaction(tx.id);
                              setOpenMenu(null);
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.redBg)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Trash2 size={14} color={c.red} />
                            <span style={{ fontSize: 13, color: c.red, fontWeight: 600 }}>
                              {language === 'en' ? 'Delete' : language === 'zh' ? '删除' : 'Xóa'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
