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
    const { type, amount, account, toAccount, category, description, date,
            note, tags, receiptUrl, location, isRecurring, recurringId,
            accountId, toAccountId, categoryId } = req.body;
    const numericAmount = parseFloat(amount);
    const data: any = {
      type, amount: numericAmount,
      account, toAccount, category, description,
      note, tags, receiptUrl, location,
      isRecurring: !!isRecurring,
      userId: req.user.userId
    };
    if (date) data.date = new Date(date);
    if (accountId)   data.accountId   = parseInt(accountId);
    if (toAccountId) data.toAccountId = parseInt(toAccountId);
    if (categoryId)  data.categoryId  = parseInt(categoryId);
    if (recurringId) data.recurringId = parseInt(recurringId);
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
    const { category, limit, name, categoryId, period, startDate, endDate, icon, color, rollover, alertAt } = req.body;
    const numericLimit = parseFloat(limit);
    const data: any = {
      category: category || '',
      limit: numericLimit,
      name, period, icon, color,
      rollover: !!rollover,
      alertAt: alertAt !== undefined ? parseFloat(alertAt) : 80,
      userId: req.user.userId
    };
    if (categoryId) data.categoryId = parseInt(categoryId);
    if (startDate) data.startDate = new Date(startDate);
    if (endDate)   data.endDate   = new Date(endDate);
    const budget = await prisma.budget.create({ data });
    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

app.put('/api/budgets/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { limit, name, category, categoryId, period, startDate, endDate, icon, color, rollover, alertAt } = req.body;
    const data: any = {};
    if (limit !== undefined)    data.limit    = parseFloat(limit);
    if (name !== undefined)     data.name     = name;
    if (category !== undefined) data.category = category;
    if (categoryId !== undefined) data.categoryId = categoryId ? parseInt(categoryId) : null;
    if (period !== undefined)   data.period   = period;
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined)   data.endDate   = endDate ? new Date(endDate) : null;
    if (icon !== undefined)     data.icon     = icon;
    if (color !== undefined)    data.color    = color;
    if (rollover !== undefined) data.rollover = !!rollover;
    if (alertAt !== undefined)  data.alertAt  = parseFloat(alertAt);
    const budget = await prisma.budget.update({ where: { id, userId: req.user.userId }, data });
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
    const { type, amount, account, toAccount, category, description, date,
            note, tags, receiptUrl, location, isRecurring, recurringId,
            accountId, toAccountId, categoryId } = req.body;
    const numericAmount = parseFloat(amount);
    const data: any = {
      type, amount: numericAmount,
      account, toAccount, category, description,
      note, tags, receiptUrl, location,
      isRecurring: !!isRecurring
    };
    if (date) data.date = new Date(date);
    if (accountId !== undefined)   data.accountId   = accountId ? parseInt(accountId) : null;
    if (toAccountId !== undefined) data.toAccountId = toAccountId ? parseInt(toAccountId) : null;
    if (categoryId !== undefined)  data.categoryId  = categoryId ? parseInt(categoryId) : null;
    if (recurringId !== undefined) data.recurringId = recurringId ? parseInt(recurringId) : null;
    const transaction = await prisma.transaction.update({ where: { id, userId }, data });
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
    const { content, title, color, isPinned, tags } = req.body;
    const note = await prisma.note.create({
      data: { content, title, color, tags, isPinned: !!isPinned, userId: req.user.userId }
    });
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.put('/api/notes/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { content, title, color, isPinned, tags } = req.body;
    const data: any = {};
    if (content  !== undefined) data.content  = content;
    if (title    !== undefined) data.title    = title;
    if (color    !== undefined) data.color    = color;
    if (tags     !== undefined) data.tags     = tags;
    if (isPinned !== undefined) data.isPinned = !!isPinned;
    const note = await prisma.note.update({ where: { id, userId: req.user.userId }, data });
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

// ─── USER PROFILE ─────────────────────────────────────────────────────────────
app.get('/api/profile', authenticateJWT, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, currency: true, createdAt: true }
    });
    res.json(user);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch profile' }); }
});

