import { Card } from '../ui/Card';
import { chartDataIncome as dummyIncome, chartDataExpense as dummyExpense } from '../../data/dummy';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#60a5fa', '#86efac', '#fca5a5', '#fcd34d', '#c084fc', '#f472b6', '#38bdf8'];

function aggregateData(transactions: any[], type: string) {
  const filtered = transactions.filter(t => t.type === type);
  if (filtered.length === 0) return null; // Use fallback if empty
  
  const grouped: Record<string, number> = {};
  filtered.forEach(t => {
    const cat = t.category || 'Khác';
    grouped[cat] = (grouped[cat] || 0) + t.amount;
  });

  return Object.entries(grouped).map(([name, value], idx) => ({
    name,
    value,
    fill: COLORS[idx % COLORS.length]
  }));
}

function ChartWithLegend({ title, data, centerSubtext }: any) {
  return (
    <div className="flex-1 min-w-[200px] border border-slate-100 rounded-xl p-5 flex flex-col shadow-sm">
      <h3 className="font-semibold text-[15px] text-slate-800 mb-6">{title}</h3>
      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-bold text-xl text-slate-700">{data.length}</span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">{centerSubtext}</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2.5">
        {data.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
              <span className="text-[12px] text-slate-400 truncate max-w-[100px]" title={item.name}>{item.name}</span>
            </div>
            <span className="text-[12px] font-bold text-slate-700">
              {item.value.toLocaleString('en-US')} đ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IncomeExpenseCharts({ transactions = [] }: { transactions?: any[] }) {
  const incomeData = aggregateData(transactions, 'income') || dummyIncome;
  const expenseData = aggregateData(transactions, 'expense') || dummyExpense;
  
  const totalIncome = incomeData.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpense = expenseData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="p-6 rounded-2xl mb-6 shadow-sm border-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[17px] font-bold text-slate-800">Tình hình thu chi</h2>
        <div className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-1.5">
          <span className="text-slate-500">Thời gian:</span>
          <select className="bg-transparent font-medium text-slate-700 focus:outline-none">
            <option>tháng này</option>
          </select>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <ChartWithLegend 
          title="Thu tiền" 
          data={incomeData} 
          centerSubtext={`${totalIncome.toLocaleString()} đ`} 
        />
        <ChartWithLegend 
          title="Chi tiền" 
          data={expenseData} 
          centerSubtext={`${totalExpense.toLocaleString()} đ`} 
        />
      </div>
    </Card>
  );
}
