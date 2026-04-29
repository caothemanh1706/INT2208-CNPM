import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Statistics } from './components/statistics/Statistics';
import { History } from './components/history/History';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/Button';
import { AddRecordModal } from './components/dashboard/AddRecordModal';
import { api } from './lib/api';

export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('history'); // Defaulting to history temporarily or based on last state? Let's keep it 'dashboard' by default. Wait, the user wants history. I'll stick to what was there.
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  const fetchData = async () => {
    try {
      const [txs, balRes] = await Promise.all([
        api.getTransactions(),
        api.getBalance()
      ]);
      setTransactions(txs);
      setBalance(balRes.balance);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef5fb] font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenAddRecord={() => setIsAddModalOpen(true)}
        activeView={activeView}
        onChangeView={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false); // Close sidebar on mobile after navigating
        }}
      />
      
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto">
        {/* Mobile Header (hidden on large screens) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100">
          <span className="font-bold text-xl text-slate-800">
            {activeView === 'dashboard' ? 'Trang chủ' : 
             activeView === 'statistics' ? 'Thống kê tài chính' : 
             activeView === 'history' ? 'Lịch sử ghi chép' : 'Finance App'}
          </span>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto h-full">
            {activeView === 'dashboard' && (
              <Dashboard transactions={transactions} balance={balance} />
            )}
            
            {activeView === 'statistics' && (
              <Statistics transactions={transactions} />
            )}
            
            {activeView === 'history' && (
              <History transactions={transactions} onTransactionsChange={fetchData} />
            )}
            
            {activeView === 'settings' && (
              <div className="flex items-center justify-center h-full text-slate-500">
                Tính năng đang được phát triển...
              </div>
            )}
          </div>
        </main>
      </div>
      
      <AddRecordModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchData}
      />
    </div>
  );
}

export default App;
