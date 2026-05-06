import { useState } from 'react';
import { MoreHorizontal, Calendar, Plus, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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

const initialGoals: Goal[] = [
  {
    id: 1,
    icon: '🏍️',
    name: 'Mua xe máy',
    target: 50000000,
    saved: 32000000,
    deadline: '31/12/2025',
    color: '#00C896',
    advice: 'Cần nạp thêm ~3,000,000 ₫/tháng để đạt mục tiêu',
  },
  {
    id: 2,
    icon: '✈️',
    name: 'Du lịch Nhật Bản',
    target: 30000000,
    saved: 27000000,
    deadline: '15/09/2025',
    color: '#FF9F43',
    advice: 'Sắp đạt mục tiêu! Cần thêm 3,000,000 ₫ nữa',
  },
  {
    id: 3,
    icon: '🏦',
    name: 'Quỹ khẩn cấp',
    target: 20000000,
    saved: 6000000,
    deadline: '31/06/2026',
    color: '#4B9EFF',
    advice: 'Cần nạp thêm ~2,000,000 ₫/tháng để đạt mục tiêu',
  },
  {
    id: 4,
    icon: '🏠',
    name: 'Mua nhà',
    target: 500000000,
    saved: 45000000,
    deadline: '31/12/2030',
    color: '#7B68EE',
    advice: 'Hành trình dài — hãy kiên trì, bắt đầu từ 8,000,000 ₫/tháng',
  },
  {
    id: 5,
    icon: '🎓',
    name: 'Học thạc sĩ',
    target: 80000000,
    saved: 20000000,
    deadline: '01/09/2026',
    color: '#FF6B9D',
    advice: 'Cần nạp thêm ~5,000,000 ₫/tháng để đạt mục tiêu',
  },
  {
    id: 6,
    icon: '🚗',
    name: 'Mua ô tô',
    target: 400000000,
    saved: 80000000,
    deadline: '31/12/2027',
    color: '#00C896',
    advice: 'Cần nạp thêm ~10,000,000 ₫/tháng để đạt mục tiêu',
  },
];

function getProgressColor(pct: number) {
  if (pct >= 90) return '#FF9F43';
  if (pct >= 50) return '#00C896';
  return '#4B9EFF';
}

function GoalCard({ goal, onFund }: { goal: Goal; onFund: (id: number) => void }) {
  const { c, isDark } = useTheme();
  const pct = Math.round((goal.saved / goal.target) * 100);
  const progressColor = getProgressColor(pct);

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
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
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
          Mục tiêu: <span style={{ fontWeight: 600, color: c.textSub }}>{goal.target.toLocaleString('vi-VN')} ₫</span>
        </p>
        <p style={{ fontSize: 12, color: c.green, fontWeight: 600, marginTop: 2 }}>
          Đã tiết kiệm: {goal.saved.toLocaleString('vi-VN')} ₫
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span style={{ fontSize: 11, color: c.textMuted }}>Tiến độ</span>
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
        <span style={{ fontSize: 12, color: c.textMuted }}>Hạn: {goal.deadline}</span>
      </div>

      {/* Advice */}
      <div
        className="px-3 py-2.5 rounded-xl transition-colors duration-300"
        style={{
          backgroundColor: isDark ? 'rgba(75, 158, 255, 0.1)' : '#EFF6FF',
          border: `1px solid ${isDark ? 'rgba(75, 158, 255, 0.2)' : '#DBEAFE'}`,
        }}
      >
        <p style={{ fontSize: 12, color: isDark ? '#60A5FA' : '#1D4ED8', lineHeight: 1.5 }}>💡 {goal.advice}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onFund(goal.id)}
          className="flex-1 py-2.5 rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: c.green, color: 'white', fontSize: 13, fontWeight: 600 }}
        >
          Nạp tiền
        </button>
        <button
          className="flex-1 py-2.5 rounded-xl border transition-colors duration-300"
          style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 13, fontWeight: 600, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
}

