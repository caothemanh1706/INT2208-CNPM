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
    const res = await fetch('/api/transactions');
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },
  
  getBalance: async () => {
    const res = await fetch('/api/balance');
    if (!res.ok) throw new Error('Failed to fetch balance');
    return res.json();
  },

  createTransaction: async (data: TransactionInput) => {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
  },

  getStatisticsOverview: async () => {
    const res = await fetch('/api/statistics/overview');
    if (!res.ok) throw new Error('Failed to fetch statistics overview');
    return res.json();
  },

  getTrendData: async () => {
    const res = await fetch('/api/statistics/trend');
    if (!res.ok) throw new Error('Failed to fetch trend data');
    return res.json();
  },

  getBudgets: async () => {
    const res = await fetch('/api/budgets');
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json();
  },

  deleteTransaction: async (id: number) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
  },

  // --- NOTES ---
  getNotes: async () => {
    const res = await fetch('/api/notes');
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  createNote: async (content: string) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  updateNote: async (id: number, content: string) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  deleteNote: async (id: number) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete note');
  }
};
