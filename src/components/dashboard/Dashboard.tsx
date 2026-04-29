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
    <>
      <h1 className="text-3xl font-bold text-slate-900 mb-8 hidden lg:block">Trang chủ</h1>
      
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column */}
        <div className="flex flex-col xl:w-2/5 flex-shrink-0">
          <TotalBalance balance={balance} />
          <RecentRecords transactions={transactions} />
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col xl:w-3/5 flex-grow">
          <IncomeExpenseCharts transactions={transactions} />
          <NoteCard />
        </div>
      </div>
    </>
  );
}
