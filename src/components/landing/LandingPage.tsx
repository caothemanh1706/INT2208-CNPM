import { useState, useEffect } from 'react';
import {
  Play,
  ArrowRight,
  Shield,
  BarChart3,
  PieChart as PieChartIcon,
  Cloud,
  CheckCircle2,
  Wallet,
  Menu,
  X,
  CreditCard,
  Globe,
  Share2,
  Search,
  Bell
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

const features = [
  {
    icon: Wallet,
    title: 'Expense Tracking',
    desc: 'Record and organize all your daily transactions easily.',
  },
  {
    icon: CreditCard,
    title: 'Budget Planning',
    desc: 'Set spending limits and manage your monthly budget effectively.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'Visualize your finances using interactive charts and reports.',
  },
  {
    icon: Cloud,
    title: 'Secure Cloud Sync',
    desc: 'Access your financial data safely across all devices.',
  },
];

const benefitCards = [
  {
    title: 'Save time managing finances',
    desc: 'Automate tracking and focus on what really matters in your life.',
  },
  {
    title: 'Control spending habits',
    desc: 'Identify where your money goes and cut unnecessary costs instantly.',
  },
  {
    title: 'Improve personal budgeting',
    desc: 'Build better financial habits with smart, guided suggestions.',
  },
  {
    title: 'Reach saving goals faster',
    desc: 'Track your progress and stay motivated with visual milestones.',
  },
];

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {/* Logo removed */}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Product</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Resources</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Community</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <div className="flex items-center gap-4">
                <button onClick={onLogin} className="text-sm font-medium text-gray-600 hover:text-blue-600">Login</button>
                <button 
                  onClick={onGetStarted}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4">
            <a href="#" className="block text-base font-medium text-gray-600">Product</a>
            <a href="#" className="block text-base font-medium text-gray-600">Resources</a>
            <a href="#" className="block text-base font-medium text-gray-600">Community</a>
            <button 
              onClick={onGetStarted}
              className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl text-base font-semibold"
            >
              Manage Now
            </button>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-visible">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#1A1A1A] mb-4 leading-[1.1]">
                Manage Your Expenses <br />
                <span className="text-blue-600">Smarter and Easier</span>
              </h1>
              <p className="max-w-lg text-lg text-gray-500 mb-8 leading-relaxed">
                Track income, expenses, budgets, and financial goals with powerful analytics and beautiful visual reports.
              </p>

              <div className="flex items-center gap-6">
                <button 
                  onClick={onGetStarted}
                  className="px-8 py-3 bg-[#5c93c4] text-white rounded-lg font-semibold text-lg hover:bg-[#4a7aa6] transition-all shadow-lg active:scale-95"
                >
                  Sign up
                </button>
                <button className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A] hover:text-blue-600 transition-colors group">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Play className="w-4 h-4 fill-current text-gray-600 group-hover:text-blue-600" />
                  </div>
                  How It Works
                </button>
              </div>
            </div>
          </div>

          {/* Floating UI Elements Section */}
          <div className="flex-1 relative min-h-[500px] w-full">
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-50 rounded-full -z-10" />
            
            {/* Decorative Dots */}
            <div className="absolute top-10 right-20 w-12 h-12 bg-blue-100 rounded-full opacity-60" />
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-40" />
            <div className="absolute -top-10 left-1/2 w-20 h-20 bg-blue-50 rounded-full opacity-80" />

            {/* Total Balance Card */}
            <div className="absolute top-0 right-0 w-[240px] bg-white rounded-2xl shadow-xl p-6 z-20 animate-float">
              <div className="flex gap-1 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div className="w-2 h-2 rounded-full bg-blue-200" />
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-[#1A1A1A] mb-6">$4,637.00</p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Brie&backgroundColor=transparent" 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full bg-yellow-100" 
                />
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">Brie Larson</p>
                  <p className="text-[10px] text-gray-400">UI Designer</p>
                </div>
              </div>
            </div>

            {/* Monthly Income Card */}
            <div className="absolute bottom-20 left-0 w-[220px] bg-white rounded-2xl shadow-lg p-5 z-30 animate-float-delayed">
              <p className="text-xs font-bold text-[#1A1A1A] mb-4">Monthly Income</p>
              <div className="relative h-24 flex items-end gap-1">
                {[40, 60, 45, 75, 55, 85, 65].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-100 rounded-t-sm relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }} />
                    {i === 5 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] py-1 px-2 rounded whitespace-nowrap z-10">
                        85%
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[8px] text-gray-300">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>

            {/* Weekly Spend Card */}
            <div className="absolute bottom-0 right-10 w-[200px] bg-white rounded-2xl shadow-lg p-5 z-10 animate-float">
              <p className="text-xs font-bold text-[#1A1A1A] mb-4">Weekly Spend</p>
              <div className="flex items-end gap-2 h-20">
                {[60, 90, 70, 85, 50, 75, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500 rounded-sm" style={{ height: `${h}%`, opacity: (i + 3) / 10 }} />
                ))}
              </div>
            </div>

            {/* Pie Chart Card */}
            <div className="absolute -top-10 right-[250px] w-20 h-20 bg-white rounded-2xl shadow-lg p-3 z-10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-[6px] border-blue-100 border-t-blue-500 border-r-blue-400 rotate-45" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section className="py-24 bg-white max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
            Powerful Features for Smarter Finances
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed px-4">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- Dashboard Preview Section --- */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">
            Beautiful and Intuitive Financial Dashboard
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed">
            Everything you need to master your money in one central location. No more spreadsheets, no more manual math.
          </p>
        </div>
      </section>

      {/* --- Benefit Cards --- */}
      <section className="py-24 bg-white max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefitCards.map((card, i) => (
            <div key={i} className="p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group">
              <h4 className="text-base font-bold text-[#1A1A1A] mb-4 leading-snug group-hover:text-blue-700">{card.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-10">How It Works</p>
          <div className="flex items-center justify-center gap-16">
            {[1, 2, 3].map(step => (
              <div key={step} className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section (Match Screenshot 1) --- */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[40px] py-20 px-8 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Managing Your Finances Today</h2>
          <p className="max-w-2xl mx-auto text-blue-100 mb-10 text-lg">
            Take control of your money with smart tracking and visual analytics. Join over 50,000+ users worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl active:scale-95"
            >
              Create Free Account
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-400 transition-all border border-blue-400/30">
              Login
            </button>
          </div>
        </div>
      </section>

      {/* --- Footer (Match Screenshot 1) --- */}
      <footer className="py-20 px-4 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              {/* Logo removed */}
            </div>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Making personal finance simple, visual, and effective for everyone, everywhere.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold text-[#1A1A1A] mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#1A1A1A] mb-6">Legal</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#1A1A1A] mb-6">Connect</h5>
            <div className="flex items-center gap-4 mb-10">
              <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Globe className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400">© 2024 Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* --- Custom CSS for Float Animation --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
