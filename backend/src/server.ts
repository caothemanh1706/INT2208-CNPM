import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use a secure env variable

// Middleware to authenticate JWT
const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.use(cors());
app.use(express.json());

// --- AUTH API ---

// Register
app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { email, username, password } = req.body;
    
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email or username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Forgot Password (Mock)
app.post('/api/auth/forgot-password', async (req: any, res: any) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log(`[MOCK] Reset password link for ${email}: http://localhost:5173/reset-password?token=mock-token`);
    res.json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset link' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req: any, res: any) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get all transactions
app.get('/api/transactions', authenticateJWT, async (req: any, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: 'desc' },
      take: 1000 
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a new transaction
app.post('/api/transactions', authenticateJWT, async (req: any, res) => {
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
      userId: req.user.userId
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
app.get('/api/balance', authenticateJWT, async (req: any, res) => {
  try {
    const aggregations = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId: req.user.userId },
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
app.get('/api/statistics/overview', authenticateJWT, async (req: any, res) => {
  try {
    const now = new Date();
    const userId = req.user.userId;
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Total historical balance
    const aggregations = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
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
      where: { date: { gte: startOfCurrentMonth }, userId },
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
      where: { date: { gte: startOfLastMonth, lt: startOfCurrentMonth }, userId },
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
app.get('/api/statistics/trend', authenticateJWT, async (req: any, res) => {
  try {
    const year = new Date().getFullYear();
    const userId = req.user.userId;
    const startOfYear = new Date(year, 0, 1);
    
    const transactions = await prisma.transaction.findMany({
      where: { date: { gte: startOfYear }, type: { in: ['income', 'expense'] }, userId }
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
app.get('/api/budgets', authenticateJWT, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const activeBudgets = await prisma.budget.findMany({
      where: { userId }
    });
    
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const expenses = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        type: 'expense',
        date: { gte: startOfCurrentMonth },
        userId
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

app.post('/api/budgets', authenticateJWT, async (req: any, res) => {
  try {
    const { category, limit } = req.body;
    const numericLimit = parseFloat(limit);
    const budget = await prisma.budget.create({
      data: { category, limit: numericLimit, userId: req.user.userId }
    });
    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

app.put('/api/budgets/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { limit } = req.body;
    const numericLimit = parseFloat(limit);
    const budget = await prisma.budget.update({
      where: { id, userId: req.user.userId },
      data: { limit: numericLimit }
    });
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

app.delete('/api/budgets/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.budget.delete({ where: { id, userId: req.user.userId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// Update a transaction
app.put('/api/transactions/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const { type, amount, account, toAccount, category, description, date } = req.body;
    
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

    const transaction = await prisma.transaction.update({
      where: { id, userId },
      data
    });
    
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.transaction.delete({
      where: { id, userId: req.user.userId }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// --- NOTES API ---
app.get('/api/notes', authenticateJWT, async (req: any, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', authenticateJWT, async (req: any, res) => {
  try {
    const { content } = req.body;
    const note = await prisma.note.create({ data: { content, userId: req.user.userId } });
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.put('/api/notes/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;
    const note = await prisma.note.update({
      where: { id, userId: req.user.userId },
      data: { content }
    });
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.note.delete({ where: { id, userId: req.user.userId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
