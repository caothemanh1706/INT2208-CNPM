import { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { api } from '../../lib/api';
import { useTheme } from '../contexts/ThemeContext';

interface TransactionDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

type TabType = 'expense' | 'income' | 'transfer';

const tabs: { id: TabType; label: string; color: string }[] = [
  { id: 'expense', label: 'Chi tiền', color: '#FF5C5C' },
  { id: 'income', label: 'Thu tiền', color: '#00C896' },
  { id: 'transfer', label: 'Chuyển khoản', color: '#4B9EFF' },
];

export function TransactionDrawer({ open, onClose, onSaved }: TransactionDrawerProps) {
  const { c, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [amount, setAmount] = useState('0');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [toAccountId, setToAccountId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState('Hàng tháng');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      api.getCategories().then((cats) => {
        setCategories(cats);
        const first = cats.find((c: any) => c.type === activeTab || c.type === 'both');
        if (first) setSelectedCategoryId(first.id);
      }).catch(() => {});

      api.getAccounts().then((accs) => {
        setAccounts(accs);
        const def = accs.find((a: any) => a.isDefault) || accs[0];
        if (def) setSelectedAccountId(def.id);
      }).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (categories.length > 0) {
      const first = categories.find((c: any) => c.type === activeTab || c.type === 'both');
      if (first) setSelectedCategoryId(first.id);
    }
  }, [activeTab, categories]);

  const handleCalc = (val: string) => {
    if (val === 'C') { setAmount('0'); return; }
    setAmount((prev) => {
      if (prev === '0') return val;
      return prev + val;
    });
  };

  const handleSave = async () => {
    const numAmount = parseInt(amount || '0');
    if (numAmount <= 0) {
      setError('Vui lòng nhập số tiền');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const selectedCat = categories.find(c => c.id === selectedCategoryId);
      const selectedAcc = accounts.find(a => a.id === selectedAccountId);

      await api.createTransaction({
        type: activeTab,
        amount: numAmount,
        category: selectedCat?.name || '',
        categoryId: selectedCategoryId || undefined,
        account: selectedAcc?.name || '',
        accountId: selectedAccountId || undefined,
        toAccountId: activeTab === 'transfer' ? (toAccountId || undefined) : undefined,
        date,
        note,
        isRecurring: recurring,
      });

      setAmount('0');
      setNote('');
      setRecurring(false);
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
      onSaved?.();
    } catch (err: any) {
      setError(err.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) => c.type === activeTab || c.type === 'both'
  );

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-colors duration-300"
        style={{ backgroundColor: isDark ? 'rgba(10,18,28,0.65)' : 'rgba(15,25,35,0.5)' }}
        onClick={onClose}
      />

      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col transition-colors duration-300"
        style={{ width: 480, backgroundColor: c.card, fontFamily: 'DM Sans, sans-serif', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${c.divider}` }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: c.text }}>
            Thêm giao dịch mới
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: c.input }}
          >
            <X size={18} color={c.textSub} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: `1px solid ${c.divider}` }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 transition-all"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: activeTab === tab.id ? tab.color : c.textMuted,
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
              className="text-center py-4 px-4 rounded-xl transition-colors duration-300"
              style={{ backgroundColor: c.input }}
            >
              <p style={{ fontSize: 36, fontWeight: 700, color: c.text, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-1px' }}>
                {parseInt(amount || '0').toLocaleString('vi-VN')} ₫
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'C'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalc(btn)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: btn === 'C' ? c.redBg : (isDark ? 'rgba(0,200,150,0.1)' : '#E8F7F2'),
                      color: btn === 'C' ? c.red : c.text,
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
          {activeTab !== 'transfer' && (
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: c.text, marginBottom: 12 }}>Danh mục</p>
              <div className="grid grid-cols-4 gap-2">
                {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedCategoryId === cat.id ? c.green : 'transparent',
                      backgroundColor: selectedCategoryId === cat.id ? c.greenBg : c.input,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>
                      {cat.icon === 'UtensilsCrossed' ? '🍜' :
                       cat.icon === 'Car' ? '🚗' :
                       cat.icon === 'ShoppingBag' ? '🛍️' :
                       cat.icon === 'HeartPulse' ? '💊' :
                       cat.icon === 'Gamepad2' ? '🎬' :
                       cat.icon === 'GraduationCap' ? '📚' :
                       cat.icon === 'Home' ? '🏠' :
                       cat.icon === 'Receipt' ? '🧾' :
                       cat.icon === 'Plane' ? '✈️' :
                       cat.icon === 'Wallet' ? '💼' :
                       cat.icon === 'Gift' ? '🎁' :
                       cat.icon === 'TrendingUp' ? '📈' :
                       cat.icon === 'Briefcase' ? '💻' :
                       '➕'}
                    </span>
                    <span style={{ fontSize: 10, color: c.textSub, fontWeight: 500, textAlign: 'center' }}>{cat.name}</span>
                  </button>
                )) : (
                  <p style={{ fontSize: 13, color: c.textMuted, gridColumn: '1/-1' }}>Đang tải danh mục...</p>
                )}
              </div>
            </div>
          )}

          {/* Wallet / Account */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: c.text, display: 'block', marginBottom: 8 }}>
              {activeTab === 'transfer' ? 'Từ tài khoản' : 'Nguồn tiền'}
            </label>
            <select
              value={selectedAccountId ?? ''}
              onChange={(e) => setSelectedAccountId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
              style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {a.balance.toLocaleString('vi-VN')} ₫</option>
              ))}
              {accounts.length === 0 && <option value="">Chưa có tài khoản</option>}
            </select>
          </div>

          {/* To Account (transfer only) */}
          {activeTab === 'transfer' && (
            <div>
              <label style={{ fontWeight: 600, fontSize: 14, color: c.text, display: 'block', marginBottom: 8 }}>
                Đến tài khoản
              </label>
              <select
                value={toAccountId ?? ''}
                onChange={(e) => setToAccountId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
              >
                {accounts.filter(a => a.id !== selectedAccountId).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: c.text, display: 'block', marginBottom: 8 }}>
              Thời gian
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
              style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
            />
          </div>

          {/* Note */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: c.text, display: 'block', marginBottom: 8 }}>
              Ghi chú & Đính kèm
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Thêm ghi chú..."
              className="w-full px-4 py-3 rounded-xl border outline-none resize-none transition-colors"
              style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
            />
            <button
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
              style={{ borderColor: c.inputBorder, fontSize: 13, color: c.textSub, backgroundColor: c.card }}
            >
              <Camera size={16} />
              Đính kèm ảnh
            </button>
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: c.text }}>Lặp lại tự động</p>
              <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>Tự động ghi chép theo chu kỳ</p>
            </div>
            <button
              onClick={() => setRecurring(!recurring)}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ backgroundColor: recurring ? c.green : (isDark ? '#243040' : '#D1D9E0') }}
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
                className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
              >
                <option>Hàng ngày</option>
                <option>Hàng tuần</option>
                <option>Hàng tháng</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${c.divider}` }}>
          {error && (
            <p style={{ fontSize: 13, color: c.red, marginBottom: 8 }}>{error}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border transition-colors"
              style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Đang lưu...' : 'Lưu giao dịch'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
