import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';

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
    <div className="space-y-5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white"
          style={{ border: '1px solid #E8EBF0', width: 320 }}
        >
          <Search size={16} color="#8A9AB0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo ghi chú..."
            className="flex-1 outline-none bg-transparent"
            style={{ fontSize: 13, color: '#1A2332' }}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-xl bg-white" style={{ border: '1px solid #E8EBF0' }}>
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-4 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: filter === f.id ? '#00C896' : 'transparent',
                  color: filter === f.id ? 'white' : '#5A6A7A',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border"
            style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#5A6A7A' }}
          >
            Chọn khoảng thời gian
          </button>
        </div>
      </div>

      {/* Timeline groups */}
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-20">
            <p style={{ fontSize: 15, color: '#8A9AB0' }}>Đang tải...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20">
            <span style={{ fontSize: 48 }}>🔍</span>
            <p style={{ fontSize: 15, color: '#8A9AB0', marginTop: 12 }}>Không tìm thấy giao dịch nào</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <p style={{ fontSize: 12, fontWeight: 700, color: '#8A9AB0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                className="bg-white rounded-2xl overflow-hidden divide-y"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5', borderColor: '#F0F2F5' }}
              >
                {group.items.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors relative"
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tx.type === 'income' ? '#E8FBF5' : '#F8F9FB' }}
                    >
                      <span style={{ fontSize: 20 }}>{getCategoryIcon(tx.category || '')}</span>
                    </div>

                    {/* Category + note */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{tx.category || tx.type}</p>
                      <p style={{ fontSize: 12, color: '#8A9AB0', marginTop: 1 }}>{tx.note || tx.description || '—'}</p>
                    </div>

                    {/* Wallet badge */}
                    <span
                      className="px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#F0F2F5', color: '#5A6A7A', fontSize: 11, fontWeight: 600 }}
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
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
                        onClick={() => setOpenMenu(openMenu === tx.id ? null : tx.id)}
                      >
                        <MoreHorizontal size={16} color="#8A9AB0" />
                      </button>
                      {openMenu === tx.id && (
                        <div
                          className="absolute right-0 top-10 rounded-xl z-10 overflow-hidden"
                          style={{ width: 140, backgroundColor: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #F0F2F5' }}
                        >
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            onClick={() => openEdit(tx)}
                          >
                            <Edit2 size={14} color="#5A6A7A" />
                            <span style={{ fontSize: 13, color: '#1A2332' }}>Chỉnh sửa</span>
                          </button>
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(tx.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(15,25,35,0.5)' }}>
          <div className="bg-white rounded-2xl p-6" style={{ width: 400, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A2332' }}>
                Chỉnh sửa giao dịch
              </h3>
              <button onClick={() => setEditTx(null)}>
                <X size={20} color="#8A9AB0" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', display: 'block', marginBottom: 6 }}>Số tiền (₫)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', display: 'block', marginBottom: 6 }}>Ghi chú</label>
                <input
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Ghi chú..."
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332' }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditTx(null)}
                  className="flex-1 py-3 rounded-xl border"
                  style={{ borderColor: '#E8EBF0', color: '#5A6A7A', fontSize: 14, fontWeight: 600 }}
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
