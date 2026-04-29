export const totalBalance = 0; // We can just display "Tổng số dư" without value in the image, or it might be blank right now. Actually the image just says "Tổng số dư" in large text. I'll just keep it text only for now.

export const chartDataIncome = [
  { name: 'Category 1', value: 50000, fill: '#60a5fa' }, // blue
  { name: 'Category 2', value: 25000, fill: '#86efac' }, // green
  { name: 'Category 3', value: 15000, fill: '#fca5a5' }, // red
  { name: 'Category 4', value: 7000, fill: '#fcd34d' }, // yellow
  { name: 'Category 5', value: 3000, fill: '#c084fc' }, // purple
];

export const chartDataExpense = [
  { name: 'Category 1', value: 50000, fill: '#60a5fa' },
  { name: 'Category 2', value: 25000, fill: '#86efac' },
  { name: 'Category 3', value: 15000, fill: '#fca5a5' },
  { name: 'Category 4', value: 7000, fill: '#fcd34d' },
  { name: 'Category 5', value: 3000, fill: '#c084fc' },
];

export const recentRecords = [
  {
    id: 1,
    name: 'Ăn uống',
    subtext: 'Riêng tôi',
    amount: '-100,000 đ',
    wallet: 'Ví của tôi',
    icon: 'burger',
    iconBg: '#fef3c7'
  },
  {
    id: 2,
    name: 'Du lịch',
    subtext: 'Gia đình',
    amount: '-5,000,000 đ',
    wallet: 'Ví của tôi',
    icon: 'suitcase',
    iconBg: '#e0f2fe'
  },
  {
    id: 3,
    name: 'Tiền lương',
    subtext: 'Riêng tôi',
    amount: '+30,000,000 đ',
    wallet: 'Ví của tôi',
    icon: 'money',
    iconBg: '#dcfce7'
  },
  {
    id: 4,
    name: 'Chữa bệnh',
    subtext: 'Thú cưng',
    amount: '-500,000 đ',
    wallet: 'Ví của tôi',
    icon: 'vet',
    iconBg: '#fef9c3'
  },
  {
    id: 5,
    name: 'Di chuyển',
    subtext: 'Riêng tôi',
    amount: '-20,000 đ',
    wallet: 'Ví của tôi',
    icon: 'bus',
    iconBg: '#dbeafe'
  },
  {
    id: 6,
    name: 'Hóa đơn nước',
    subtext: 'Riêng tôi',
    amount: '-300,000 đ',
    wallet: 'Ví của tôi',
    icon: 'water',
    iconBg: '#f1f5f9'
  }
];

export const notes = [
  "5/5/2026: mua nhà",
  "16/5/2026: đóng học phí"
];
