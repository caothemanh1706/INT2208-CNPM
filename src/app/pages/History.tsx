import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

type FilterType = 'all' | 'expense' | 'income';

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

function groupByDate(transactions: any[], lang: string) {
  const groups: Record<string, any[]> = {};
  transactions.forEach((tx) => {
    const d = new Date(tx.date);
    let dateKey = '';
    if (lang === 'en') {
      dateKey = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' });
    } else if (lang === 'zh') {
      dateKey = d.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
    } else {
      dateKey = d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(tx);
  });
  return Object.entries(groups).map(([date, items]) => ({
    date,
    items,
    dailyTotal: items.reduce((sum, tx) => {
      if (tx.type === 'income') return sum + tx.amount;
      if (tx.type === 'expense') return sum - tx.amount;
      return sum;
    }, 0),
  }));
}

export function History() {
  const { c, isDark } = useTheme();
  const { formatCurrency, formatDate, t, language } = useLanguage();
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editTx, setEditTx] = useState<any | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      const txs = await api.getTransactions();
      setAllTransactions(txs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  useEffect(() => {
    const handleClose = () => setOpenMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const handleDelete = async (id: number) => {
    const confirmMsg = language === 'en' 
      ? 'Are you sure you want to delete this transaction?' 
      : language === 'zh'
      ? '您确定要删除此笔交易记录吗？'
      : 'Xóa giao dịch này?';
    if (!confirm(confirmMsg)) return;
    try {
      await api.deleteTransaction(id);
      setAllTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (e) { console.error(e); }
    setOpenMenu(null);
  };

  const formatInputCurrency = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return '';
    return Number(clean).toLocaleString('vi-VN');
  };

  const openEdit = (tx: any) => {
    setEditTx(tx);
    setEditNote(tx.note || tx.description || '');
    setEditAmount(Number(tx.amount).toLocaleString('vi-VN'));
    setOpenMenu(null);
  };

  const handleEditSave = async () => {
    if (!editTx) return;
    setEditSaving(true);
    try {
      const cleanAmount = editAmount.replace(/\D/g, '');
      const numAmount = parseFloat(cleanAmount) || editTx.amount;
      const updated = await api.updateTransaction(editTx.id, {
        type: editTx.type,
        amount: numAmount,
        note: editNote,
        description: editNote,
        category: editTx.category,
        account: editTx.account,
      });
      setAllTransactions((prev) => prev.map((tx) => tx.id === updated.id ? updated : tx));
      setEditTx(null);
    } catch (e) { console.error(e); }
    finally { setEditSaving(false); }
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: language === 'en' ? 'All' : language === 'zh' ? '全部' : 'Tất cả' },
    { id: 'expense', label: language === 'en' ? 'Expense' : language === 'zh' ? '支出' : 'Chi tiền' },
    { id: 'income', label: language === 'en' ? 'Income' : language === 'zh' ? '收入' : 'Thu tiền' },
  ];

  const filtered = allTransactions.filter((tx) => {
    const matchSearch =
      (tx.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.note || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.description || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || tx.type === filter;
    return matchSearch && matchFilter;
  });

  const filteredGroups = groupByDate(filtered, language);

  return (
    <div className="space-y-5 transition-colors duration-300" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors duration-300"
          style={{ border: `1px solid ${c.inputBorder}`, backgroundColor: c.card, width: 320 }}
        >
          <Search size={16} color={c.textMuted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'en' ? 'Search transactions...' : language === 'zh' ? '搜索交易记录...' : 'Tìm kiếm theo ghi chú...'}
            className="flex-1 outline-none bg-transparent"
            style={{ fontSize: 13, color: c.text }}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-xl transition-colors duration-300" style={{ backgroundColor: c.card, border: `1px solid ${c.inputBorder}` }}>
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-4 py-1.5 rounded-lg transition-all cursor-pointer"
                style={{
                  backgroundColor: filter === f.id ? '#00C896' : 'transparent',
                  color: filter === f.id ? 'white' : c.textSub,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors duration-300"
            style={{ borderColor: c.inputBorder, fontSize: 13, color: c.textSub, backgroundColor: c.card }}
          >
            {language === 'en' ? 'Select date range' : language === 'zh' ? '选择交易时间' : 'Chọn khoảng thời gian'}
          </button>
        </div>
      </div>

      {/* Timeline groups */}
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-20">
            <p style={{ fontSize: 15, color: c.textMuted }}>{t('loading')}</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20">
            <span style={{ fontSize: 48 }}>🔍</span>
            <p style={{ fontSize: 15, color: c.textMuted, marginTop: 12 }}>
              {language === 'en' ? 'No transactions found' : language === 'zh' ? '未找到相关交易明细' : 'Không tìm thấy giao dịch nào'}
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <p style={{ fontSize: 12, fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {group.date}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: group.dailyTotal >= 0 ? '#00C896' : '#FF5C5C',
                  }}
                >
                  {group.dailyTotal >= 0 ? '+' : '-'}{formatCurrency(Math.abs(group.dailyTotal))}
                </p>
              </div>

               {/* Transaction cards */}
              <div
                className="rounded-2xl divide-y transition-colors duration-300"
                style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}`, borderColor: c.divider }}
              >
                {group.items.map((tx, idx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 px-5 py-4 transition-colors relative cursor-pointer"
                    style={{
                      backgroundColor: 'transparent',
                      borderTopLeftRadius: idx === 0 ? '16px' : '0px',
                      borderTopRightRadius: idx === 0 ? '16px' : '0px',
                      borderBottomLeftRadius: idx === group.items.length - 1 ? '16px' : '0px',
                      borderBottomRightRadius: idx === group.items.length - 1 ? '16px' : '0px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tx.type === 'income' ? c.greenBg : c.tag }}
                    >
                      <span style={{ fontSize: 20 }}>{getCategoryIcon(tx.category || '')}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>
                          {t(tx.category || tx.type || 'other')}
                        </p>
                        {tx.receiptUrl && (
                          <button
                            onClick={() => setViewingReceipt(tx.receiptUrl)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold cursor-pointer border transition-colors duration-300"
                            style={{ backgroundColor: c.greenBg, color: c.green, borderColor: 'transparent' }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.green)}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                          >
                            🖼️ {language === 'en' ? 'Receipt' : language === 'zh' ? '凭证' : 'Hóa đơn'}
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: c.textMuted, marginTop: 1 }}>{tx.note || tx.description || '—'}</p>
                    </div>

                    {/* Wallet badge */}
                    <span
                      className="px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.pillBg, color: c.textSub, fontSize: 11, fontWeight: 600 }}
                    >
                      {tx.account || '—'}
                    </span>

                    {/* Amount */}
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: tx.type === 'income' ? '#00C896' : '#FF5C5C',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        minWidth: 130,
                        textAlign: 'right',
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>

                    {/* Options */}
                    <div className="relative">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
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
                          style={{ width: 140, backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}
                        >
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors cursor-pointer"
                            onClick={() => openEdit(tx)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Edit2 size={14} color={c.textSub} />
                            <span style={{ fontSize: 13, color: c.text }}>
                              {language === 'en' ? 'Edit' : language === 'zh' ? '编辑' : 'Chỉnh sửa'}
                            </span>
                          </button>
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors cursor-pointer"
                            onClick={() => handleDelete(tx.id)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.redBg)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Trash2 size={14} color="#FF5C5C" />
                            <span style={{ fontSize: 13, color: '#FF5C5C' }}>
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
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(10,18,28,0.65)' }}>
          <div className="rounded-2xl p-6" style={{ width: 400, backgroundColor: c.card, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: c.text }}>
                {language === 'en' ? 'Edit Transaction' : language === 'zh' ? '编辑交易明细' : 'Chỉnh sửa giao dịch'}
              </h3>
              <button onClick={() => setEditTx(null)} className="cursor-pointer">
                <X size={20} color={c.textMuted} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
                  {language === 'en' ? 'Amount' : language === 'zh' ? '金额' : 'Số tiền'}
                </label>
                <input
                  type="text"
                  value={editAmount}
                  onChange={(e) => setEditAmount(formatInputCurrency(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
                  {t('description')}
                </label>
                <input
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="..."
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditTx(null)}
                  className="flex-1 py-3 rounded-xl border transition-colors duration-300 cursor-pointer"
                  style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600 }}
                >
                  {language === 'en' ? 'Cancel' : language === 'zh' ? '取消' : 'Hủy'}
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editSaving}
                  className="flex-1 py-3 rounded-xl cursor-pointer"
                  style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600, opacity: editSaving ? 0.7 : 1 }}
                >
                  {editSaving ? t('loading') : (language === 'en' ? 'Save' : language === 'zh' ? '保存' : 'Lưu')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Image Overlay Modal */}
      {viewingReceipt && (
        <>
          <div
            className="fixed inset-0 z-50 transition-colors duration-300"
            style={{ backgroundColor: 'rgba(10,18,28,0.75)' }}
            onClick={() => setViewingReceipt(null)}
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl pointer-events-auto p-2"
              style={{ backgroundColor: c.card, border: `1px solid ${c.cardBorder}` }}
            >
              <img src={viewingReceipt} alt="Receipt Full" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
              <div className="flex justify-between items-center px-2 py-2 mt-2">
                <span style={{ fontSize: 13, color: c.textMuted }}>
                  {language === 'en' ? 'Transaction Receipt Attachment' : language === 'zh' ? '交易记账图片凭证附件' : 'Ảnh hóa đơn chứng từ giao dịch'}
                </span>
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="px-4 py-1.5 rounded-lg font-semibold text-xs cursor-pointer text-white"
                  style={{ backgroundColor: c.green }}
                >
                  {language === 'en' ? 'Close' : language === 'zh' ? '关闭' : 'Đóng'}
                </button>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                style={{ fontSize: 14, fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