app.put('/api/profile', authenticateJWT, async (req: any, res) => {
  try {
    const { displayName, avatarUrl, currency } = req.body;
    const data: any = {};
    if (displayName !== undefined) data.displayName = displayName;
    if (avatarUrl   !== undefined) data.avatarUrl   = avatarUrl;
    if (currency    !== undefined) data.currency    = currency;
    const user = await prisma.user.update({
      where: { id: req.user.userId }, data,
      select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, currency: true }
    });
    res.json(user);
  } catch (error) { res.status(500).json({ error: 'Failed to update profile' }); }
});

// ─── ACCOUNTS ─────────────────────────────────────────────────────────────────
app.get('/api/accounts', authenticateJWT, async (req: any, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.userId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]
    });
    res.json(accounts);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch accounts' }); }
});

app.post('/api/accounts', authenticateJWT, async (req: any, res) => {
  try {
    const { name, type, balance, currency, icon, color, isDefault } = req.body;
    const data: any = {
      name, type: type || 'bank',
      balance: parseFloat(balance || 0),
      currency: currency || 'VND',
      icon, color,
      isDefault: !!isDefault,
      userId: req.user.userId
    };
    if (isDefault) {
      await prisma.account.updateMany({ where: { userId: req.user.userId }, data: { isDefault: false } });
    }
    const account = await prisma.account.create({ data });
    res.status(201).json(account);
  } catch (error) { res.status(500).json({ error: 'Failed to create account' }); }
});

app.put('/api/accounts/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, type, balance, currency, icon, color, isDefault, isActive } = req.body;
    const data: any = {};
    if (name      !== undefined) data.name      = name;
    if (type      !== undefined) data.type      = type;
    if (balance   !== undefined) data.balance   = parseFloat(balance);
    if (currency  !== undefined) data.currency  = currency;
    if (icon      !== undefined) data.icon      = icon;
    if (color     !== undefined) data.color     = color;
    if (isActive  !== undefined) data.isActive  = !!isActive;
    if (isDefault !== undefined) {
      data.isDefault = !!isDefault;
      if (isDefault) await prisma.account.updateMany({ where: { userId: req.user.userId }, data: { isDefault: false } });
    }
    const account = await prisma.account.update({ where: { id, userId: req.user.userId }, data });
    res.json(account);
  } catch (error) { res.status(500).json({ error: 'Failed to update account' }); }
});

app.delete('/api/accounts/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.account.update({ where: { id, userId: req.user.userId }, data: { isActive: false } });
    res.status(204).send();
  } catch (error) { res.status(500).json({ error: 'Failed to delete account' }); }
});

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
// Seed default categories (call once after registration or via /api/categories/seed)
const DEFAULT_CATEGORIES = [
  { name: 'Ăn uống',     type: 'expense', icon: 'UtensilsCrossed', color: '#f97316', isSystem: true },
  { name: 'Di chuyển',   type: 'expense', icon: 'Car',             color: '#3b82f6', isSystem: true },
  { name: 'Mua sắm',     type: 'expense', icon: 'ShoppingBag',     color: '#ec4899', isSystem: true },
  { name: 'Sức khỏe',    type: 'expense', icon: 'HeartPulse',      color: '#ef4444', isSystem: true },
  { name: 'Giải trí',    type: 'expense', icon: 'Gamepad2',        color: '#8b5cf6', isSystem: true },
  { name: 'Giáo dục',    type: 'expense', icon: 'GraduationCap',   color: '#06b6d4', isSystem: true },
  { name: 'Nhà ở',       type: 'expense', icon: 'Home',            color: '#84cc16', isSystem: true },
  { name: 'Hóa đơn',     type: 'expense', icon: 'Receipt',         color: '#f59e0b', isSystem: true },
  { name: 'Du lịch',     type: 'expense', icon: 'Plane',           color: '#14b8a6', isSystem: true },
  { name: 'Khác',        type: 'expense', icon: 'MoreHorizontal',  color: '#6b7280', isSystem: true },
  { name: 'Lương',       type: 'income',  icon: 'Wallet',          color: '#22c55e', isSystem: true },
  { name: 'Thưởng',      type: 'income',  icon: 'Gift',            color: '#a855f7', isSystem: true },
  { name: 'Đầu tư',      type: 'income',  icon: 'TrendingUp',      color: '#0ea5e9', isSystem: true },
  { name: 'Freelance',   type: 'income',  icon: 'Briefcase',       color: '#f97316', isSystem: true },
  { name: 'Thu nhập khác', type: 'income', icon: 'PlusCircle',     color: '#6b7280', isSystem: true },
];

