import { useState } from 'react';
import { X, Camera } from 'lucide-react';

interface TransactionDrawerProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  { id: 'food', emoji: '🍜', label: 'Ăn uống' },
  { id: 'transport', emoji: '🚗', label: 'Đi lại' },
  { id: 'shopping', emoji: '🛍️', label: 'Mua sắm' },
  { id: 'house', emoji: '🏠', label: 'Nhà cửa' },
  { id: 'health', emoji: '💊', label: 'Sức khỏe' },
  { id: 'entertainment', emoji: '🎬', label: 'Giải trí' },
  { id: 'education', emoji: '📚', label: 'Giáo dục' },
  { id: 'other', emoji: '➕', label: 'Khác' },
];

const wallets = ['Ví tiền mặt', 'Tài khoản TPBank', 'Thẻ Visa Techcombank'];

type TabType = 'expense' | 'income' | 'transfer';

const tabs: { id: TabType; label: string; color: string }[] = [
  { id: 'expense', label: 'Chi tiền', color: '#FF5C5C' },
  { id: 'income', label: 'Thu tiền', color: '#00C896' },
  { id: 'transfer', label: 'Chuyển khoản', color: '#4B9EFF' },
];

export function TransactionDrawer({ open, onClose }: TransactionDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [amount, setAmount] = useState('0');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);
  const [note, setNote] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState('Hàng tháng');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCalc = (val: string) => {
    if (val === 'C') { setAmount('0'); return; }
    setAmount((prev) => {
      if (prev === '0') return val;
      return prev + val;
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(15,25,35,0.5)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col bg-white"
        style={{ width: 480, fontFamily: 'DM Sans, sans-serif', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #F0F2F5' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A2332' }}>
            Thêm giao dịch mới
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: '#F8F9FB' }}
          >
            <X size={18} color="#5A6A7A" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid #F0F2F5' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 transition-all"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: activeTab === tab.id ? tab.color : '#8A9AB0',
                borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Amount */}
          <div className="text-center">
            <div
              className="text-center py-4 px-4 rounded-xl"
              style={{ backgroundColor: '#F8F9FB' }}
            >
              <p style={{ fontSize: 36, fontWeight: 700, color: '#1A2332', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-1px' }}>
                {parseInt(amount || '0').toLocaleString('vi-VN')} ₫
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'C'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalc(btn)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: btn === 'C' ? '#FFE8E8' : '#E8F7F2',
                      color: btn === 'C' ? '#FF5C5C' : '#1A2332',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#1A2332', marginBottom: 12 }}>Danh mục</p>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: selectedCategory === cat.id ? '#00C896' : 'transparent',
                    backgroundColor: selectedCategory === cat.id ? '#E8FBF5' : '#F8F9FB',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 11, color: '#5A6A7A', fontWeight: 500 }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: '#1A2332', display: 'block', marginBottom: 8 }}>
              Nguồn tiền
            </label>
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none"
              style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332', backgroundColor: '#F8F9FB' }}
            >
              {wallets.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: '#1A2332', display: 'block', marginBottom: 8 }}>
              Thời gian
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none"
              style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332', backgroundColor: '#F8F9FB' }}
            />
          </div>

          {/* Note */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: '#1A2332', display: 'block', marginBottom: 8 }}>
              Ghi chú & Đính kèm
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Thêm ghi chú..."
              className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
              style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332', backgroundColor: '#F8F9FB' }}
            />
            <button
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#5A6A7A' }}
            >
              <Camera size={16} />
              Đính kèm ảnh
            </button>
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#1A2332' }}>Lặp lại tự động</p>
              <p style={{ fontSize: 12, color: '#8A9AB0', marginTop: 2 }}>Tự động ghi chép theo chu kỳ</p>
            </div>
            <button
              onClick={() => setRecurring(!recurring)}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ backgroundColor: recurring ? '#00C896' : '#D1D9E0' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: recurring ? 26 : 2 }}
              />
            </button>
          </div>

          {recurring && (
            <div>
              <select
                value={recurringPeriod}
                onChange={(e) => setRecurringPeriod(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: '#E8EBF0', fontSize: 14, color: '#1A2332', backgroundColor: '#F8F9FB' }}
              >
                <option>Hàng ngày</option>
                <option>Hàng tuần</option>
                <option>Hàng tháng</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4"
          style={{ borderTop: '1px solid #F0F2F5' }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border transition-colors"
            style={{ borderColor: '#E8EBF0', color: '#5A6A7A', fontSize: 14, fontWeight: 600 }}
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl transition-all"
            style={{ backgroundColor: '#00C896', color: 'white', fontSize: 14, fontWeight: 600 }}
          >
            Lưu giao dịch
          </button>
        </div>
      </div>
    </>
  );
}
