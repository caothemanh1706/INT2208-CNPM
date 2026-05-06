import { useState, useEffect } from 'react';
import { MoreHorizontal, Calendar, Plus, X, TrendingUp, CheckCircle2, Trash2, Clock, Target, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { notificationService } from '../../lib/notifications';
import { auth } from '../../lib/auth';

interface Goal {
  id: number;
  icon: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  color: string;
  advice: string;
}

const initialGoals: Goal[] = [];

function getProgressColor(pct: number) {
  if (pct >= 100) return '#10B981'; // Xanh ngọc bảo (Hoàn thành xuất sắc)
  if (pct >= 75) return '#22C55E';  // Xanh lá sáng (Sắp cán đích)
  if (pct >= 50) return '#3B82F6';  // Xanh dương (Vượt qua một nửa)
  if (pct >= 25) return '#FF9F43';  // Vàng cam (Đang tiến triển)
  return '#FF5C5C';                 // Đỏ ấm (Mới bắt đầu)
}

function GoalCard({ goal, onFund, onDetail }: { goal: Goal; onFund: (id: number) => void; onDetail: (goal: Goal) => void }) {
  const { c, isDark } = useTheme();
  const { formatCurrency, formatDate, language } = useLanguage();
  const pct = Math.round((goal.saved / goal.target) * 100);
  const progressColor = getProgressColor(pct);

  let adviceText = goal.advice;
  if (goal.advice === 'Hãy bắt đầu tiết kiệm đều đặn mỗi tháng!') {
    adviceText = language === 'en' 
      ? 'Start saving regularly every month!' 
      : language === 'zh'
      ? '开始每个月规律地储蓄吧！'
      : 'Hãy bắt đầu tiết kiệm đều đặn mỗi tháng!';
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-colors duration-300"
      style={{ backgroundColor: c.card, boxShadow: c.cardShadow, border: `1px solid ${c.cardBorder}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: goal.color + '20' }}
        >
          <span style={{ fontSize: 28 }}>{goal.icon}</span>
        </div>
        <button
          onClick={() => onDetail(goal)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 cursor-pointer"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <MoreHorizontal size={18} color={c.textMuted} />
        </button>
      </div>

      {/* Name */}
      <div>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 17, color: c.text, marginBottom: 6 }}>
          {goal.name}
        </h3>
        <p style={{ fontSize: 12, color: c.textMuted }}>
          {language === 'en' ? 'Target:' : language === 'zh' ? '目标金额:' : 'Mục tiêu:'} <span style={{ fontWeight: 600, color: c.textSub }}>{formatCurrency(goal.target)}</span>
        </p>
        <p style={{ fontSize: 12, color: c.green, fontWeight: 600, marginTop: 2 }}>
          {language === 'en' ? 'Saved:' : language === 'zh' ? '已蓄金额:' : 'Đã tiết kiệm:'} {formatCurrency(goal.saved)}
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span style={{ fontSize: 11, color: c.textMuted }}>
            {language === 'en' ? 'Progress' : language === 'zh' ? '累计进度' : 'Tiến độ'}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: progressColor }}>{pct}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full transition-colors duration-300" style={{ backgroundColor: c.input }}>
          <div
            className="h-2.5 rounded-full transition-all"
            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: progressColor }}
          />
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2">
        <Calendar size={14} color={c.textMuted} />
        <span style={{ fontSize: 12, color: c.textMuted }}>
          {language === 'en' ? 'Deadline:' : language === 'zh' ? '截止期限:' : 'Hạn:'} {formatDate(goal.deadline)}
        </span>
      </div>

      {/* Advice */}
      <div
        className="px-3 py-2.5 rounded-xl transition-colors duration-300"
        style={{
          backgroundColor: pct >= 100 
            ? (isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5') 
            : (isDark ? 'rgba(75, 158, 255, 0.1)' : '#EFF6FF'),
          border: `1px solid ${pct >= 100 
            ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5') 
            : (isDark ? 'rgba(75, 158, 255, 0.2)' : '#DBEAFE')}`,
        }}
      >
        <p style={{ 
          fontSize: 12, 
          color: pct >= 100 
            ? (isDark ? '#34D399' : '#047857') 
            : (isDark ? '#60A5FA' : '#1D4ED8'), 
          lineHeight: 1.5,
          fontWeight: pct >= 100 ? 600 : 400
        }}>
          {pct >= 100 
            ? (language === 'en' ? '🎉 You have successfully completed this goal!' : language === 'zh' ? '🎉 恭喜您，已圆满达成此储蓄目标！' : '🎉 Hoàn thành mục tiêu') 
            : `💡 ${adviceText}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onFund(goal.id)}
          className="flex-1 py-2.5 rounded-xl transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: c.green, color: 'white', fontSize: 13, fontWeight: 600 }}
        >
          {language === 'en' ? 'Fund' : language === 'zh' ? '存入资金' : 'Nạp tiền'}
        </button>
        <button
          onClick={() => onDetail(goal)}
          className="flex-1 py-2.5 rounded-xl border transition-colors duration-300 cursor-pointer"
          style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 13, fontWeight: 600, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {language === 'en' ? 'Detail' : language === 'zh' ? '详细' : 'Chi tiết'}
        </button>
      </div>
    </div>
  );
}

export function Goals() {
  const { c, isDark } = useTheme();
  const { formatCurrency, formatDate, t, language } = useLanguage();
  
  const currentUser = auth.getUser();
  const userKey = currentUser ? currentUser.username : 'global';
  const goalsKey = `finwise_goals_${userKey}`;
  
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(goalsKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(goalsKey, JSON.stringify(goals));
  }, [goals, goalsKey]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [fundModal, setFundModal] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', icon: '🎯' });
  const [detailGoal, setDetailGoal] = useState<Goal | null>(null);

  const handleDeleteGoal = (id: number) => {
    const confirmMsg = language === 'en' 
      ? 'Are you sure you want to delete this goal? This action cannot be undone.' 
      : language === 'zh'
      ? '您确定要删除此储蓄目标吗？该操作无法撤销。' 
      : 'Bạn có chắc chắn muốn xóa mục tiêu này không? Hành động này không thể hoàn tác.';
    if (confirm(confirmMsg)) {
      const targetGoal = goals.find(g => g.id === id);
      const filtered = goals.filter(g => g.id !== id);
      setGoals(filtered);
      if (targetGoal) {
        const notifyMsg = language === 'en' 
          ? `Goal: Savings goal "${targetGoal.name}" deleted.` 
          : language === 'zh'
          ? `目标: 已删除储蓄目标 "${targetGoal.name}"。` 
          : `Mục tiêu: Đã xóa mục tiêu tiết kiệm "${targetGoal.name}".`;
        notificationService.add(notifyMsg);
      }
      setDetailGoal(null);
    }
  };

  const formatInputCurrency = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return '';
    return Number(clean).toLocaleString('vi-VN');
  };

  const handleFund = (id: number) => {
    setFundModal(id);
    setFundAmount('');
  };

  const confirmFund = () => {
    if (!fundAmount || !fundModal) return;
    const targetGoal = goals.find(g => g.id === fundModal);
    if (!targetGoal) return;
    const cleanAmount = fundAmount.replace(/\D/g, '');
    const fundVal = parseInt(cleanAmount) || 0;
    setGoals(goals.map(g =>
      g.id === fundModal
        ? { ...g, saved: Math.min(g.target, g.saved + fundVal) }
        : g
    ));

    const formattedFundVal = formatCurrency(fundVal);
    const notifyMsg = language === 'en'
      ? `Goal: Added ${formattedFundVal} to your "${targetGoal.name}" savings goal.`
      : language === 'zh'
      ? `目标: 已成功向 "${targetGoal.name}" 目标追加存入资金 ${formattedFundVal}。`
      : `Mục tiêu: Đã tích lũy thêm ${fundVal.toLocaleString('vi-VN')} ₫ vào mục tiêu "${targetGoal.name}".`;
    
    notificationService.add(notifyMsg);
    setFundModal(null);
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    const cleanTarget = newGoal.target.replace(/\D/g, '');
    const goalVal = parseInt(cleanTarget) || 0;
    const goal: Goal = {
      id: Date.now(),
      icon: newGoal.icon,
      name: newGoal.name,
      target: goalVal,
      saved: 0,
      deadline: newGoal.deadline || '2026-12-31',
      color: '#4B9EFF',
      advice: 'Hãy bắt đầu tiết kiệm đều đặn mỗi tháng!',
    };
    setGoals([...goals, goal]);

    const formattedGoalVal = formatCurrency(goalVal);
    const notifyMsg = language === 'en'
      ? `Goal: Created new savings goal "${newGoal.name}" with a target of ${formattedGoalVal}.`
      : language === 'zh'
      ? `目标: 成功创建新储蓄目标 "${newGoal.name}"，目标金额为 ${formattedGoalVal}。`
      : `Mục tiêu: Khởi tạo mục tiêu mới "${newGoal.name}" với đích đến ${goalVal.toLocaleString('vi-VN')} ₫.`;

    notificationService.add(notifyMsg);
    setShowNewModal(false);
    setNewGoal({ name: '', target: '', deadline: '', icon: '🎯' });
  };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-6">
        <p style={{ fontSize: 14, color: c.textMuted }}>
          {language === 'en' 
            ? `${goals.length} active goals` 
            : language === 'zh' 
            ? `${goals.length} 个进行中的目标` 
            : `${goals.length} mục tiêu đang theo dõi`}
        </p>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
        >
          <Plus size={18} />
          {language === 'en' ? 'Create new goal' : language === 'zh' ? '新增储蓄目标' : 'Tạo mục tiêu mới'}
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-3 gap-5">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onFund={handleFund} onDetail={setDetailGoal} />
        ))}
      </div>

      {/* Fund Modal */}
      {fundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: isDark ? 'rgba(10,18,28,0.65)' : 'rgba(15,25,35,0.5)' }}>
          <div className="rounded-2xl p-6 transition-colors duration-300" style={{ backgroundColor: c.card, width: 380, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: c.text }}>
                {language === 'en' ? 'Fund Savings Goal' : language === 'zh' ? '追加目标储蓄资金' : 'Nạp tiền vào mục tiêu'}
              </h3>
              <button onClick={() => setFundModal(null)} className="cursor-pointer">
                <X size={20} color={c.textMuted} />
              </button>
            </div>
            <p style={{ fontSize: 14, color: c.textMuted, marginBottom: 16 }}>
              {goals.find(g => g.id === fundModal)?.name}
            </p>
            <input
              type="text"
              value={fundAmount}
              onChange={(e) => setFundAmount(formatInputCurrency(e.target.value))}
              placeholder={language === 'en' ? 'Amount' : language === 'zh' ? '存入金额' : 'Số tiền (VNĐ)'}
              className="w-full px-4 py-3 rounded-xl border outline-none mb-4 transition-colors duration-300"
              style={{ borderColor: c.inputBorder, fontSize: 15, color: c.text, backgroundColor: c.input }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setFundModal(null)}
                className="flex-1 py-3 rounded-xl border transition-colors duration-300 cursor-pointer"
                style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600, backgroundColor: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {language === 'en' ? 'Cancel' : language === 'zh' ? '取消' : 'Hủy'}
              </button>
              <button
                onClick={confirmFund}
                className="flex-1 py-3 rounded-xl transition-all cursor-pointer"
                style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
              >
                {language === 'en' ? 'Confirm' : language === 'zh' ? '确认' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: isDark ? 'rgba(10,18,28,0.65)' : 'rgba(15,25,35,0.5)' }}>
          <div className="rounded-2xl p-6 transition-colors duration-300" style={{ backgroundColor: c.card, width: 420, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div className="flex justify-between items-center mb-5">
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: c.text }}>
                {language === 'en' ? 'Create New Goal' : language === 'zh' ? '新增储蓄目标' : 'Tạo mục tiêu mới'}
              </h3>
              <button onClick={() => setShowNewModal(false)} className="cursor-pointer">
                <X size={20} color={c.textMuted} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
                  {language === 'en' ? 'Icon' : language === 'zh' ? '目标图标' : 'Biểu tượng'}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['🎯', '🏍️', '✈️', '🏠', '🚗', '🎓', '💍', '🏦', '📱', '🏋️'].map(e => (
                    <button
                      key={e}
                      onClick={() => setNewGoal({ ...newGoal, icon: e })}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer"
                      style={{
                        borderColor: newGoal.icon === e ? c.green : 'transparent',
                        backgroundColor: newGoal.icon === e ? c.greenBg : c.input,
                        fontSize: 20,
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
                  {language === 'en' ? 'Goal Name' : language === 'zh' ? '目标名称' : 'Tên mục tiêu'}
                </label>
                <input
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder={language === 'en' ? 'e.g., Buy a motorcycle' : language === 'zh' ? '例：买新摩托车' : 'VD: Mua xe máy'}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
                  {language === 'en' ? 'Target Amount' : language === 'zh' ? '目标金额' : 'Số tiền mục tiêu (₫)'}
                </label>
                <input
                  type="text"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: formatInputCurrency(e.target.value) })}
                  placeholder={language === 'en' ? 'e.g., 50,000,000' : language === 'zh' ? '例：50,000,000' : 'VD: 50.000.000'}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>
                  {language === 'en' ? 'Deadline' : language === 'zh' ? '截止日期' : 'Hạn chót'}
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-3 rounded-xl border transition-colors duration-300 cursor-pointer"
                  style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {language === 'en' ? 'Cancel' : language === 'zh' ? '取消' : 'Hủy'}
                </button>
                <button
                  onClick={addGoal}
                  className="flex-1 py-3 rounded-xl transition-all cursor-pointer"
                  style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
                >
                  {language === 'en' ? 'Create Goal' : language === 'zh' ? '确定创建' : 'Tạo mục tiêu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Goal Modal */}
      {detailGoal && (() => {
        const pct = Math.round((detailGoal.saved / detailGoal.target) * 100);
        const progressColor = getProgressColor(pct);
        
        // Calculate remaining time
        const getRemainingDays = (deadlineStr: string) => {
          let deadlineDate: Date;
          if (deadlineStr.includes('-')) {
            deadlineDate = new Date(deadlineStr);
          } else {
            const parts = deadlineStr.split('/');
            if (parts.length === 3) {
              deadlineDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            } else {
              deadlineDate = new Date();
            }
          }
          const diffTime = deadlineDate.getTime() - new Date().getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 ? diffDays : 0;
        };

        const daysLeft = getRemainingDays(detailGoal.deadline);
        const amountLeft = Math.max(0, detailGoal.target - detailGoal.saved);
        
        const dailySavings = daysLeft > 0 ? Math.ceil(amountLeft / daysLeft) : 0;
        const monthlySavings = daysLeft > 30 ? Math.ceil((amountLeft / daysLeft) * 30) : amountLeft;

        // Milestones
        const milestones = [
          { label: language === 'en' ? 'Starter (25%)' : language === 'zh' ? '起跑线 (25%)' : 'Khởi đầu (25%)', targetVal: detailGoal.target * 0.25 },
          { label: language === 'en' ? 'Halfway (50%)' : language === 'zh' ? '半程碑 (50%)' : 'Nửa chặng đường (50%)', targetVal: detailGoal.target * 0.5 },
          { label: language === 'en' ? 'Sprint (75%)' : language === 'zh' ? '冲刺线 (75%)' : 'Bứt phá (75%)', targetVal: detailGoal.target * 0.75 },
          { label: language === 'en' ? 'Completed (100%)' : language === 'zh' ? '圆满达成 (100%)' : 'Hoàn thành (100%)', targetVal: detailGoal.target }
        ];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: isDark ? 'rgba(10,18,28,0.7)' : 'rgba(15,25,35,0.55)', backdropFilter: 'blur(8px)' }}>
            <div className="rounded-2xl p-6 transition-all duration-300 scale-100 space-y-6" style={{ backgroundColor: c.card, width: 520, boxShadow: '0 24px 48px rgba(0,0,0,0.3)', border: `1px solid ${c.cardBorder}` }}>
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: progressColor + '20' }}>
                    <span style={{ fontSize: 32 }}>{detailGoal.icon}</span>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 20, color: c.text, marginBottom: 4 }}>
                      {detailGoal.name}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: progressColor + '15', color: progressColor }}>
                      {pct >= 100 
                        ? (language === 'en' ? '🎉 Completed' : language === 'zh' ? '🎉 已圆满达成' : '🎉 Đã hoàn thành') 
                        : (language === 'en' ? `📈 In progress (${pct}%)` : language === 'zh' ? `📈 存钱中 (${pct}%)` : `📈 Đang thực hiện (${pct}%)`)}
                    </span>
                  </div>
                </div>
                <button onClick={() => setDetailGoal(null)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer" style={{ backgroundColor: c.input }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.rowHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.input}>
                  <X size={18} color={c.textMuted} />
                </button>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border transition-colors duration-300" style={{ borderColor: c.divider, backgroundColor: c.input }}>
                  <span style={{ fontSize: 11, color: c.textMuted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {language === 'en' ? 'Original Target' : language === 'zh' ? '原定目标金额' : 'Mục tiêu ban đầu'}
                  </span>
                  <p style={{ fontSize: 18, fontWeight: 700, color: c.text, marginTop: 4 }}>{formatCurrency(detailGoal.target)}</p>
                </div>
                <div className="p-4 rounded-xl border transition-colors duration-300" style={{ borderColor: c.divider, backgroundColor: c.input }}>
                  <span style={{ fontSize: 11, color: c.textMuted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {language === 'en' ? 'Saved' : language === 'zh' ? '已蓄金额' : 'Đã tích lũy'}
                  </span>
                  <p style={{ fontSize: 18, fontWeight: 700, color: c.green, marginTop: 4 }}>{formatCurrency(detailGoal.saved)}</p>
                </div>
                <div className="p-4 rounded-xl border transition-colors duration-300" style={{ borderColor: c.divider, backgroundColor: c.input }}>
                  <span style={{ fontSize: 11, color: c.textMuted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {language === 'en' ? 'Remaining' : language === 'zh' ? '尚需金额' : 'Còn thiếu'}
                  </span>
                  <p style={{ fontSize: 18, fontWeight: 700, color: amountLeft > 0 ? '#FF5C5C' : c.green, marginTop: 4 }}>
                    {amountLeft === 0 ? formatCurrency(0) : formatCurrency(amountLeft)}
                  </p>
                </div>
                <div className="p-4 rounded-xl border transition-colors duration-300" style={{ borderColor: c.divider, backgroundColor: c.input }}>
                  <span style={{ fontSize: 11, color: c.textMuted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {language === 'en' ? 'Goal Deadline' : language === 'zh' ? '计划截止日期' : 'Thời hạn mục tiêu'}
                  </span>
                  <p style={{ fontSize: 15, fontWeight: 700, color: c.text, marginTop: 6 }} className="flex items-center gap-1.5">
                    <Clock size={15} color={c.textMuted} />
                    {formatDate(detailGoal.deadline)}
                  </p>
                  <p style={{ fontSize: 11, color: '#FF9F43', fontWeight: 600, marginTop: 2 }}>
                    {daysLeft > 0 
                      ? (language === 'en' ? `${daysLeft} days left` : language === 'zh' ? `还剩 ${daysLeft} 天` : `Còn lại ${daysLeft} ngày`) 
                      : (language === 'en' ? 'Overdue' : language === 'zh' ? '已逾期' : 'Đã quá hạn chót')}
                  </p>
                </div>
              </div>

              {/* Smart AI analysis & Saving Plan */}
              {amountLeft > 0 && daysLeft > 0 && (
                <div className="p-4 rounded-xl border-2 space-y-3 transition-colors duration-300" style={{ borderColor: '#4B9EFF20', backgroundColor: '#4B9EFF05' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#60A5FA' : '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="flex items-center gap-2">
                    <TrendingUp size={16} /> {language === 'en' ? 'Recommended savings roadmap' : language === 'zh' ? '推荐的智能储蓄规划' : 'Lộ trình tích lũy khuyên dùng'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <span style={{ fontSize: 11, color: c.textMuted }}>
                        {language === 'en' ? 'Required daily savings' : language === 'zh' ? '每日建议存入' : 'Số tiền cần góp hàng ngày'}
                      </span>
                      <p style={{ fontSize: 15, fontWeight: 700, color: c.text, marginTop: 2 }}>{formatCurrency(dailySavings)} / {language === 'en' ? 'day' : language === 'zh' ? '天' : 'ngày'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: c.textMuted }}>
                        {language === 'en' ? 'Required monthly savings' : language === 'zh' ? '每月建议存入' : 'Số tiền cần góp hàng tháng'}
                      </span>
                      <p style={{ fontSize: 15, fontWeight: 700, color: c.text, marginTop: 2 }}>{formatCurrency(monthlySavings)} / {language === 'en' ? 'month' : language === 'zh' ? '月' : 'tháng'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Saving Milestones */}
              <div className="space-y-3">
                <h4 style={{ fontSize: 12, fontWeight: 700, color: c.textSub, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {language === 'en' ? 'Saving milestones progress' : language === 'zh' ? '目标阶段性里程碑' : 'Cột mốc tiến trình mục tiêu'}
                </h4>
                <div className="space-y-2.5">
                  {milestones.map((ms, idx) => {
                    const isCompleted = detailGoal.saved >= ms.targetVal;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border transition-all" style={{ borderColor: isCompleted ? c.green + '30' : c.divider, backgroundColor: isCompleted ? c.green + '05' : 'transparent' }}>
                        <div className="flex items-center gap-2.5">
                          {isCompleted ? (
                            <CheckCircle2 size={16} color={c.green} className="flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: c.textMuted }} />
                          )}
                          <span style={{ fontSize: 13, fontWeight: 500, color: isCompleted ? c.text : c.textMuted }}>{ms.label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: isCompleted ? c.green : c.textMuted }}>
                          {formatCurrency(ms.targetVal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleDeleteGoal(detailGoal.id)}
                  className="px-4 py-3 rounded-xl border transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ borderColor: c.red + '40', color: c.red, fontSize: 14, fontWeight: 600, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.redBg}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={16} />
                  {language === 'en' ? 'Delete Goal' : language === 'zh' ? '删除此目标' : 'Xóa mục tiêu'}
                </button>
                <button
                  onClick={() => setDetailGoal(null)}
                  className="flex-1 py-3 rounded-xl cursor-pointer"
                  style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
                >
                  {language === 'en' ? 'Close' : language === 'zh' ? '关闭详情' : 'Đóng chi tiết'}
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