export function Goals() {
  const { c, isDark } = useTheme();
  const [goals, setGoals] = useState(initialGoals);
  const [showNewModal, setShowNewModal] = useState(false);
  const [fundModal, setFundModal] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', icon: '🎯' });

  const handleFund = (id: number) => {
    setFundModal(id);
    setFundAmount('');
  };

  const confirmFund = () => {
    if (!fundAmount || !fundModal) return;
    setGoals(goals.map(g =>
      g.id === fundModal
        ? { ...g, saved: Math.min(g.target, g.saved + parseInt(fundAmount)) }
        : g
    ));
    setFundModal(null);
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    const goal: Goal = {
      id: Date.now(),
      icon: newGoal.icon,
      name: newGoal.name,
      target: parseInt(newGoal.target),
      saved: 0,
      deadline: newGoal.deadline || '31/12/2026',
      color: '#4B9EFF',
      advice: 'Hãy bắt đầu tiết kiệm đều đặn mỗi tháng!',
    };
    setGoals([...goals, goal]);
    setShowNewModal(false);
    setNewGoal({ name: '', target: '', deadline: '', icon: '🎯' });
  };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-6">
        <p style={{ fontSize: 14, color: c.textMuted }}>{goals.length} mục tiêu đang theo dõi</p>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
        >
          <Plus size={18} />
          Tạo mục tiêu mới
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-3 gap-5">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onFund={handleFund} />
        ))}
      </div>

      {/* Fund Modal */}
      {fundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: isDark ? 'rgba(10,18,28,0.65)' : 'rgba(15,25,35,0.5)' }}>
          <div className="rounded-2xl p-6 transition-colors duration-300" style={{ backgroundColor: c.card, width: 380, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 18, color: c.text }}>
                Nạp tiền vào mục tiêu
              </h3>
              <button onClick={() => setFundModal(null)}>
                <X size={20} color={c.textMuted} />
              </button>
            </div>
            <p style={{ fontSize: 14, color: c.textMuted, marginBottom: 16 }}>
              {goals.find(g => g.id === fundModal)?.name}
            </p>
            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="Số tiền (VNĐ)"
              className="w-full px-4 py-3 rounded-xl border outline-none mb-4 transition-colors duration-300"
              style={{ borderColor: c.inputBorder, fontSize: 15, color: c.text, backgroundColor: c.input }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setFundModal(null)}
                className="flex-1 py-3 rounded-xl border transition-colors duration-300"
                style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600, backgroundColor: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Hủy
              </button>
              <button
                onClick={confirmFund}
                className="flex-1 py-3 rounded-xl transition-all"
                style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
              >
                Xác nhận
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
                Tạo mục tiêu mới
              </h3>
              <button onClick={() => setShowNewModal(false)}>
                <X size={20} color={c.textMuted} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Biểu tượng</label>
                <div className="flex gap-2 flex-wrap">
                  {['🎯', '🏍️', '✈️', '🏠', '🚗', '🎓', '💍', '🏦', '📱', '🏋️'].map(e => (
                    <button
                      key={e}
                      onClick={() => setNewGoal({ ...newGoal, icon: e })}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all"
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
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Tên mục tiêu</label>
                <input
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="VD: Mua xe máy"
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Số tiền mục tiêu (₫)</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="VD: 50000000"
                  className="w-full px-4 py-3 rounded-xl border outline-none transition-colors duration-300"
                  style={{ borderColor: c.inputBorder, fontSize: 14, color: c.text, backgroundColor: c.input }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: c.text, display: 'block', marginBottom: 6 }}>Hạn chót</label>
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
                  className="flex-1 py-3 rounded-xl border transition-colors duration-300"
                  style={{ borderColor: c.inputBorder, color: c.textSub, fontSize: 14, fontWeight: 600, backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.rowHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Hủy
                </button>
                <button
                  onClick={addGoal}
                  className="flex-1 py-3 rounded-xl transition-all"
                  style={{ backgroundColor: c.green, color: 'white', fontSize: 14, fontWeight: 600 }}
                >
                  Tạo mục tiêu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
