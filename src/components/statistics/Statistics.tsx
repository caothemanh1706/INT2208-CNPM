import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { api } from '../../lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Settings, PlusSquare, Edit3, Trash2 } from 'lucide-react';
import { BudgetManagerModal } from './BudgetManagerModal';
import { expenseCategories } from '../../data/categories';

const COLORS = ['#60a5fa', '#86efac', '#fca5a5', '#fcd34d', '#c084fc', '#f472b6', '#38bdf8'];

function aggregateData(transactions: any[], type: string) {
  const filtered = transactions.filter(t => t.type === type);
  if (filtered.length === 0) return [];
  const grouped: Record<string, number> = {};
  filtered.forEach(t => {
    const cat = t.category || 'Khác';
    grouped[cat] = (grouped[cat] || 0) + t.amount;
  });
  return Object.entries(grouped).map(([name, value], idx) => ({
    name, value, fill: COLORS[idx % COLORS.length]
  }));
}

function StatChart({ title, data, totalAmount }: { title: string, data: any[], totalAmount: number }) {
  return (
    <Card className="flex-1 p-4 rounded-xl shadow-sm border-none flex flex-col min-h-0">
      <h3 className="font-bold text-[15px] text-slate-800 mb-2">{title}</h3>
      <div className="relative flex-1 w-full flex items-center justify-center min-h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={0} dataKey="value" stroke="none">
              {data.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-bold text-lg text-slate-700">{data.length}</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">{totalAmount.toLocaleString()} đ</span>
        </div>
      </div>
      <div className="mt-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1 max-h-[80px]">
        {data.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }}></div>
              <span className="text-[11px] text-slate-500 truncate max-w-[80px]" title={item.name}>{item.name}</span>
            </div>
            <span className="text-[11px] font-bold text-slate-700">{item.value.toLocaleString('en-US')} đ</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Statistics({ transactions }: { transactions: any[] }) {
  const [overview, setOverview] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const loadBudgets = async () => {
    try {
      const bd = await api.getBudgets();
      setBudgets(bd);
    } catch (error) {
      console.error('Failed to load budgets', error);
    }
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const [ov, tr, bd] = await Promise.all([
          api.getStatisticsOverview(),
          api.getTrendData(),
          api.getBudgets()
        ]);
        setOverview(ov);
        setTrend(tr);
        setBudgets(bd);
      } catch (error) {
        console.error('Failed to load statistics', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [transactions]); // reload if transactions change

  if (loading || !overview) return <div className="p-8">Đang tải dữ liệu...</div>;

  const incomeData = aggregateData(transactions, 'income');
  const expenseData = aggregateData(transactions, 'expense');

  // Recalculate budget spent on frontend to support Group categories
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const enhancedBudgets = budgets.map(b => {
    const group = expenseCategories.find(g => g.group === b.category);
    
    let spent = 0;
    if (group) {
      spent = currentMonthTransactions
        .filter(t => t.type === 'expense' && (group.items.includes(t.category) || t.category === group.group))
        .reduce((sum, t) => sum + t.amount, 0);
    } else {
      spent = currentMonthTransactions
        .filter(t => t.type === 'expense' && t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
    }

    const progress = b.limit > 0 ? Math.min(100, Math.round((spent / b.limit) * 100)) : 0;
    return { ...b, spent, progress };
  });

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-900 hidden lg:block">Thống kê tài chính</h1>
        <div className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-sm ml-auto lg:ml-0">
          <span className="text-slate-500">Thời gian:</span>
          <select className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer">
            <option>tháng này</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 mb-4">
        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
          {/* Balance */}
          <Card className="p-4 rounded-xl shadow-sm border-none bg-white relative overflow-hidden">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Số dư</h3>
            <p className="text-xl font-bold text-slate-800 mb-2">{overview.balance.toLocaleString()}đ</p>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className={`font-semibold ${overview.balanceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {overview.balanceChange >= 0 ? '+' : ''}{overview.balanceChange}%
              </span>
              <span className="text-slate-400">tháng trước</span>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-500" />
            </div>
          </Card>

          {/* Income */}
          <Card className="p-4 rounded-xl shadow-sm border-none bg-white relative overflow-hidden">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tổng thu</h3>
            <p className="text-xl font-bold text-slate-800 mb-2">{overview.income.toLocaleString()}đ</p>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className={`font-semibold ${overview.incomeChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {overview.incomeChange >= 0 ? '+' : ''}{overview.incomeChange}%
              </span>
              <span className="text-slate-400">tháng trước</span>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </Card>

          {/* Expense */}
          <Card className="p-4 rounded-xl shadow-sm border-none bg-white relative overflow-hidden">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tổng chi</h3>
            <p className="text-xl font-bold text-slate-800 mb-2">{overview.expense.toLocaleString()}đ</p>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className={`font-semibold ${overview.expenseChange >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {overview.expenseChange > 0 ? '+' : ''}{overview.expenseChange}%
              </span>
              <span className="text-slate-400">tháng trước</span>
            </div>
            <div className="absolute top-3 right-3 w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 flex-1 min-h-0">
        {/* Left Column: Charts */}
        <div className="flex flex-col xl:w-[65%] gap-4 h-full min-h-0">
          <div className="flex flex-col sm:flex-row gap-4 h-[40%] min-h-0">
            <StatChart title="Thu tiền" data={incomeData} totalAmount={overview.income} />
            <StatChart title="Chi tiền" data={expenseData} totalAmount={overview.expense} />
          </div>

          <Card className="p-4 rounded-xl shadow-sm border-none bg-white flex-1 min-h-0 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
              <h3 className="font-bold text-[15px] text-slate-800">Xu hướng dòng tiền</h3>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tháng</span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="expense" name="Tổng chi" fill="#e17b7b" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="income" name="Tổng thu" fill="#529b7c" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: Budgets */}
        <div className="flex flex-col xl:w-[35%] gap-4 h-full min-h-0">
          <Card className="p-4 rounded-xl shadow-sm border-none bg-white flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-[17px] font-bold text-slate-800">Ngân sách & Cảnh báo</h3>
            </div>
            
            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
              {enhancedBudgets.map(budget => {
                const isCritical = budget.progress >= 90;
                const isWarning = budget.progress >= 75 && !isCritical;
                
                let barColor = 'bg-[#52b788]';
                let textColor = 'text-[#52b788]';
                if (isCritical) {
                  barColor = 'bg-[#b92b27]';
                  textColor = 'text-[#b92b27]';
                } else if (isWarning) {
                  barColor = 'bg-[#dda15e]';
                  textColor = 'text-[#dda15e]';
                }

                return (
                  <div key={budget.id} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end mb-1">
                      <div>
                        <h4 className="font-bold text-slate-900 text-[18px] mb-1">{budget.category}</h4>
                        <p className="text-[14px] text-slate-500">Hạn mức: {budget.limit.toLocaleString()}đ</p>
                      </div>
                      <span className={`font-bold text-[18px] ${textColor}`}>
                        {budget.progress}%
                      </span>
                    </div>
                    
                    <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} rounded-full transition-all duration-500`} 
                        style={{ width: `${budget.progress}%` }}
                      ></div>
                    </div>
                    
                    {(isCritical || isWarning) && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <AlertTriangle className={`w-4 h-4 ${textColor}`} />
                        <span className={`text-[13px] font-bold ${textColor}`}>
                          {isCritical ? 'Cảnh báo sắp vượt ngân sách' : 'Sắp chạm ngưỡng giới hạn!'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsBudgetModalOpen(true)} className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors">
                <PlusSquare className="w-[20px] h-[20px]" />
              </button>
              <button onClick={() => setIsBudgetModalOpen(true)} className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors">
                <Edit3 className="w-[20px] h-[20px]" />
              </button>
              <button onClick={() => setIsBudgetModalOpen(true)} className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors">
                <Trash2 className="w-[20px] h-[20px]" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      <BudgetManagerModal 
        isOpen={isBudgetModalOpen} 
        onClose={() => setIsBudgetModalOpen(false)} 
        budgets={budgets} 
        onSuccess={loadBudgets} 
      />
    </div>
  );
}
