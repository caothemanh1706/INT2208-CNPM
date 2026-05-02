import { auth } from './auth';

export interface TransactionInput {
  type: 'expense' | 'income' | 'transfer' | 'adjust';
  amount: number;
  account: string;
  toAccount?: string;
  category?: string;
  date?: string;
  description?: string;
}

export const api = {
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

  updateTransaction: async (id: number, data: TransactionInput) => {
    const res = await auth.fetch(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
  },

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

  getBudgets: async () => {
    const res = await auth.fetch('/budgets');
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
  },

  createBudget: async (data: { category: string, limit: number }) => {
    const res = await auth.fetch('/budgets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create budget');
    return res.json();
  },

  updateBudget: async (id: number, data: { limit: number }) => {
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

  deleteTransaction: async (id: number) => {
    const res = await auth.fetch(`/transactions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
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
  }
};
