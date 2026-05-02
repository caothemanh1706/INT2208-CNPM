import { useState, useEffect } from 'react';
import { X, ArrowDownUp, ShoppingBag, Coffee, UtensilsCrossed, Utensils, BookOpen, ShieldCheck, Fuel, Wallet, Gift, Award, PiggyBank } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Input, Select, Textarea, Label } from '../ui/FormControls';
import { api } from '../../lib/api';
import { expenseCategories, adjustCategories, incomeCategories } from '../../data/categories';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'add' | 'edit' | 'copy';
  initialData?: any;
}

type TabType = 'expense' | 'income' | 'transfer' | 'adjust';

export function AddRecordModal({ isOpen, onClose, onSuccess, mode = 'add', initialData }: AddRecordModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('Ví tiền mặt');
  const [toAccount, setToAccount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    if (isOpen) {
      if (initialData && (mode === 'edit' || mode === 'copy')) {
        setActiveTab(initialData.type as TabType);
        setAmount(initialData.amount.toString());
        setAccount(initialData.account || 'Ví tiền mặt');
        setToAccount(initialData.toAccount || '');
        setCategory(initialData.category || '');
        setDescription(initialData.description || '');
        
        // Format date to YYYY-MM-DDThh:mm for datetime-local input
        const d = new Date(initialData.date);
        const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setDate(localDate);
      } else {
        // Reset if adding new
        setActiveTab('expense');
        setAmount('');
        setAccount('Ví tiền mặt');
        setToAccount('');
        setCategory('');
        setDescription('');
        setDate(new Date().toISOString().slice(0, 16));
      }
    }
  }, [isOpen, initialData, mode]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!amount) return alert('Vui lòng nhập số tiền');
    if (activeTab === 'transfer' && !toAccount) return alert('Vui lòng chọn tài khoản nhận');
    
    setLoading(true);
    try {
      const data = {
        type: activeTab,
        amount: parseFloat(amount.toString().replace(/,/g, '')),
        account,
        toAccount: activeTab === 'transfer' ? toAccount : undefined,
        category: activeTab === 'transfer' ? 'Chuyển khoản' : (activeTab === 'adjust' ? 'Điều chỉnh' : category),
        description,
        date: new Date(date).toISOString()
      };

      if (mode === 'edit' && initialData) {
        await api.updateTransaction(initialData.id, data);
      } else {
        await api.createTransaction(data);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi lưu ghi chép');
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'edit' ? 'Chỉnh sửa ghi chép' : mode === 'copy' ? 'Sao chép ghi chép' : 'Thêm ghi chép';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 pb-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-500">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex px-6 border-b border-slate-100 z-10 relative">
          <TabButton active={activeTab === 'expense'} onClick={() => setActiveTab('expense')}>Chi tiền</TabButton>
          <TabButton active={activeTab === 'income'} onClick={() => setActiveTab('income')}>Thu tiền</TabButton>
          <TabButton active={activeTab === 'transfer'} onClick={() => setActiveTab('transfer')}>Chuyển khoản</TabButton>
          <TabButton active={activeTab === 'adjust'} onClick={() => setActiveTab('adjust')}>Điều chỉnh số dư</TabButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#e9f2fa] rounded-b-2xl relative -mt-px">
          {activeTab === 'expense' && (
            <ExpenseForm 
              amount={amount} setAmount={setAmount}
              account={account} setAccount={setAccount}
              category={category} setCategory={setCategory}
              description={description} setDescription={setDescription}
              date={date} setDate={setDate}
            />
          )}
          {activeTab === 'income' && (
            <IncomeForm 
              amount={amount} setAmount={setAmount}
              account={account} setAccount={setAccount}
              category={category} setCategory={setCategory}
              description={description} setDescription={setDescription}
              date={date} setDate={setDate}
            />
          )}
          {activeTab === 'transfer' && (
            <TransferForm 
              amount={amount} setAmount={setAmount}
              account={account} setAccount={setAccount}
              toAccount={toAccount} setToAccount={setToAccount}
              description={description} setDescription={setDescription}
              date={date} setDate={setDate}
            />
          )}
          {activeTab === 'adjust' && (
            <AdjustForm 
              amount={amount} setAmount={setAmount}
              account={account} setAccount={setAccount}
              category={category} setCategory={setCategory}
              description={description} setDescription={setDescription}
              date={date} setDate={setDate}
            />
          )}

          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" className="bg-white" onClick={onClose} disabled={loading}>Hủy</Button>
            <Button variant="primary" className="px-8 bg-[#5c93c4] hover:bg-[#4a7aa6]" onClick={handleSave} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-t border-x",
        active 
          ? "bg-[#e9f2fa] text-[#5c93c4] border-slate-100 border-b-[#e9f2fa]" 
          : "text-slate-500 hover:text-slate-700 border-transparent border-b-transparent"
      )}
      style={{ marginBottom: '-1px' }}
    >
      {children}
    </button>
  );
}

