import { useState, useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { api } from '../../lib/api';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../../lib/notifications';

interface TransactionDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

type TabType = 'expense' | 'income' | 'transfer';

export function TransactionDrawer({ open, onClose, onSaved }: TransactionDrawerProps) {
  const { c, isDark } = useTheme();
  const { formatCurrency, language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [amount, setAmount] = useState('0');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [toAccountId, setToAccountId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState('Hàng tháng');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: TabType; label: string; color: string }[] = [
    { id: 'expense', label: language === 'en' ? 'Expense' : language === 'zh' ? '支出记账' : 'Chi tiền', color: '#FF5C5C' },
    { id: 'income', label: language === 'en' ? 'Income' : language === 'zh' ? '收入记账' : 'Thu tiền', color: '#00C896' },
    { id: 'transfer', label: language === 'en' ? 'Transfer' : language === 'zh' ? '账户转账' : 'Chuyển khoản', color: '#4B9EFF' },
  ];

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

  useEffect(() => {
    if (activeTab === 'transfer') {
      const otherAcc = accounts.find((a) => a.id !== selectedAccountId);
      if (otherAcc) {
        setToAccountId(otherAcc.id);
      }
    } else {
      setToAccountId(null);
    }
  }, [activeTab, selectedAccountId, accounts]);

  const handleCalc = (val: string) => {
    if (val === 'C') { setAmount('0'); return; }
    setAmount((prev) => {
      if (prev === '0') return val;
      return prev + val;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const numAmount = parseInt(amount || '0');
    if (numAmount <= 0) {
      setError(language === 'en' ? 'Please enter amount' : language === 'zh' ? '请输入交易金额' : 'Vui lòng nhập số tiền');
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
        receiptUrl: receiptUrl || undefined,
      });

      // Dispatch translated descriptions and alerts
      const formattedAmt = formatCurrency(numAmount);
      if (activeTab === 'transfer') {
        const fromAcc = accounts.find(a => a.id === selectedAccountId)?.name || '';
        const toAcc = accounts.find(a => a.id === toAccountId)?.name || '';
        
        const notifyMsg = language === 'en'
          ? `Transfer: Transferred ${formattedAmt} from "${fromAcc}" to "${toAcc}".`
          : language === 'zh'
          ? `账户转账: 已成功从账户 "${fromAcc}" 划转 ${formattedAmt} 至 "${toAcc}"。`
          : `Chuyển khoản: Đã chuyển ${numAmount.toLocaleString('vi-VN')} ₫ từ "${fromAcc}" sang "${toAcc}".`;
        
        notificationService.add(notifyMsg);
      } else {
        const catNameTranslated = t(selectedCat?.name || 'Khác');
        let notifyMsg = '';
        if (language === 'en') {
          notifyMsg = `${activeTab === 'income' ? 'Income' : 'Expense'}: Recorded ${formattedAmt} for category "${catNameTranslated}".`;
        } else if (language === 'zh') {
          notifyMsg = `${activeTab === 'income' ? '收入记账' : '支出记账'}: 已成功记录 ${formattedAmt} 资金于 "${catNameTranslated}" 分类下。`;
        } else {
          const typeLabel = activeTab === 'income' ? 'Thu nhập' : 'Chi tiêu';
          notifyMsg = `${typeLabel}: Đã ghi nhận khoản ${typeLabel.toLowerCase()} ${numAmount.toLocaleString('vi-VN')} ₫ thuộc danh mục "${selectedCat?.name || 'Khác'}".`;
        }
        
        notificationService.add(notifyMsg);
      }

      setAmount('0');
      setNote('');
      setReceiptUrl(null);
      setRecurring(false);
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
      onSaved?.();
    } catch (err: any) {
      setError(err.message || (language === 'en' ? 'Save failed' : language === 'zh' ? '保存失败' : 'Lưu thất bại'));
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
            {language === 'en' ? 'Add New Transaction' : language === 'zh' ? '新增交易账单' : 'Thêm giao dịch mới'}
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
              className="flex-1 py-3 transition-all cursor-pointer"
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
                {formatCurrency(parseInt(amount || '0'))}
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'C'].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalc(btn)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
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
              <p style={{ fontWeight: 600, fontSize: 14, color: c.text, marginBottom: 12 }}>
                {language === 'en' ? 'Category' : language === 'zh' ? '账单分类' : 'Danh mục'}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all cursor-pointer"
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
                    <span style={{ fontSize: 10, color: c.textSub, fontWeight: 500, textAlign: 'center' }}>
                      {t(cat.name)}
                    </span>
                  </button>
                )) : (
                  <p style={{ fontSize: 13, color: c.textMuted, gridColumn: '1/-1' }}>
                    {language === 'en' ? 'Loading categories...' : language === 'zh' ? '正在加载分类列表...' : 'Đang tải danh mục...'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Wallet / Account */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: c.text, display: 'block', marginBottom: 8 }}>
              {activeTab === 'transfer' 
                ? (language === 'en' ? 'From account' : language === 'zh' ? '转出账户' : 'Từ tài khoản') 
                : (language === 'en' ? 'Source of funds' : language === 'zh' ? '选择资金账户' : 'Nguồn tiền')}
            </label>
            <select
              value={selectedAccountId ?? ''}
              onChange={(e) => setSelectedAccountId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
              style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {formatCurrency(a.balance)}</option>
              ))}
              {accounts.length === 0 && (
                <option value="">{language === 'en' ? 'No accounts' : language === 'zh' ? '暂无账户' : 'Chưa có tài khoản'}</option>
              )}
            </select>
          </div>

          {/* To Account (transfer only) */}
          {activeTab === 'transfer' && (
            <div>
              <label style={{ fontWeight: 600, fontSize: 14, color: c.text, display: 'block', marginBottom: 8 }}>
                {language === 'en' ? 'To account' : language === 'zh' ? '转入目标账户' : 'Đến tài khoản'}
              </label>
              <select
                value={toAccountId ?? ''}
                onChange={(e) => setToAccountId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 rounded-xl border outline-none transition-colors"
                style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
              >
                {accounts.filter(a => a.id !== selectedAccountId).map((a) => (
                  <option key={a.id} value={a.id}>{a.name} — {formatCurrency(a.balance)}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label style={{ fontWeight: 600, fontSize: 14, color: c.text, display: 'block', marginBottom: 8 }}>
              {language === 'en' ? 'Time' : language === 'zh' ? '记账时间' : 'Thời gian'}
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
              {language === 'en' ? 'Note & Attachment' : language === 'zh' ? '交易备注与附件' : 'Ghi chú & Đính kèm'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={language === 'en' ? 'Add note...' : language === 'zh' ? '添加备注...' : 'Thêm ghi chú...'}
              className="w-full px-4 py-3 rounded-xl border outline-none resize-none transition-colors mb-3"
              style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
            />
            
            {/* Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors cursor-pointer"
              style={{ borderColor: c.inputBorder, fontSize: 13, color: c.textSub, backgroundColor: c.card }}
            >
              <Camera size={16} />
              {language === 'en' ? 'Attach image' : language === 'zh' ? '上传图片附件' : 'Đính kèm ảnh'}
            </button>

            {/* Receipt Preview */}
            {receiptUrl && (
              <div className="relative mt-3 rounded-xl overflow-hidden border" style={{ borderColor: c.inputBorder, maxWidth: 200 }}>
                <img src={receiptUrl} alt="Receipt preview" className="w-full h-auto object-cover max-h-32" />
                <button
                  type="button"
                  onClick={() => setReceiptUrl(null)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                  style={{ fontSize: 11, fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: c.text }}>
                {language === 'en' ? 'Recurring' : language === 'zh' ? '自动定期记账' : 'Lặp lại tự động'}
              </p>
              <p style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>
                {language === 'en' ? 'Automatically record by cycle' : language === 'zh' ? '按设定的周期自动记录' : 'Tự động ghi chép theo chu kỳ'}
              </p>
            </div>
            <button
              onClick={() => setRecurring(!recurring)}
              className="relative w-12 h-6 rounded-full transition-all cursor-pointer"
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
                <option value="Hàng ngày">{language === 'en' ? 'Daily' : language === 'zh' ? '每日' : 'Hàng ngày'}</option>
                <option value="Hàng tuần">{language === 'en' ? 'Weekly' : language === 'zh' ? '每周' : 'Hàng tuần'}</option>
                <option value="Hàng tháng">{language === 'en' ? 'Monthly' : language === 'zh' ? '每月' : 'Hàng tháng'}</option>
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
              className="flex-1 py-3 rounded-xl border transition-colors cursor-pointer"
              style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {language === 'en' ? 'Cancel' : language === 'zh' ? '取消' : 'Hủy'}
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 rounded-xl transition-all cursor-pointer"
              style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600, opacity: loading ? 0.7 : 1 }}
            >
              {loading 
                ? (language === 'en' ? 'Saving...' : language === 'zh' ? '正在保存...' : 'Đang lưu...') 
                : (language === 'en' ? 'Save Transaction' : language === 'zh' ? '保存交易账单' : 'Lưu giao dịch')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
