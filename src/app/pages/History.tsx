import { useState } from 'react';
import { Search, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

const allTransactions = [
  {
    date: 'Thứ Hai, 02/06/2025',
    dailyTotal: -120000,
    items: [
      { id: 1, icon: '🍜', category: 'Ăn uống', note: 'Bữa trưa văn phòng', wallet: 'Ví tiền mặt', amount: -85000, type: 'expense' },
      { id: 2, icon: '🚗', category: 'Đi lại', note: 'Grab về nhà', wallet: 'Ví tiền mặt', amount: -35000, type: 'expense' },
    ],
  },
  {
    date: 'Chủ Nhật, 01/06/2025',
    dailyTotal: 14850000,
    items: [
      { id: 3, icon: '💼', category: 'Thu nhập', note: 'Lương tháng 6', wallet: 'TPBank', amount: 15000000, type: 'income' },
      { id: 4, icon: '🎬', category: 'Giải trí', note: 'Netflix Premium', wallet: 'Thẻ Visa', amount: -150000, type: 'expense' },
    ],
  },
  {
    date: 'Thứ Bảy, 31/05/2025',
    dailyTotal: -980000,
    items: [
      { id: 5, icon: '🛍️', category: 'Mua sắm', note: 'Lazada - Đồ gia dụng', wallet: 'Thẻ Visa', amount: -250000, type: 'expense' },
      { id: 6, icon: '🏠', category: 'Nhà cửa', note: 'Tiền thuê nhà tháng 6', wallet: 'TPBank', amount: -4500000, type: 'expense' },
      { id: 7, icon: '💊', category: 'Sức khỏe', note: 'Khám định kỳ', wallet: 'Ví tiền mặt', amount: -230000, type: 'expense' },
    ],
  },
  {
    date: 'Thứ Sáu, 30/05/2025',
    dailyTotal: 500000,
    items: [
      { id: 8, icon: '💰', category: 'Thu nhập', note: 'Chuyển khoản từ Hùng', wallet: 'TPBank', amount: 500000, type: 'income' },
      { id: 9, icon: '☕', category: 'Ăn uống', note: 'Cà phê Highlands', wallet: 'Ví tiền mặt', amount: -65000, type: 'expense' },
    ],
  },
];

type FilterType = 'all' | 'expense' | 'income';

export function History() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'expense', label: 'Chi tiền' },
    { id: 'income', label: 'Thu tiền' },
  ];

  const filteredGroups = allTransactions.map((group) => ({
    ...group,
    items: group.items.filter((tx) => {
      const matchSearch = tx.category.toLowerCase().includes(search.toLowerCase()) ||
        tx.note.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || tx.type === filter;
      return matchSearch && matchFilter;
    }),
  })).filter((g) => g.items.length > 0);

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
        {filteredGroups.length === 0 ? (
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
                {group.items.map((tx, idx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors relative"
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tx.type === 'income' ? '#E8FBF5' : '#F8F9FB' }}
                    >
                      <span style={{ fontSize: 20 }}>{tx.icon}</span>
                    </div>

                    {/* Category + note */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{tx.category}</p>
                      <p style={{ fontSize: 12, color: '#8A9AB0', marginTop: 1 }}>{tx.note}</p>
                    </div>

                    {/* Wallet badge */}
                    <span
                      className="px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: '#F0F2F5', color: '#5A6A7A', fontSize: 11, fontWeight: 600 }}
                    >
                      {tx.wallet}
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
                            onClick={() => setOpenMenu(null)}
                          >
                            <Edit2 size={14} color="#5A6A7A" />
                            <span style={{ fontSize: 13, color: '#1A2332' }}>Chỉnh sửa</span>
                          </button>
                          <button
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 transition-colors"
                            onClick={() => setOpenMenu(null)}
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
    </div>
  );
}
