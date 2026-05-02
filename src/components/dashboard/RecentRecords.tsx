import { Card } from '../ui/Card';

export function RecentRecords({ transactions = [] }: { transactions?: any[] }) {

  const displayRecords = transactions.slice(0, 10);

  return (
    <Card className="p-4 rounded-xl shadow-sm border-slate-100 flex-1 flex flex-col min-h-0">
      <h2 className="text-[17px] font-bold text-slate-800 mb-4">Ghi chép gần đây</h2>
      
      <div className="border border-slate-200 rounded-xl p-2 flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="flex flex-col gap-1">
          {displayRecords.map((record: any, index) => {
            const isIncome = record.type === 'income';
            const amountStr = record.amount ? `${isIncome ? '+' : '-'}${record.amount.toLocaleString()} đ` : record.amount; // handle both DB and dummy shape
            
            return (
              <div key={record.id || index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: record.iconBg || (isIncome ? '#dcfce7' : '#fef3c7') }}
                  >
                    <img src={`https://api.dicebear.com/7.x/icons/svg?seed=${record.category || record.icon || 'default'}&backgroundColor=transparent`} alt="icon" className="w-6 h-6 opacity-70" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{record.category || record.name || 'Giao dịch'}</p>
                    <p className="text-xs text-slate-500">{record.description || record.subtext || 'Thêm mới'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${isIncome ? 'text-green-600' : 'text-slate-800'}`}>{amountStr}</p>
                  <p className="text-xs text-slate-500">{record.account || record.wallet}</p>
                </div>
              </div>
            );
          })}
          {displayRecords.length === 0 && (
            <div className="p-4 text-center text-slate-500">Chưa có ghi chép nào.</div>
          )}
        </div>
      </div>
    </Card>
  );
}
