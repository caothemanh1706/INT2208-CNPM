import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useTheme } from '../contexts/ThemeContext';

type FilterType = 'all' | 'expense' | 'income';

function getCategoryIcon(category: string) {
  const map: Record<string, string> = {
    'Ăn uống': '🍜', 'Di chuyển': '🚗', 'Mua sắm': '🛍️', 'Sức khỏe': '💊',
    'Giải trí': '🎬', 'Giáo dục': '📚', 'Nhà ở': '🏠', 'Hóa đơn': '🧾',
    'Du lịch': '✈️', 'Lương': '💼', 'Thưởng': '🎁', 'Đầu tư': '📈',
    'Freelance': '💻', 'Thu nhập khác': '💰', 'Khác': '➕',
  };
  return map[category] || '💳';
}

function groupByDate(transactions: any[]) {
  const groups: Record<string, any[]> = {};
  transactions.forEach((tx) => {
    const dateKey = new Date(tx.date).toLocaleDateString('vi-VN', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    });
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

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa giao dịch này?')) return;
    try {
      await api.deleteTransaction(id);
      setAllTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (e) { console.error(e); }
    setOpenMenu(null);
  };

  const openEdit = (tx: any) => {
    setEditTx(tx);
    setEditNote(tx.note || tx.description || '');
    setEditAmount(String(tx.amount));
    setOpenMenu(null);
  };

  const handleEditSave = async () => {
    if (!editTx) return;
    setEditSaving(true);
    try {
      const updated = await api.updateTransaction(editTx.id, {
        type: editTx.type,
        amount: parseFloat(editAmount) || editTx.amount,
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
    { id: 'all', label: 'Tất cả' },
    { id: 'expense', label: 'Chi tiền' },
    { id: 'income', label: 'Thu tiền' },
  ];

  const filtered = allTransactions.filter((tx) => {
    const matchSearch =
      (tx.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.note || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.description || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || tx.type === filter;
    return matchSearch && matchFilter;
  });

  const filteredGroups = groupByDate(filtered);

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
            placeholder="Tìm kiếm theo ghi chú..."
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
                className="px-4 py-1.5 rounded-lg transition-all"
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
            Chọn khoảng thời gian
          </button>
        </div>
      </div>

      {/* Timeline groups */}
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-20">
            <p style={{ fontSize: 15, color: c.textMuted }}>Đang tải...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20">
            <span style={{ fontSize: 48 }}>🔍</span>
            <p style={{ fontSize: 15, color: c.textMuted, marginTop: 12 }}>Không tìm thấy giao dịch nào</p>
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
                  {group.dailyTotal >= 0 ? '+' : '-'}{Math.abs(group.dailyTotal).toLocaleString('vi-VN')} ₫
                </p>
              </div>

              {/* Transaction cards */}
              <div
                className="rounded-2xl overflow-hidden divide-y transition-colors duration-300"
                style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}`, borderColor: c.divider }}
              >
                {group.items.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 px-5 py-4 transition-colors relative cursor-pointer"
                    style={{ backgroundColor: 'transparent' }}
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

                    {/* Category + note */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{tx.category || tx.type}</p>
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
                      {tx.type === 'income' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('vi-VN')} ₫
                    </p>

                    {/* Options */}
                    <div className="relative">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        onClick={() => setOpenMenu(openMenu === tx.id ? null : tx.id)}
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
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors"
                            onClick={() => openEdit(tx)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Edit2 size={14} color={c.textSub} />
                            <span style={{ fontSize: 13, color: c.text }}>Chỉnh sửa</span>
                          </button>
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors"
                            onClick={() => handleDelete(tx.id)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.redBg)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Trash2 size={14} color="#FF5C5C" />
                            <span style={{ fontSize: 13, color: '#FF5C5C' }}>Xóa</span>
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
                Chỉnh sửa giao dịch
              </h3>
              <button onClick={() => setEditTx(null)}>
                <X size={20} color={c.textMuted} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Số tiền (₫)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Ghi chú</label>
                <input
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Ghi chú..."
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditTx(null)}
                  className="flex-1 py-3 rounded-xl border transition-colors duration-300"
                  style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600 }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editSaving}
                  className="flex-1 py-3 rounded-xl"
                  style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600, opacity: editSaving ? 0.7 : 1 }}
                >
                  {editSaving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
