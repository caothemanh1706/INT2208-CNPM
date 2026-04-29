import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 1000 // Increased from 20 to support History page
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { type, amount, account, toAccount, category, description, date } = req.body;
    
    // Parse amount to number just in case
    const numericAmount = parseFloat(amount);
    
    const data: any = {
      type,
      amount: numericAmount,
      account,
      toAccount,
      category,
      description,
    };
    if (date) data.date = new Date(date);

    const transaction = await prisma.transaction.create({ data });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get total balance
app.get('/api/balance', async (req, res) => {
  try {
    const aggregations = await prisma.transaction.groupBy({
      by: ['type'],
      _sum: {
        amount: true,
      },
    });

    let balance = 0;
    
    aggregations.forEach((agg) => {
      if (agg.type === 'income') balance += (agg._sum.amount || 0);
      else if (agg.type === 'expense') balance -= (agg._sum.amount || 0);
      // Transfer doesn't change total balance.
      // Adjust balance logic would be more complex, keeping it simple for now.
    });

    res.json({ balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate balance' });
  }
});

// Statistics Overview
app.get('/api/statistics/overview', async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Total historical balance
    const aggregations = await prisma.transaction.groupBy({
      by: ['type'],
      _sum: { amount: true },
    });
    let balance = 0;
    aggregations.forEach(agg => {
      if (agg.type === 'income') balance += (agg._sum.amount || 0);
      else if (agg.type === 'expense') balance -= (agg._sum.amount || 0);
    });

    // Current month stats
    const currentMonthStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: { date: { gte: startOfCurrentMonth } },
      _sum: { amount: true },
    });
    let currentIncome = 0;
    let currentExpense = 0;
    currentMonthStats.forEach(agg => {
      if (agg.type === 'income') currentIncome += (agg._sum.amount || 0);
      else if (agg.type === 'expense') currentExpense += (agg._sum.amount || 0);
    });

    // Last month stats
    const lastMonthStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: { date: { gte: startOfLastMonth, lt: startOfCurrentMonth } },
      _sum: { amount: true },
    });
    let lastIncome = 0;
    let lastExpense = 0;
    lastMonthStats.forEach(agg => {
      if (agg.type === 'income') lastIncome += (agg._sum.amount || 0);
      else if (agg.type === 'expense') lastExpense += (agg._sum.amount || 0);
    });

    const incomeChange = lastIncome === 0 ? 0 : Math.round(((currentIncome - lastIncome) / lastIncome) * 100);
    const expenseChange = lastExpense === 0 ? 0 : Math.round(((currentExpense - lastExpense) / lastExpense) * 100);
    
    // For UI simplicity, just calculating change in net savings this month vs last month
    const currentNet = currentIncome - currentExpense;
    const lastNet = lastIncome - lastExpense;
    const balanceChange = lastNet === 0 ? 0 : Math.round(((currentNet - lastNet) / Math.abs(lastNet)) * 100);

    res.json({
      balance,
      balanceChange,
      income: currentIncome,
      incomeChange,
      expense: currentExpense,
      expenseChange
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// Statistics Trend
app.get('/api/statistics/trend', async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    
    const transactions = await prisma.transaction.findMany({
      where: { date: { gte: startOfYear }, type: { in: ['income', 'expense'] } }
    });

    const trendData = Array.from({ length: 12 }, (_, i) => ({
      month: (i + 1).toString(),
      income: 0,
      expense: 0
    }));

    transactions.forEach(t => {
      const monthIdx = t.date.getMonth(); // 0-11
      if (t.type === 'income') trendData[monthIdx].income += t.amount;
      if (t.type === 'expense') trendData[monthIdx].expense += t.amount;
    });

    res.json(trendData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
});

// Budgets
app.get('/api/budgets', async (req, res) => {
  try {
    let activeBudgets = await prisma.budget.findMany();
    
    if (activeBudgets.length === 0) {
      await prisma.budget.createMany({
        data: [
          { category: 'Ăn tiệm', limit: 4000000 },
          { category: 'Đi lại', limit: 2500000 },
          { category: 'Giải trí', limit: 1500000 }
        ]
      });
      activeBudgets = await prisma.budget.findMany();
    }
    
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const expenses = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        type: 'expense',
        date: { gte: startOfCurrentMonth }
      },
      _sum: { amount: true }
    });

    const expenseMap = new Map(expenses.map(e => [e.category, e._sum.amount || 0]));

    const result = activeBudgets.map(b => {
      const spent = expenseMap.get(b.category) || 0;
      const progress = b.limit > 0 ? Math.min(100, Math.round((spent / b.limit) * 100)) : 0;
      return {
        id: b.id,
        category: b.category,
        limit: b.limit,
        spent,
        progress
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.transaction.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// --- NOTES API ---
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { content } = req.body;
    const note = await prisma.note.create({ data: { content } });
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;
    const note = await prisma.note.update({
      where: { id },
      data: { content }
    });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.note.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
