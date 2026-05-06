import { auth } from './auth';

export interface TransactionInput {
  type: 'expense' | 'income' | 'transfer' | 'adjust';
  amount: number;
  account?: string;
  toAccount?: string;
  category?: string;
  categoryId?: number;
  accountId?: number;
  toAccountId?: number;
  date?: string;
  description?: string;
  note?: string;
  tags?: string;
  isRecurring?: boolean;
}

export const api = {
  // --- AUTH ---
  login: async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Đăng nhập thất bại');
    }
    return res.json();
  },

  register: async (email: string, username: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Đăng ký thất bại');
    }
    return res.json();
  },

  // --- TRANSACTIONS ---
  getTransactions: async () => {
    const res = await auth.fetch('/transactions');
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  getBalance: async () => {
    const res = await auth.fetch('/balance');
    if (!res.ok) throw new Error('Failed to fetch balance');
    return res.json();
  },

  createTransaction: async (data: TransactionInput) => {
    const res = await auth.fetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
  },

  updateTransaction: async (id: number, data: Partial<TransactionInput>) => {
    const res = await auth.fetch(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
  },

  deleteTransaction: async (id: number) => {
    const res = await auth.fetch(`/transactions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
  },

  // --- STATISTICS ---
  getStatisticsOverview: async () => {
    const res = await auth.fetch('/statistics/overview');
    if (!res.ok) throw new Error('Failed to fetch statistics overview');
    return res.json();
  },

  getTrendData: async () => {
    const res = await auth.fetch('/statistics/trend');
    if (!res.ok) throw new Error('Failed to fetch trend data');
    return res.json();
  },

  // --- BUDGETS ---
  getBudgets: async () => {
    const res = await auth.fetch('/budgets');
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
  },

  createBudget: async (data: { category?: string; categoryId?: number; limit: number; name?: string; period?: string }) => {
    const res = await auth.fetch('/budgets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create budget');
    return res.json();
  },

  updateBudget: async (id: number, data: { limit?: number; name?: string }) => {
    const res = await auth.fetch(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update budget');
    return res.json();
  },

  deleteBudget: async (id: number) => {
    const res = await auth.fetch(`/budgets/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete budget');
  },

  // --- NOTES ---
  getNotes: async () => {
    const res = await auth.fetch('/notes');
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  createNote: async (content: string) => {
    const res = await auth.fetch('/notes', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  updateNote: async (id: number, content: string) => {
    const res = await auth.fetch(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  deleteNote: async (id: number) => {
    const res = await auth.fetch(`/notes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete note');
  },

  // --- ACCOUNTS ---
  getAccounts: async () => {
    const res = await auth.fetch('/accounts');
    if (!res.ok) throw new Error('Failed to fetch accounts');
    return res.json();
  },

  createAccount: async (data: { name: string; type?: string; balance?: number; currency?: string; icon?: string; color?: string; isDefault?: boolean }) => {
    const res = await auth.fetch('/accounts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create account');
    return res.json();
  },

  updateAccount: async (id: number, data: any) => {
    const res = await auth.fetch(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update account');
    return res.json();
  },

  deleteAccount: async (id: number) => {
    const res = await auth.fetch(`/accounts/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete account');
  },

  // --- CATEGORIES ---
  getCategories: async () => {
    const res = await auth.fetch('/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  seedCategories: async () => {
    const res = await auth.fetch('/categories/seed', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed categories');
    return res.json();
  },

  createCategory: async (data: { name: string; type: string; icon?: string; color?: string }) => {
    const res = await auth.fetch('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  deleteCategory: async (id: number) => {
    const res = await auth.fetch(`/categories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete category');
  },

  // --- PROFILE ---
  getProfile: async () => {
    const res = await auth.fetch('/profile');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  updateProfile: async (data: { displayName?: string; avatarUrl?: string; currency?: string }) => {
    const res = await auth.fetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // --- RECURRING ---
  getRecurring: async () => {
    const res = await auth.fetch('/recurring');
    if (!res.ok) throw new Error('Failed to fetch recurring transactions');
    return res.json();
  },

  createRecurring: async (data: any) => {
    const res = await auth.fetch('/recurring', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create recurring transaction');
    return res.json();
  },

  updateRecurring: async (id: number, data: any) => {
    const res = await auth.fetch(`/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update recurring transaction');
    return res.json();
  },

  deleteRecurring: async (id: number) => {
    const res = await auth.fetch(`/recurring/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete recurring transaction');
  },
};