app.get('/api/categories', authenticateJWT, async (req: any, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { OR: [{ userId: req.user.userId }, { isSystem: true }] },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }]
    });
    res.json(categories);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch categories' }); }
});

app.post('/api/categories/seed', authenticateJWT, async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const existing = await prisma.category.count({ where: { userId, isSystem: true } });
    if (existing > 0) { res.json({ message: 'Already seeded' }); return; }
    const cats = await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map(c => ({ ...c, userId }))
    });
    res.status(201).json({ message: `Created ${cats.count} default categories` });
  } catch (error) { res.status(500).json({ error: 'Failed to seed categories' }); }
});

app.post('/api/categories', authenticateJWT, async (req: any, res) => {
  try {
    const { name, type, icon, color } = req.body;
    const category = await prisma.category.create({
      data: { name, type, icon, color, isSystem: false, userId: req.user.userId }
    });
    res.status(201).json(category);
  } catch (error) { res.status(500).json({ error: 'Failed to create category' }); }
});

app.put('/api/categories/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, type, icon, color } = req.body;
    const data: any = {};
    if (name  !== undefined) data.name  = name;
    if (type  !== undefined) data.type  = type;
    if (icon  !== undefined) data.icon  = icon;
    if (color !== undefined) data.color = color;
    const category = await prisma.category.update({ where: { id, userId: req.user.userId }, data });
    res.json(category);
  } catch (error) { res.status(500).json({ error: 'Failed to update category' }); }
});

app.delete('/api/categories/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.category.delete({ where: { id, userId: req.user.userId } });
    res.status(204).send();
  } catch (error) { res.status(500).json({ error: 'Failed to delete category' }); }
});

// ─── RECURRING TRANSACTIONS ───────────────────────────────────────────────────
app.get('/api/recurring', authenticateJWT, async (req: any, res) => {
  try {
    const recurring = await prisma.recurringTransaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { nextDueDate: 'asc' }
    });
    res.json(recurring);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch recurring transactions' }); }
});

app.post('/api/recurring', authenticateJWT, async (req: any, res) => {
  try {
    const { name, type, amount, accountId, categoryId, description, frequency, startDate, endDate, autoCreate } = req.body;
    const start = new Date(startDate);
    const data: any = {
      name, type,
      amount: parseFloat(amount),
      description, frequency,
      startDate: start,
      nextDueDate: start,
      autoCreate: !!autoCreate,
      userId: req.user.userId
    };
    if (accountId)  data.accountId  = parseInt(accountId);
    if (categoryId) data.categoryId = parseInt(categoryId);
    if (endDate)    data.endDate    = new Date(endDate);
    const recurring = await prisma.recurringTransaction.create({ data });
    res.status(201).json(recurring);
  } catch (error) { res.status(500).json({ error: 'Failed to create recurring transaction' }); }
});

app.put('/api/recurring/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, type, amount, accountId, categoryId, description, frequency, startDate, endDate, nextDueDate, isActive, autoCreate } = req.body;
    const data: any = {};
    if (name        !== undefined) data.name        = name;
    if (type        !== undefined) data.type        = type;
    if (amount      !== undefined) data.amount      = parseFloat(amount);
    if (description !== undefined) data.description = description;
    if (frequency   !== undefined) data.frequency   = frequency;
    if (isActive    !== undefined) data.isActive    = !!isActive;
    if (autoCreate  !== undefined) data.autoCreate  = !!autoCreate;
    if (accountId   !== undefined) data.accountId   = accountId ? parseInt(accountId) : null;
    if (categoryId  !== undefined) data.categoryId  = categoryId ? parseInt(categoryId) : null;
    if (startDate   !== undefined) data.startDate   = new Date(startDate);
    if (endDate     !== undefined) data.endDate     = endDate ? new Date(endDate) : null;
    if (nextDueDate !== undefined) data.nextDueDate = new Date(nextDueDate);
    const recurring = await prisma.recurringTransaction.update({ where: { id, userId: req.user.userId }, data });
    res.json(recurring);
  } catch (error) { res.status(500).json({ error: 'Failed to update recurring transaction' }); }
});

app.delete('/api/recurring/:id', authenticateJWT, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.recurringTransaction.delete({ where: { id, userId: req.user.userId } });
    res.status(204).send();
  } catch (error) { res.status(500).json({ error: 'Failed to delete recurring transaction' }); }
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

