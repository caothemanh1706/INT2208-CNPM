import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { api } from '../../lib/api';
import { Search, Trash2, Edit3, Copy } from 'lucide-react';

interface HistoryProps {
  transactions: any[];
  onTransactionsChange: () => void; // Trigger a refetch in parent
}

export function History({ transactions, onTransactionsChange }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Basic filtering (can be expanded later for time/category dropdowns)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      (t.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  // Calculate totals for summary line
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  // Group by date string (DD/MM/YYYY)
  const groupedData = useMemo(() => {
    const groups: Record<string, { income: number, expense: number, items: any[] }> = {};
    
    filteredTransactions.forEach(t => {
      const dateObj = new Date(t.date);
      // Format as DD/MM/YYYY
      const dateKey = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
      
      if (!groups[dateKey]) {
        groups[dateKey] = { income: 0, expense: 0, items: [] };
      }
      
      groups[dateKey].items.push(t);
      if (t.type === 'income') groups[dateKey].income += t.amount;
      if (t.type === 'expense') groups[dateKey].expense += t.amount;
    });

    // Convert object to array for easier rendering, keep sorted by most recent
    return Object.entries(groups).map(([date, data]) => ({ date, ...data }));
  }, [filteredTransactions]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ghi chép này?')) {
      try {
        await api.deleteTransaction(id);
        onTransactionsChange(); // Refetch
      } catch (error) {
        console.error('Failed to delete transaction', error);
        alert('Xóa thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 hidden lg:block">Lịch sử ghi chép</h1>
      </div>

      <Card className="flex-1 flex flex-col p-6 rounded-2xl shadow-sm border-none bg-white overflow-hidden">
        
        {/* Filters Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative w-[280px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-shadow"
            />
          </div>
          
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white text-sm">
            <span className="text-slate-500">Thời gian:</span>
            <select className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer pr-1">
              <option>30 ngày gần nhất</option>
              <option>Tháng này</option>
              <option>Tất cả</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white text-sm">
            <span className="text-slate-500">Báo cáo:</span>
            <select className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer pr-1">
              <option>Tất cả</option>
              <option>Thu tiền</option>
              <option>Chi tiền</option>
            </select>
          </div>
        </div>

        {/* Summary Line */}
        <div className="flex items-center gap-6 mb-4 text-[13px] px-2">
          <div>
            <span className="text-slate-500">Tổng thu: </span>
            <span className="font-bold text-emerald-500">{totalIncome.toLocaleString()} đ</span>
          </div>
          <div className="w-[1px] h-4 bg-slate-200"></div>
          <div>
            <span className="text-slate-500">Tổng chi: </span>
            <span className="font-bold text-red-500">{totalExpense.toLocaleString()} đ</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[#eef5fb] text-slate-600 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-6 font-semibold w-[25%] border-b border-slate-200 border-r">Hạng mục</th>
                <th className="py-3 px-6 font-semibold w-[20%] border-b border-slate-200 border-r text-center">Tổng tiền</th>
                <th className="py-3 px-6 font-semibold border-b border-slate-200">Diễn giải</th>
                <th className="py-3 px-6 border-b border-slate-200 w-[100px]"></th>
              </tr>
            </thead>
            <tbody>
              {groupedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Không tìm thấy giao dịch nào.
                  </td>
                </tr>
              ) : (
                groupedData.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    {/* Date Header Row */}
                    <tr className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 font-bold text-blue-500 border-r border-slate-100">
                        {group.date}
                      </td>
                      <td className="py-3 px-6 border-r border-slate-100 text-center font-bold text-[13px]">
                        {group.income > 0 && <div className="text-emerald-500">{group.income.toLocaleString()} đ</div>}
                        {group.expense > 0 && <div className="text-red-500">{group.expense.toLocaleString()} đ</div>}
                        {(group.income === 0 && group.expense === 0) && <div className="text-slate-400">0 đ</div>}
                      </td>
                      <td className="py-3 px-6"></td>
                      <td className="py-3 px-6 text-right">
                        {/* Placeholder for date-level delete all if needed, mockup shows trash icon here but it might be misleading */}
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Xóa tất cả trong ngày">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Items for this date */}
                    {group.items.map((item, iIdx) => (
                      <tr key={item.id || iIdx} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-8 text-slate-700 border-r border-slate-100">
                          {item.category || item.type}
                        </td>
                        <td className="py-3 px-6 text-center font-medium border-r border-slate-100">
                          <span className={item.type === 'income' ? 'text-emerald-500' : item.type === 'expense' ? 'text-red-500' : 'text-slate-600'}>
                            {item.amount.toLocaleString()} đ
                          </span>
                        </td>
                        <td className="py-3 px-6 text-slate-500 text-[13px]">
                          {item.description || '--'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Sao chép">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors" title="Sửa">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
          Tổng số: {filteredTransactions.length}
        </div>
      </Card>
    </div>
  );
}