function ExpenseForm({ amount, setAmount, account, setAccount, category, setCategory, description, setDescription, date, setDate }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <div className="space-y-5">
        <div>
          <Label required>Số tiền</Label>
          <Input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} className="text-right font-medium text-red-500" rightElement={<span className="text-red-500 font-medium">đ</span>} />
        </div>
        <div>
          <Label required>Tài khoản</Label>
          <Select value={account} onChange={e => setAccount(e.target.value)}>
            <option value="Ví tiền mặt">Ví tiền mặt</option>
            <option value="Tài khoản ngân hàng">Tài khoản ngân hàng</option>
          </Select>
        </div>
        <div>
          <Label required>Thời gian</Label>
          <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>
      
      <div className="space-y-5">
        <div>
          <Label required>Hạng mục</Label>
          <Select value={category} onChange={e => setCategory(e.target.value)} className={!category ? "text-slate-400 mb-3" : "mb-3"}>
            <option value="" disabled>Chọn hạng mục</option>
            {expenseCategories.map(group => (
              <optgroup key={group.group} label={group.group}>
                {group.items.length === 0 && <option value={group.group}>{group.group}</option>}
                {group.items.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </optgroup>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            <CategoryBadge icon={<ShoppingBag className="w-4 h-4 text-purple-400" />} label="Đi chợ/siêu thị" active={category==='Đi chợ/siêu thị'} onClick={() => setCategory('Đi chợ/siêu thị')} />
            <CategoryBadge icon={<Coffee className="w-4 h-4 text-orange-400" />} label="Cafe" active={category==='Cafe'} onClick={() => setCategory('Cafe')} />
            <CategoryBadge icon={<UtensilsCrossed className="w-4 h-4 text-pink-400" />} label="Ăn sáng" active={category==='Ăn sáng'} onClick={() => setCategory('Ăn sáng')} />
            <CategoryBadge icon={<Utensils className="w-4 h-4 text-teal-400" />} label="Ăn tiệm" active={category==='Ăn tiệm'} onClick={() => setCategory('Ăn tiệm')} />
            <CategoryBadge icon={<BookOpen className="w-4 h-4 text-blue-400" />} label="Sách vở" active={category==='Sách vở'} onClick={() => setCategory('Sách vở')} />
            <CategoryBadge icon={<ShieldCheck className="w-4 h-4 text-rose-400" />} label="Bảo hiểm xe" active={category==='Bảo hiểm xe'} onClick={() => setCategory('Bảo hiểm xe')} />
            <CategoryBadge icon={<Fuel className="w-4 h-4 text-green-500" />} label="Xăng xe" active={category==='Xăng xe'} onClick={() => setCategory('Xăng xe')} />
          </div>
        </div>
        <div>
          <Label>Diễn giải</Label>
          <Textarea placeholder="Nhập diễn giải" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function IncomeForm({ amount, setAmount, account, setAccount, category, setCategory, description, setDescription, date, setDate }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <div className="space-y-5">
        <div>
          <Label required>Số tiền</Label>
          <Input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} className="text-right font-medium text-green-500" rightElement={<span className="text-green-500 font-medium">đ</span>} />
        </div>
        <div>
          <Label required>Tài khoản</Label>
          <Select value={account} onChange={e => setAccount(e.target.value)}>
            <option value="Ví tiền mặt">Ví tiền mặt</option>
            <option value="Tài khoản ngân hàng">Tài khoản ngân hàng</option>
          </Select>
        </div>
        <div>
          <Label required>Thời gian</Label>
          <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <Label required>Hạng mục (Chọn: {category || 'Trống'})</Label>
          <Select value={category} onChange={e => setCategory(e.target.value)} className={!category ? "text-slate-400 mb-3" : "mb-3"}>
            <option value="" disabled>Chọn hạng mục thu tiền</option>
            {incomeCategories.map(group => (
              <optgroup key={group.group} label={group.group}>
                {group.items.length === 0 && <option value={group.group}>{group.group}</option>}
                {group.items.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </optgroup>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2 mt-2">
            <CategoryBadge icon={<Gift className="w-4 h-4 text-pink-400" />} label="Được cho/tặng" active={category==='Được cho/tặng'} onClick={() => setCategory('Được cho/tặng')} />
            <CategoryBadge icon={<Wallet className="w-4 h-4 text-slate-500" />} label="khác" active={category==='khác'} onClick={() => setCategory('khác')} />
            <CategoryBadge icon={<PiggyBank className="w-4 h-4 text-teal-400" />} label="Lãi tiết kiệm" active={category==='Lãi tiết kiệm'} onClick={() => setCategory('Lãi tiết kiệm')} />
            <CategoryBadge icon={<Wallet className="w-4 h-4 text-blue-500" />} label="lương" active={category==='lương'} onClick={() => setCategory('lương')} />
            <CategoryBadge icon={<Award className="w-4 h-4 text-orange-400" />} label="Thưởng" active={category==='Thưởng'} onClick={() => setCategory('Thưởng')} />
          </div>
        </div>
        <div>
          <Label>Diễn giải</Label>
          <Textarea placeholder="Nhập diễn giải" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function TransferForm({ amount, setAmount, account, setAccount, toAccount, setToAccount, description, setDescription, date, setDate }: any) {
  const handleSwap = () => {
    const temp = account;
    setAccount(toAccount || 'Ví tiền mặt');
    setToAccount(temp);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <div className="space-y-5">
        <div>
          <Label required>Số tiền</Label>
          <Input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} className="text-right font-medium" rightElement={<span className="text-slate-700 font-medium">đ</span>} />
        </div>
        <div className="relative">
          <Label required>Từ tài khoản</Label>
          <Select value={account} onChange={e => setAccount(e.target.value)} className="mb-4">
            <option value="Ví tiền mặt">Ví tiền mặt</option>
            <option value="Tài khoản ngân hàng">Tài khoản ngân hàng</option>
          </Select>
          <Label required>Đến tài khoản</Label>
          <Select value={toAccount} onChange={e => setToAccount(e.target.value)} className={!toAccount ? "text-slate-400" : ""}>
            <option value="" disabled>Chọn tài khoản</option>
            <option value="Ví tiền mặt">Ví tiền mặt</option>
            <option value="Tài khoản ngân hàng">Tài khoản ngân hàng</option>
          </Select>
          
          <button type="button" onClick={handleSwap} className="absolute right-0 top-[40px] translate-x-12 translate-y-2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 hidden sm:flex z-10 shadow-sm">
            <ArrowDownUp className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <Label required>Thời gian</Label>
          <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Diễn giải</Label>
          <Textarea placeholder="Nhập diễn giải" value={description} onChange={e => setDescription(e.target.value)} className="min-h-[160px]" />
        </div>
      </div>
    </div>
  );
}

function AdjustForm({ amount, setAmount, account, setAccount, category, setCategory, description, setDescription, date, setDate }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <div className="space-y-5">
        <div>
          <Label required>Số dư thực tế</Label>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="text-right" rightElement={<span className="text-slate-700 font-medium">đ</span>} />
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-slate-500">Số dư trên tài khoản</span>
          <span className="text-sm font-medium text-slate-700">0 đ</span>
        </div>
        <div className="flex items-center justify-between pb-2">
          <span className="text-sm text-slate-500">Chênh lệch</span>
          <span className="text-sm font-medium text-slate-700">{amount ? parseFloat(amount).toLocaleString() : '0'} đ</span>
        </div>
        <div>
          <Label required>Tài khoản</Label>
          <Select value={account} onChange={e => setAccount(e.target.value)}>
            <option value="Ví tiền mặt">Ví tiền mặt</option>
            <option value="Tài khoản ngân hàng">Tài khoản ngân hàng</option>
          </Select>
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <Label required>Hạng mục</Label>
          <Select value={category} onChange={e => setCategory(e.target.value)} className={!category ? "text-slate-400" : ""}>
            <option value="" disabled>Chọn hạng mục</option>
            {adjustCategories.map(group => (
              <optgroup key={group.group} label={group.group}>
                {group.items.length === 0 && <option value={group.group}>{group.group}</option>}
                {group.items.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        </div>
        <div>
          <Label required>Thời gian</Label>
          <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Diễn giải</Label>
          <Textarea placeholder="Nhập diễn giải" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function CategoryBadge({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-sm transition-colors shadow-sm",
        active ? "border-blue-500 ring-1 ring-blue-500 text-blue-700" : "border-slate-100 text-slate-600 hover:border-slate-300"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
