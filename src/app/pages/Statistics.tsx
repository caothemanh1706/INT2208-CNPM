import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Area, AreaChart,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

const monthlyData = [
  { month: 'T1', thu: 12, chi: 8, tietkiem: 4 },
  { month: 'T2', thu: 15, chi: 9, tietkiem: 10 },
  { month: 'T3', thu: 13, chi: 10, tietkiem: 13 },
  { month: 'T4', thu: 14, chi: 7, tietkiem: 20 },
  { month: 'T5', thu: 16, chi: 11, tietkiem: 25 },
  { month: 'T6', thu: 18, chi: 9, tietkiem: 34 },
  { month: 'T7', thu: 20, chi: 12, tietkiem: 42 },
  { month: 'T8', thu: 17, chi: 10, tietkiem: 49 },
  { month: 'T9', thu: 19, chi: 13, tietkiem: 55 },
  { month: 'T10', thu: 22, chi: 14, tietkiem: 63 },
  { month: 'T11', thu: 21, chi: 11, tietkiem: 73 },
  { month: 'T12', thu: 25, chi: 15, tietkiem: 83 },
];

const spendingStructure = [
  { name: 'Ăn uống', value: 3200000, color: '#00C896' },
  { name: 'Đi lại', value: 1500000, color: '#4B9EFF' },
  { name: 'Mua sắm', value: 2100000, color: '#FF9F43' },
  { name: 'Giải trí', value: 800000, color: '#FF6B9D' },
  { name: 'Nhà cửa', value: 4500000, color: '#7B68EE' },
  { name: 'Khác', value: 420000, color: '#8A9AB0' },
];

const budgets = [
  { category: '🍜 Ăn uống', spent: 3200000, limit: 3000000, color: '#FF5C5C', over: true },
  { category: '🚗 Đi lại', spent: 1200000, limit: 2000000, color: '#00C896', over: false },
  { category: '🛍️ Mua sắm', spent: 1900000, limit: 2000000, color: '#FF9F43', over: false },
  { category: '🎬 Giải trí', spent: 600000, limit: 1000000, color: '#4B9EFF', over: false },
  { category: '🏠 Nhà cửa', spent: 4500000, limit: 4000000, color: '#FF5C5C', over: true },
];

const totalSpend = spendingStructure.reduce((s, d) => s + d.value, 0);

function formatM(val: number) {
  return val + 'tr ₫';
}

function CustomTooltipBar({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl p-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid #F0F2F5' }}>
        <p style={{ fontWeight: 600, fontSize: 13, color: '#1A2332', marginBottom: 6 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name}: {p.value}tr ₫
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function Statistics() {
  const [timePeriod, setTimePeriod] = useState<'month' | 'quarter' | 'year'>('year');
  const periods = [
    { id: 'month' as const, label: 'Tháng' },
    { id: 'quarter' as const, label: 'Quý' },
    { id: 'year' as const, label: 'Năm' },
  ];

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
          <option>2025</option>
          <option>2024</option>
        </select>
        <select
          className="px-3 py-2 rounded-xl border outline-none"
          style={{ borderColor: '#E8EBF0', fontSize: 13, color: '#5A6A7A', backgroundColor: 'white' }}
        >
          <option>Tất cả ví</option>
          <option>Ví tiền mặt</option>
          <option>TPBank</option>
          <option>Thẻ Visa</option>
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
                Thu vào vs Chi ra — 12 tháng qua
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
              <BarChart data={monthlyData} barGap={2} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} unit="tr" />
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
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C896" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8A9AB0' }} axisLine={false} tickLine={false} unit="tr" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #F0F2F5', fontSize: 12 }}
                  formatter={(val: number) => [`${val}tr ₫`, 'Tiết kiệm']}
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
                      {Math.round((cat.value / totalSpend) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget alerts */}
          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F0F2F5' }}
          >
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 16, color: '#1A2332', marginBottom: 14 }}>
              Ngân sách tháng này
            </h3>
            <div className="space-y-4">
              {budgets.map((b) => {
                const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
                return (
                  <div key={b.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{b.category}</span>
                        {b.over && (
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
                        {b.spent.toLocaleString('vi-VN')} / {b.limit.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F0F2F5' }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: b.color,
                        }}
                      />
                    </div>
                    <div className="flex justify-end mt-1">
                      <span style={{ fontSize: 11, color: b.over ? '#FF5C5C' : '#8A9AB0', fontWeight: b.over ? 600 : 400 }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
