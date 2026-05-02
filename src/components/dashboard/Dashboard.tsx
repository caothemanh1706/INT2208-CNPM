import { TotalBalance } from './TotalBalance';
import { IncomeExpenseCharts } from './IncomeExpenseCharts';
import { RecentRecords } from './RecentRecords';
import { NoteCard } from './NoteCard';

interface DashboardProps {
  transactions: any[];
  balance: number;
}

export function Dashboard({ transactions, balance }: DashboardProps) {
  return (
    <div className="h-full flex flex-col min-h-0">
      <h1 className="text-2xl font-bold text-slate-900 mb-4 hidden lg:block">Trang chủ</h1>
      
      <div className="flex flex-col xl:flex-row gap-4 flex-1 min-h-0">
        {/* Left Column */}
        <div className="flex flex-col xl:w-2/5 flex-shrink-0 gap-4 h-full min-h-0">
          <TotalBalance balance={balance} />
          <div className="flex-1 min-h-0 flex flex-col">
            <RecentRecords transactions={transactions} />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col xl:w-3/5 flex-grow gap-4 h-full min-h-0">
          <div className="flex-1 min-h-0 flex flex-col">
            <IncomeExpenseCharts transactions={transactions} />
          </div>
          <NoteCard />
        </div>
      </div>
    </div>
  );
}
