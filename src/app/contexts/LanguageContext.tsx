import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'vi' | 'en' | 'zh';
type Currency = 'VND' | 'USD' | 'CNY';
type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Navigation
    dashboard: 'Tổng quan',
    statistics: 'Thống kê',
    history: 'Lịch sử',
    goals: 'Mục tiêu',
    settings: 'Cài đặt',
    chat_assistant: 'Trợ lý AI',
    logout: 'Đăng xuất',
    personal_finance: 'Cá nhân',
    all_assets: 'Tất cả tài sản',
    
    // Common Actions
    add: 'Thêm',
    delete: 'Xóa',
    edit: 'Sửa',
    cancel: 'Hủy',
    save: 'Lưu',
    loading: 'Đang tải...',
    detail: 'Chi tiết',
    warning: 'Cảnh báo',
    success: 'Thành công',
    error: 'Lỗi',
    actions: 'Thao tác',
    confirm: 'Xác nhận',
    close: 'Đóng',

    // Dashboard
    total_assets: 'Tổng tài sản',
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    balance: 'Số dư',
    monthly_limit: 'Hạn mức tháng',
    recent_transactions: 'Giao dịch gần đây',
    no_transactions: 'Chưa có giao dịch',
    quick_add_transaction: 'Thêm giao dịch nhanh',
    transaction_type: 'Loại giao dịch',
    category: 'Danh mục',
    amount: 'Số tiền',
    wallet: 'Ví tài khoản',
    date: 'Ngày',
    description: 'Mô tả',
    select_wallet: 'Chọn ví',
    select_category: 'Chọn danh mục',
    enter_amount: 'Nhập số tiền...',
    enter_desc: 'Nhập mô tả (không bắt buộc)...',

    // Statistics
    income_vs_expense: 'Thu vào vs Chi ra',
    savings_growth: 'Tăng trưởng tiết kiệm',
    spending_structure: 'Cơ cấu chi tiêu',
    monthly_budget: 'Ngân sách tháng này',
    over_limit: 'Vượt hạn mức',
    no_budget: 'Chưa thiết lập ngân sách',
    quarter: 'Quý',
    year: 'Năm',
    month: 'Tháng',
    compare_years: 'So sánh các năm',
    total_spend: 'Tổng chi',
    no_spending_month: 'Chưa có chi tiêu tháng này',
    loading_data: 'Đang tải dữ liệu...',

    // History
    search_placeholder: 'Tìm kiếm giao dịch...',
    all_wallets: 'Tất cả các ví',
    all_categories: 'Tất cả danh mục',
    filter: 'Bộ lọc',
    export_excel: 'Xuất dữ liệu',
    income_type: 'Khoản thu',
    expense_type: 'Khoản chi',

    // Goals
    saving_goals: 'Mục tiêu tiết kiệm',
    add_new_goal: 'Thêm mục tiêu mới',
    goal_name: 'Tên mục tiêu',
    target_amount: 'Số tiền cần đạt',
    saved_amount: 'Đã tiết kiệm',
    remaining_amount: 'Còn thiếu',
    deadline: 'Hạn chót',
    days_remaining: 'Còn lại {days} ngày',
    overdue: 'Đã quá hạn',
    fund_goal: 'Nạp tiền',
    delete_goal: 'Xóa mục tiêu',
    goal_detail: 'Chi tiết mục tiêu',
    goal_completed: '🎉 Bạn đã hoàn thành xuất sắc mục tiêu này!',
    timeline_advisor: '🤖 Lộ trình Tích lũy Khuyên dùng',
    save_per_day: 'Cần tích lũy mỗi ngày',
    save_per_month: 'Cần tích lũy mỗi tháng',
    milestones: '🎯 Hệ thống cột mốc',
    goal_icon: 'Biểu tượng',
    enter_goal_name: 'Ví dụ: Mua xe máy...',
    goal_delete_confirm: 'Bạn có chắc chắn muốn xóa mục tiêu này? Hành động này không thể hoàn tác.',

    // Settings
    profile: 'Hồ sơ cá nhân',
    change_password: 'Đổi mật khẩu',
    security_2fa: 'Bảo mật 2 lớp',
    wallet_management: 'Quản lý ví',
    budget_limit: 'Cài đặt hạn mức',
    recurring_transactions: 'Giao dịch lặp lại',
    system_settings: 'Cài đặt hệ thống',
    currency_and_language: 'Tiền tệ & Ngôn ngữ',
    notifications: 'Cài đặt thông báo',
    export_data: 'Xuất dữ liệu',
    delete_account: 'Xóa tài khoản',
    save_changes: 'Lưu cài đặt',
    system_language: 'Ngôn ngữ',
    system_currency: 'Đơn vị tiền tệ',
    system_date_format: 'Định dạng ngày',
    profile_desc: 'Cập nhật thông tin cá nhân của bạn',
    display_name: 'Tên hiển thị',
    avatar_url: 'Đường dẫn ảnh đại diện',
    old_password: 'Mật khẩu cũ',
    new_password: 'Mật khẩu mới',
    confirm_password: 'Xác nhận mật khẩu mới',
    wallet_list: 'Danh sách ví hiện tại',
    add_wallet: 'Thêm ví mới',
    wallet_name: 'Tên ví',
    initial_balance: 'Số dư ban đầu',
    budget_category_limits: 'Hạn mức chi tiêu theo danh mục',
    save_changes_btn: 'Lưu cài đặt',

    // Category translations
    'ăn uống': 'Ăn uống',
    'di chuyển': 'Di chuyển',
    'mua sắm': 'Mua sắm',
    'sức khỏe': 'Sức khỏe',
    'giải trí': 'Giải trí',
    'giáo dục': 'Giáo dục',
    'nhà ở': 'Nhà ở',
    'hóa đơn': 'Hóa đơn',
    'du lịch': 'Du lịch',
    'lương': 'Lương',
    'thưởng': 'Thưởng',
    'đầu tư': 'Đầu tư',
    'freelance': 'Freelance',
    'thu nhập khác': 'Thu nhập khác',
    'khác': 'Khác',
    
    'food': 'Ăn uống',
    'transport': 'Di chuyển',
    'shopping': 'Mua sắm',
    'health': 'Sức khỏe',
    'entertainment': 'Giải trí',
    'education': 'Giáo dục',
    'housing': 'Nhà ở',
    'bills': 'Hóa đơn',
    'travel': 'Du lịch',
    'salary': 'Lương',
    'bonus': 'Thưởng',
    'investment': 'Đầu tư',
    'other income': 'Thu nhập khác',
    'other': 'Khác',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    statistics: 'Statistics',
    history: 'History',
    goals: 'Goals',
    settings: 'Settings',
    chat_assistant: 'AI Assistant',
    logout: 'Logout',
    personal_finance: 'Personal',
    all_assets: 'All Assets',
    
    // Common Actions
    add: 'Add',
    delete: 'Delete',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    detail: 'Detail',
    warning: 'Warning',
    success: 'Success',
    error: 'Error',
    actions: 'Actions',
    confirm: 'Confirm',
    close: 'Close',

    // Dashboard
    total_assets: 'Total Assets',
    income: 'Income',
    expense: 'Expenses',
    balance: 'Balance',
    monthly_limit: 'Monthly Limit',
    recent_transactions: 'Recent Transactions',
    no_transactions: 'No transactions yet',
    quick_add_transaction: 'Quick Add Transaction',
    transaction_type: 'Transaction Type',
    category: 'Category',
    amount: 'Amount',
    wallet: 'Wallet / Account',
    date: 'Date',
    description: 'Description',
    select_wallet: 'Select Wallet',
    select_category: 'Select Category',
    enter_amount: 'Enter amount...',
    enter_desc: 'Enter description (optional)...',

    // Statistics
    income_vs_expense: 'Income vs Expenses',
    savings_growth: 'Savings Growth',
    spending_structure: 'Spending Structure',
    monthly_budget: 'This Month Budget',
    over_limit: 'Over Limit',
    no_budget: 'No budget configured',
    quarter: 'Quarter',
    year: 'Year',
    month: 'Month',
    compare_years: 'Compare Years',
    total_spend: 'Total Spend',
    no_spending_month: 'No expenses this month',
    loading_data: 'Loading data...',

    // History
    search_placeholder: 'Search transactions...',
    all_wallets: 'All Wallets',
    all_categories: 'All Categories',
    filter: 'Filter',
    export_excel: 'Export Data',
    income_type: 'Income',
    expense_type: 'Expense',

    // Goals
    saving_goals: 'Savings Goals',
    add_new_goal: 'Add New Goal',
    goal_name: 'Goal Name',
    target_amount: 'Target Amount',
    saved_amount: 'Accumulated',
    remaining_amount: 'Remaining',
    deadline: 'Deadline',
    days_remaining: '{days} days remaining',
    overdue: 'Overdue',
    fund_goal: 'Fund Goal',
    delete_goal: 'Delete Goal',
    goal_detail: 'Goal Details',
    goal_completed: '🎉 You have successfully completed this goal!',
    timeline_advisor: '🤖 Recommended Savings Plan',
    save_per_day: 'Required per day',
    save_per_month: 'Required per month',
    milestones: '🎯 Milestones Checklist',
    goal_icon: 'Icon',
    enter_goal_name: 'E.g., New Laptop...',
    goal_delete_confirm: 'Are you sure you want to delete this goal? This action cannot be undone.',

    // Settings
    profile: 'Profile Info',
    change_password: 'Change Password',
    security_2fa: 'Two-Factor Auth',
    wallet_management: 'Wallet Management',
    budget_limit: 'Budget Limits',
    recurring_transactions: 'Recurring Tx',
    system_settings: 'System Settings',
    currency_and_language: 'Currency & Language',
    notifications: 'Notifications',
    export_data: 'Export Data',
    delete_account: 'Delete Account',
    save_changes: 'Save Settings',
    system_language: 'Language',
    system_currency: 'Currency',
    system_date_format: 'Date Format',
    profile_desc: 'Update your personal details',
    display_name: 'Display Name',
    avatar_url: 'Avatar image URL',
    old_password: 'Current Password',
    new_password: 'New Password',
    confirm_password: 'Confirm New Password',
    wallet_list: 'Current Wallets List',
    add_wallet: 'Add New Wallet',
    wallet_name: 'Wallet Name',
    initial_balance: 'Initial Balance',
    budget_category_limits: 'Budget Limits per Category',
    save_changes_btn: 'Save Settings',

    // Category translations
    'ăn uống': 'Food & Drinks',
    'di chuyển': 'Transport',
    'mua sắm': 'Shopping',
    'sức khỏe': 'Health',
    'giải trí': 'Entertainment',
    'giáo dục': 'Education',
    'nhà ở': 'Housing',
    'hóa đơn': 'Bills',
    'du lịch': 'Travel',
    'lương': 'Salary',
    'thưởng': 'Bonus',
    'đầu tư': 'Investment',
    'freelance': 'Freelance',
    'thu nhập khác': 'Other Income',
    'khác': 'Other',

    'food': 'Food & Drinks',
    'transport': 'Transport',
    'shopping': 'Shopping',
    'health': 'Health',
    'entertainment': 'Entertainment',
    'education': 'Education',
    'housing': 'Housing',
    'bills': 'Bills',
    'travel': 'Travel',
    'salary': 'Salary',
    'bonus': 'Bonus',
    'investment': 'Investment',
    'other income': 'Other Income',
    'other': 'Other',
  },
  zh: {
    // Navigation
    dashboard: '仪表盘',
    statistics: '数据统计',
    history: '历史账单',
    goals: '理财目标',
    settings: '系统设置',
    chat_assistant: 'AI 助手',
    logout: '安全退出',
    personal_finance: '个人财务',
    all_assets: '总资产价值',
    
    // Common Actions
    add: '添加',
    delete: '删除',
    edit: '编辑',
    cancel: '取消',
    save: '保存',
    loading: '加载中...',
    detail: '详情',
    warning: '警告',
    success: '成功',
    error: '错误',
    actions: '操作',
    confirm: '确认',
    close: '关闭',

    // Dashboard
    total_assets: '净资产总额',
    income: '总收入',
    expense: '总支出',
    balance: '账户余额',
    monthly_limit: '月度支出限额',
    recent_transactions: '最近账单明细',
    no_transactions: '暂无交易记录',
    quick_add_transaction: '快速记账一笔',
    transaction_type: '交易类型',
    category: '账单分类',
    amount: '交易金额',
    wallet: '选择账户/钱包',
    date: '交易日期',
    description: '交易备注',
    select_wallet: '选择钱包账户',
    select_category: '选择账单分类',
    enter_amount: '请输入金额...',
    enter_desc: '请输入备注（选填）...',

    // Statistics
    income_vs_expense: '收入与支出对比',
    savings_growth: '储蓄增长趋势',
    spending_structure: '月度支出比例',
    monthly_budget: '本月预算监控',
    over_limit: '超出预算限额',
    no_budget: '未设置本月预算',
    quarter: '按季度',
    year: '按年度',
    month: '按月份',
    compare_years: '年度对比分析',
    total_spend: '总计支出',
    no_spending_month: '本月暂无任何支出',
    loading_data: '正在加载统计数据...',

    // History
    search_placeholder: '输入备注或分类搜索...',
    all_wallets: '全部钱包账户',
    all_categories: '全部账单分类',
    filter: '条件筛选',
    export_excel: '导出数据报表',
    income_type: '收入账单',
    expense_type: '支出账单',

    // Goals
    saving_goals: '储蓄奋斗目标',
    add_new_goal: '新建储蓄目标',
    goal_name: '目标名称',
    target_amount: '目标达成金额',
    saved_amount: '已储蓄资金',
    remaining_amount: '仍需差额',
    deadline: '截止完成日期',
    days_remaining: '剩余 {days} 天',
    overdue: '目标已逾期',
    fund_goal: '注入储蓄资金',
    delete_goal: '废弃此目标',
    goal_detail: '储蓄目标详情',
    goal_completed: '🎉 恭喜您，已圆满达成此储蓄目标！',
    timeline_advisor: '🤖 智能AI储蓄进度建议',
    save_per_day: '日均建议储蓄',
    save_per_month: '月均建议储蓄',
    milestones: '🎯 进度里程碑清单',
    goal_icon: '选择图标',
    enter_goal_name: '例如: 购买摩托车...',
    goal_delete_confirm: '您确定要删除这个储蓄目标吗？此操作无法撤销。',

    // Settings
    profile: '个人基本信息',
    change_password: '修改登录密码',
    security_2fa: '谷歌双重认证',
    wallet_management: '钱包账户管理',
    budget_limit: '分类预算额度',
    recurring_transactions: '定期循环交易',
    system_settings: '系统基本偏好',
    currency_and_language: '货币与语言设置',
    notifications: '推送通知偏好',
    export_data: '备份与导出数据',
    delete_account: '注销我的账户',
    save_changes: '保存所有修改',
    system_language: '界面显示语言',
    system_currency: '本位货币单位',
    system_date_format: '系统日期格式',
    profile_desc: '更新您的个人账户基本资料',
    display_name: '个性昵称',
    avatar_url: '个人头像图片链接',
    old_password: '当前旧密码',
    new_password: '设置新密码',
    confirm_password: '再次输入新密码',
    wallet_list: '现存钱包账户列表',
    add_wallet: '开立新钱包账户',
    wallet_name: '钱包/账户名',
    initial_balance: '初始开户余额',
    budget_category_limits: '各类别支出限额明细',
    save_changes_btn: '保存偏好设置',

    // Category translations
    'ăn uống': '餐饮美食',
    'di chuyển': '交通出行',
    'mua sắm': '购物消费',
    'sức khỏe': '医疗健康',
    'giải trí': '休闲娱乐',
    'giáo dục': '教育学习',
    'nhà ở': '居家住房',
    'hóa đơn': '生活账单',
    'du lịch': '旅游出行',
    'lương': '工资收入',
    'thưởng': '奖金福利',
    'đầu tư': '投资理财',
    'freelance': '自由职业',
    'thu nhập khác': '其他收入',
    'khác': '其他支出',

    'food': '餐饮美食',
    'transport': '交通出行',
    'shopping': '购物消费',
    'health': '医疗健康',
    'entertainment': '休闲娱乐',
    'education': '教育学习',
    'housing': '居家住房',
    'bills': '生活账单',
    'travel': '旅游出行',
    'salary': '工资收入',
    'bonus': '奖金福利',
    'investment': '投资理财',
    'other income': '其他收入',
    'other': '其他支出',
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  dateFormat: DateFormat;
  setDateFormat: (format: DateFormat) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number, forceNoConversion?: boolean) => string;
  formatDate: (dateStr: string | Date) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  currency: 'VND',
  setCurrency: () => {},
  dateFormat: 'DD/MM/YYYY',
  setDateFormat: () => {},
  t: (key) => key,
  formatCurrency: (amount) => String(amount),
  formatDate: (dateStr) => String(dateStr),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('finwise_language') as Language) || 'vi';
  });
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('finwise_currency') as Currency) || 'VND';
  });
  const [dateFormat, setDateFormatState] = useState<DateFormat>(() => {
    return (localStorage.getItem('finwise_date_format') as DateFormat) || 'DD/MM/YYYY';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('finwise_language', lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('finwise_currency', curr);
  };

  const setDateFormat = (format: DateFormat) => {
    setDateFormatState(format);
    localStorage.setItem('finwise_date_format', format);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const keyLower = key.toLowerCase().trim();
    let text = translations[language]?.[key] || 
               translations[language]?.[keyLower] || 
               translations['vi']?.[key] || 
               translations['vi']?.[keyLower] || 
               key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  const formatCurrency = (amount: number, forceNoConversion = false) => {
    let finalAmount = amount;
    if (!forceNoConversion) {
      if (currency === 'USD') {
        finalAmount = amount / 25000;
      } else if (currency === 'CNY') {
        finalAmount = amount / 3500;
      }
    }
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(finalAmount);
    }
    if (currency === 'CNY') {
      return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(finalAmount);
    }
    // Default VND
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(finalAmount);
  };

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    if (dateFormat === 'MM/DD/YYYY') {
      return `${month}/${day}/${year}`;
    }
    return `${day}/${month}/${year}`;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      currency,
      setCurrency,
      dateFormat,
      setDateFormat,
      t,
      formatCurrency,
      formatDate,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
