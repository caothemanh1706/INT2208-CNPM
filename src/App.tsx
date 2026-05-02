import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Statistics } from './components/statistics/Statistics';
import { History } from './components/history/History';
import { Settings } from './components/settings/Settings';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { Menu } from 'lucide-react';
import { Button } from './components/ui/Button';
import { AddRecordModal } from './components/dashboard/AddRecordModal';
import { api } from './lib/api';
import { auth } from './lib/auth';

export function App() {
  const [user, setUser] = useState<any>(auth.getUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  const fetchData = async () => {
    if (!user) return;
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
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    setActiveView('dashboard');
  };

  const openLogin = () => {
    setAuthView('login');
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthView('signup');
    setIsAuthModalOpen(true);
  };

  // Show landing page if not logged in
  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={openSignUp} onLogin={openLogin} />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          initialView={authView}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef5fb] font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenAddRecord={() => setIsAddModalOpen(true)}
        activeView={activeView}
        onChangeView={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false); 
        }}
        onLogout={handleLogout}
        user={user}
      />
      
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto">
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

        <main className="flex-1 p-3 lg:p-5 overflow-hidden">
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
              <Settings />
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
