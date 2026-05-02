import { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, Label } from '../ui/FormControls';
import { api } from '../../lib/api';
import { expenseCategories } from '../../data/categories';

interface BudgetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: any[];
  onSuccess: () => void;
}

export function BudgetManagerModal({ isOpen, onClose, budgets, onSuccess }: BudgetManagerModalProps) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  if (!isOpen) return null;

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) return;
    try {
      await api.deleteBudget(id);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Xóa thất bại');
    }
  };

  const handleAdd = async () => {
    if (!category) return alert('Vui lòng chọn hạng mục');
    if (!limit) return alert('Vui lòng nhập số tiền giới hạn');

    const numericLimit = parseFloat(limit.toString().replace(/,/g, ''));
    if (isNaN(numericLimit) || numericLimit <= 0) return alert('Số tiền không hợp lệ');

    // Check if category already has budget
    if (budgets.some(b => b.category === category)) {
      return alert('Hạng mục này đã có ngân sách. Vui lòng xóa ngân sách cũ trước khi thêm mới hoặc chọn hạng mục khác.');
    }

    setLoading(true);
    try {
      await api.createBudget({ category, limit: numericLimit });
      setCategory('');
      setLimit('');
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Thêm thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Quản lý Ngân sách</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-500">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Ngân sách hiện tại</h3>
            {budgets.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Chưa có ngân sách nào.</p>
            ) : (
              <div className="space-y-3">
                {budgets.map(b => (
                  <div key={b.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{b.category}</p>
                      <p className="text-xs text-slate-500">{b.limit.toLocaleString()} đ</p>
                    </div>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Thêm ngân sách mới</h3>
            <div className="space-y-4">
              <div>
                <Label required>Hạng mục (Chi tiền)</Label>
                <Select value={category} onChange={e => setCategory(e.target.value)} className={!category ? "text-slate-400" : ""}>
                  <option value="" disabled>Chọn hạng mục hoặc nhóm</option>
                  {expenseCategories.map(group => (
                    <optgroup key={group.group} label={`Nhóm: ${group.group}`}>
                      <option value={group.group} className="font-semibold text-blue-600">Tất cả {group.group}</option>
                      {group.items.map(item => (
                        <option key={item} value={item}>- {item}</option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </div>
              <div>
                <Label required>Hạn mức (đ)</Label>
                <Input type="number" placeholder="0" value={limit} onChange={e => setLimit(e.target.value)} className="text-right font-medium" rightElement={<span className="text-slate-500">đ</span>} />
              </div>
              <Button variant="primary" className="w-full bg-[#5c93c4] hover:bg-[#4a7aa6]" onClick={handleAdd} disabled={loading}>
                {loading ? 'Đang thêm...' : <><Plus className="w-4 h-4 mr-1" /> Thêm ngân sách</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
