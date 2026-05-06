import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Area, AreaChart,
  PieChart, Pie, Cell,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api';

const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

const CATEGORY_COLORS = [
  '#00C896','#4B9EFF','#FF9F43','#FF6B9D','#7B68EE','#8A9AB0',
  '#F97316','#06B6D4','#84CC16','#A855F7','#EC4899','#14B8A6',
];

function CustomTooltipBar({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl p-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid #F0F2F5' }}>
        <p style={{ fontWeight: 600, fontSize: 13, color: '#1A2332', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: {(p.value / 1_000_000).toFixed(1)}tr ₫
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function Statistics() {
  const [timePeriod, setTimePeriod] = useState<'month' | 'quarter' | 'year'>('year');
  const [trendData, setTrendData] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const periods = [
    { id: 'month' as const, label: 'Tháng' },
    { id: 'quarter' as const, label: 'Quý' },
    { id: 'year' as const, label: 'Năm' },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [trend, bdgts, txs] = await Promise.all([
          api.getTrendData(),
          api.getBudgets(),
          api.getTransactions(),
        ]);
        setTrendData(trend.map((d: any, i: number) => ({
          month: MONTH_LABELS[i] || d.month,
          thu: d.income,
          chi: d.expense,
          tietkiem: d.income - d.expense > 0 ? d.income - d.expense : 0,
        })));
        setBudgets(bdgts);
        setTransactions(txs);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Compute spending structure from transactions (current month expenses by category)
  const now = new Date();
  const currentMonthTxs = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return tx.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const categoryTotals: Record<string, number> = {};
  currentMonthTxs.forEach((tx) => {
    const cat = tx.category || 'Khác';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
  });
  const spendingStructure = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value], i) => ({ name, value, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));
  const totalSpend = spendingStructure.reduce((s, d) => s + d.value, 0);

  // Cumulative savings for area chart
  let cumulative = 0;
  const trendWithCumulative = trendData.map((d) => {
    cumulative += (d.thu - d.chi);
    return { ...d, tietkiem: Math.max(0, cumulative) };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ fontSize: 15, color: '#8A9AB0' }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'white', border: '1px solid #E8EBF0' }}>
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setTimePeriod(p.id)}
              className="px-4 py-1.5 rounded-lg transition-all"
              style={{
                backgroundColor: timePeriod === p.id ? '#00C896' : 'transparent',
                color: timePeriod === p.id ? 'white' : '#5A6A7A',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <select
          className="px-3 py-2 rounded-xl border outline-none"
          style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#5A6A7A', backgroundColor: 'white' }}
        >
          <option>{now.getFullYear()}</option>
          <option>{now.getFullYear() - 1}</option>
        </select>
      </div>

      {/* Main grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 0.65fr' }}>
        {/* Left column */}
        <div className="space-y-5">
          {/* Bar chart */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A2332' }}>
                Thu vào vs Chi ra — {now.getFullYear()}
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00C896' }} />
                  <span style={{ fontSize: 11, color: '#8A9AB0' }}>Thu vào</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF5C5C' }} />
                  <span style={{ fontSize: 11, color: '#8A9AB0' }}>Chi ra</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData} barGap={2} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1e6).toFixed(0)}tr`} />
                <Tooltip content={<CustomTooltipBar />} />
                <Bar dataKey="thu" name="Thu vào" fill="#00C896" radius={[4, 4, 0, 0]} />
                <Bar dataKey="chi" name="Chi ra" fill="#FF5C5C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Savings growth */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
          >
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A2332', marginBottom: 20 }}>
              Tăng trưởng tiết kiệm
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendWithCumulative}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C896" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1e6).toFixed(0)}tr`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #F0F2F5', fontSize: 12 }}
                  formatter={(val: number) => [`${(val/1e6).toFixed(1)}tr ₫`, 'Tiết kiệm']}
                />
                <Area
                  type="monotone"
                  dataKey="tietkiem"
                  stroke="#00C896"
                  strokeWidth={2.5}
                  fill="url(#savingsGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Donut chart */}
          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
          >
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A2332', marginBottom: 4 }}>
              Cơ cấu chi tiêu
            </h3>
            {spendingStructure.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8A9AB0', padding: '20px 0', textAlign: 'center' }}>Chưa có chi tiêu tháng này</p>
            ) : (
              <>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={spendingStructure}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {spendingStructure.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #F0F2F5', fontSize: 12 }}
                        formatter={(val: number) => [val.toLocaleString('vi-VN') + ' ₫', '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    style={{ top: 0 }}
                  >
                    <p style={{ fontSize: 11, color: '#8A9AB0' }}>Tổng chi</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1A2332', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {(totalSpend / 1000000).toFixed(1)}tr ₫
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mt-1">
                  {spendingStructure.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span style={{ fontSize: 12, color: '#5A6A7A' }}>{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 12, color: '#1A2332', fontWeight: 600 }}>
                          {cat.value.toLocaleString('vi-VN')} ₫
                        </span>
                        <span style={{ fontSize: 11, color: '#8A9AB0', width: 32, textAlign: 'right' }}>
                          {totalSpend > 0 ? Math.round((cat.value / totalSpend) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Budget alerts */}
          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
          >
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A2332', marginBottom: 14 }}>
              Ngân sách tháng này
            </h3>
            {budgets.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8A9AB0' }}>Chưa thiết lập ngân sách</p>
            ) : (
              <div className="space-y-4">
                {budgets.map((b) => {
                  const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
                  const over = b.spent > b.limit;
                  return (
                    <div key={b.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{b.category || 'Ngân sách'}</span>
                          {over && (
                            <span
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: '#FFE8E8', color: '#FF5C5C', fontSize: 10, fontWeight: 700 }}
                            >
                              <AlertTriangle size={9} />
                              Vượt hạn mức
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: '#8A9AB0' }}>
                          {(b.spent || 0).toLocaleString('vi-VN')} / {b.limit.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F0F2F5' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: over ? '#FF5C5C' : '#00C896',
                          }}
                        />
                      </div>
                      <div className="flex justify-end mt-1">
                        <span style={{ fontSize: 11, color: over ? '#FF5C5C' : '#8A9AB0', fontWeight: over ? 600 : 400 }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
