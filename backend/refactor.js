const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'backend', 'src');

const dirs = ['routes', 'controllers', 'services', 'middlewares'];
dirs.forEach(dir => {
  const dirPath = path.join(srcPath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Write prisma.ts
fs.writeFileSync(path.join(srcPath, 'prisma.ts'), `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;
`);

// Write middlewares
fs.writeFileSync(path.join(srcPath, 'middlewares', 'auth.middleware.ts'), `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
`);

fs.writeFileSync(path.join(srcPath, 'middlewares', 'error.middleware.ts'), `import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
};
`);

// ================= AUTH =================
fs.writeFileSync(path.join(srcPath, 'services', 'auth.service.ts'), `import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  async register(data: any) {
    const { email, username, password } = data;
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existingUser) throw new Error('Email or username already exists');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword }
    });
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, username: user.username } };
  }

  async login(data: any) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, username: user.username } };
  }

  async resetPassword(data: any) {
    const { email, newPassword } = data;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    return { message: 'Password reset successful' };
  }
}
export const authService = new AuthService();
`);

fs.writeFileSync(path.join(srcPath, 'controllers', 'auth.controller.ts'), `import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (e: any) { res.status(401).json({ error: e.message }); }
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Reset link sent to your email' });
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
}
export const authController = new AuthController();
`);

fs.writeFileSync(path.join(srcPath, 'routes', 'auth.routes.ts'), `import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
`);


// ================= TRANSACTIONS =================
fs.writeFileSync(path.join(srcPath, 'services', 'transaction.service.ts'), `import prisma from '../prisma';

export class TransactionService {
  async getAll(userId: number) {
    return prisma.transaction.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 1000 });
  }
  async create(userId: number, data: any) {
    const { type, amount, account, toAccount, category, description, date, note, tags, receiptUrl, location, isRecurring, recurringId, accountId, toAccountId, categoryId } = data;
    const payload: any = {
      type, amount: parseFloat(amount), account, toAccount, category, description, note, tags, receiptUrl, location, isRecurring: !!isRecurring, userId
    };
    if (date) payload.date = new Date(date);
    if (accountId) payload.accountId = parseInt(accountId);
    if (toAccountId) payload.toAccountId = parseInt(toAccountId);
    if (categoryId) payload.categoryId = parseInt(categoryId);
    if (recurringId) payload.recurringId = parseInt(recurringId);
    return prisma.transaction.create({ data: payload });
  }
  async update(userId: number, id: number, data: any) {
    const payload: any = { ...data };
    if (data.amount !== undefined) payload.amount = parseFloat(data.amount);
    if (data.date) payload.date = new Date(data.date);
    if (data.accountId !== undefined) payload.accountId = data.accountId ? parseInt(data.accountId) : null;
    if (data.toAccountId !== undefined) payload.toAccountId = data.toAccountId ? parseInt(data.toAccountId) : null;
    if (data.categoryId !== undefined) payload.categoryId = data.categoryId ? parseInt(data.categoryId) : null;
    if (data.recurringId !== undefined) payload.recurringId = data.recurringId ? parseInt(data.recurringId) : null;
    return prisma.transaction.update({ where: { id, userId }, data: payload });
  }
  async delete(userId: number, id: number) {
    return prisma.transaction.delete({ where: { id, userId } });
  }
}
export const transactionService = new TransactionService();
`);

fs.writeFileSync(path.join(srcPath, 'controllers', 'transaction.controller.ts'), `import { Response, NextFunction } from 'express';
import { transactionService } from '../services/transaction.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class TransactionController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await transactionService.getAll(req.user.userId)); }
    catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await transactionService.create(req.user.userId, req.body)); }
    catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await transactionService.update(req.user.userId, parseInt(req.params.id), req.body)); }
    catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await transactionService.delete(req.user.userId, parseInt(req.params.id)); res.status(204).send(); }
    catch (e) { next(e); }
  }
}
export const transactionController = new TransactionController();
`);

fs.writeFileSync(path.join(srcPath, 'routes', 'transaction.routes.ts'), `import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

export default router;
`);

// ================= BUDGETS =================
fs.writeFileSync(path.join(srcPath, 'services', 'budget.service.ts'), `import prisma from '../prisma';

export class BudgetService {
  async getAll(userId: number) {
    const activeBudgets = await prisma.budget.findMany({ where: { userId } });
    const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const expenses = await prisma.transaction.groupBy({
      by: ['category'],
      where: { type: 'expense', date: { gte: startOfCurrentMonth }, userId },
      _sum: { amount: true }
    });
    const expenseMap = new Map(expenses.map(e => [e.category, e._sum.amount || 0]));
    return activeBudgets.map(b => {
      const spent = expenseMap.get(b.category) || 0;
      const progress = b.limit > 0 ? Math.min(100, Math.round((spent / b.limit) * 100)) : 0;
      return { id: b.id, category: b.category, limit: b.limit, spent, progress };
    });
  }
  async create(userId: number, data: any) {
    const payload: any = {
      category: data.category || '', limit: parseFloat(data.limit), name: data.name, period: data.period, icon: data.icon, color: data.color, rollover: !!data.rollover, alertAt: data.alertAt !== undefined ? parseFloat(data.alertAt) : 80, userId
    };
    if (data.categoryId) payload.categoryId = parseInt(data.categoryId);
    if (data.startDate) payload.startDate = new Date(data.startDate);
    if (data.endDate) payload.endDate = new Date(data.endDate);
    return prisma.budget.create({ data: payload });
  }
  async update(userId: number, id: number, data: any) {
    const payload: any = { ...data };
    if (data.limit !== undefined) payload.limit = parseFloat(data.limit);
    if (data.categoryId !== undefined) payload.categoryId = data.categoryId ? parseInt(data.categoryId) : null;
    if (data.startDate !== undefined) payload.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) payload.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.rollover !== undefined) payload.rollover = !!data.rollover;
    if (data.alertAt !== undefined) payload.alertAt = parseFloat(data.alertAt);
    return prisma.budget.update({ where: { id, userId }, data: payload });
  }
  async delete(userId: number, id: number) {
    return prisma.budget.delete({ where: { id, userId } });
  }
}
export const budgetService = new BudgetService();
`);

fs.writeFileSync(path.join(srcPath, 'controllers', 'budget.controller.ts'), `import { Response, NextFunction } from 'express';
import { budgetService } from '../services/budget.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class BudgetController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await budgetService.getAll(req.user.userId)); } catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await budgetService.create(req.user.userId, req.body)); } catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await budgetService.update(req.user.userId, parseInt(req.params.id), req.body)); } catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await budgetService.delete(req.user.userId, parseInt(req.params.id)); res.status(204).send(); } catch (e) { next(e); }
  }
}
export const budgetController = new BudgetController();
`);

fs.writeFileSync(path.join(srcPath, 'routes', 'budget.routes.ts'), `import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', budgetController.getAll);
router.post('/', budgetController.create);
router.put('/:id', budgetController.update);
router.delete('/:id', budgetController.delete);

export default router;
`);

// ================= NOTES =================
fs.writeFileSync(path.join(srcPath, 'services', 'note.service.ts'), `import prisma from '../prisma';

export class NoteService {
  async getAll(userId: number) { return prisma.note.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }); }
  async create(userId: number, data: any) { return prisma.note.create({ data: { ...data, userId } }); }
  async update(userId: number, id: number, data: any) { return prisma.note.update({ where: { id, userId }, data }); }
  async delete(userId: number, id: number) { return prisma.note.delete({ where: { id, userId } }); }
}
export const noteService = new NoteService();
`);

fs.writeFileSync(path.join(srcPath, 'controllers', 'note.controller.ts'), `import { Response, NextFunction } from 'express';
import { noteService } from '../services/note.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class NoteController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await noteService.getAll(req.user.userId)); } catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await noteService.create(req.user.userId, req.body)); } catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await noteService.update(req.user.userId, parseInt(req.params.id), req.body)); } catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await noteService.delete(req.user.userId, parseInt(req.params.id)); res.status(204).send(); } catch (e) { next(e); }
  }
}
export const noteController = new NoteController();
`);

fs.writeFileSync(path.join(srcPath, 'routes', 'note.routes.ts'), `import { Router } from 'express';
import { noteController } from '../controllers/note.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', noteController.getAll);
router.post('/', noteController.create);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

export default router;
`);

// ================= CATEGORIES =================
fs.writeFileSync(path.join(srcPath, 'services', 'category.service.ts'), `import prisma from '../prisma';

export class CategoryService {
  async getAll(userId: number) { return prisma.category.findMany({ where: { OR: [{ userId }, { isSystem: true }] }, orderBy: [{ isSystem: 'desc' }, { name: 'asc' }] }); }
  async create(userId: number, data: any) { return prisma.category.create({ data: { ...data, isSystem: false, userId } }); }
  async update(userId: number, id: number, data: any) { return prisma.category.update({ where: { id, userId }, data }); }
  async delete(userId: number, id: number) { return prisma.category.delete({ where: { id, userId } }); }
  async seed(userId: number) {
    const DEFAULT_CATEGORIES = [
        { name: 'Ăn uống',     type: 'expense', icon: 'UtensilsCrossed', color: '#f97316', isSystem: true },
        { name: 'Di chuyển',   type: 'expense', icon: 'Car',             color: '#3b82f6', isSystem: true },
        { name: 'Mua sắm',     type: 'expense', icon: 'ShoppingBag',     color: '#ec4899', isSystem: true },
        { name: 'Lương',       type: 'income',  icon: 'Wallet',          color: '#22c55e', isSystem: true },
    ];
    const existing = await prisma.category.count({ where: { userId, isSystem: true } });
    if (existing > 0) return { message: 'Already seeded' };
    await prisma.category.createMany({ data: DEFAULT_CATEGORIES.map(c => ({ ...c, userId })) });
    return { message: 'Seeded default categories' };
  }
}
export const categoryService = new CategoryService();
`);

fs.writeFileSync(path.join(srcPath, 'controllers', 'category.controller.ts'), `import { Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class CategoryController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await categoryService.getAll(req.user.userId)); } catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await categoryService.create(req.user.userId, req.body)); } catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await categoryService.update(req.user.userId, parseInt(req.params.id), req.body)); } catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await categoryService.delete(req.user.userId, parseInt(req.params.id)); res.status(204).send(); } catch (e) { next(e); }
  }
  async seed(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await categoryService.seed(req.user.userId)); } catch (e) { next(e); }
  }
}
export const categoryController = new CategoryController();
`);

fs.writeFileSync(path.join(srcPath, 'routes', 'category.routes.ts'), `import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', categoryController.getAll);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);
router.post('/seed', categoryController.seed);

export default router;
`);

// ================= ACCOUNTS =================
fs.writeFileSync(path.join(srcPath, 'services', 'account.service.ts'), `import prisma from '../prisma';

export class AccountService {
  async getAll(userId: number) { return prisma.account.findMany({ where: { userId, isActive: true }, orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] }); }
  async create(userId: number, data: any) {
    if (data.isDefault) await prisma.account.updateMany({ where: { userId }, data: { isDefault: false } });
    return prisma.account.create({ data: { ...data, balance: parseFloat(data.balance || 0), type: data.type || 'bank', currency: data.currency || 'VND', isDefault: !!data.isDefault, userId } });
  }
  async update(userId: number, id: number, data: any) {
    if (data.isDefault) await prisma.account.updateMany({ where: { userId }, data: { isDefault: false } });
    const payload = { ...data };
    if (payload.balance !== undefined) payload.balance = parseFloat(payload.balance);
    if (payload.isActive !== undefined) payload.isActive = !!payload.isActive;
    if (payload.isDefault !== undefined) payload.isDefault = !!payload.isDefault;
    return prisma.account.update({ where: { id, userId }, data: payload });
  }
  async delete(userId: number, id: number) { return prisma.account.update({ where: { id, userId }, data: { isActive: false } }); }
}
export const accountService = new AccountService();
`);

fs.writeFileSync(path.join(srcPath, 'controllers', 'account.controller.ts'), `import { Response, NextFunction } from 'express';
import { accountService } from '../services/account.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AccountController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await accountService.getAll(req.user.userId)); } catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await accountService.create(req.user.userId, req.body)); } catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await accountService.update(req.user.userId, parseInt(req.params.id), req.body)); } catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await accountService.delete(req.user.userId, parseInt(req.params.id)); res.status(204).send(); } catch (e) { next(e); }
  }
}
export const accountController = new AccountController();
`);

fs.writeFileSync(path.join(srcPath, 'routes', 'account.routes.ts'), `import { Router } from 'express';
import { accountController } from '../controllers/account.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', accountController.getAll);
router.post('/', accountController.create);
router.put('/:id', accountController.update);
router.delete('/:id', accountController.delete);

export default router;
`);


// ================= OTHERS (STATISTICS, RECURRING, PROFILE) =================
fs.writeFileSync(path.join(srcPath, 'services', 'other.service.ts'), `import prisma from '../prisma';

export class OtherService {
  async getBalance(userId: number) {
    const aggregations = await prisma.transaction.groupBy({ by: ['type'], where: { userId }, _sum: { amount: true } });
    let balance = 0;
    aggregations.forEach(agg => {
      if (agg.type === 'income') balance += (agg._sum.amount || 0);
      else if (agg.type === 'expense') balance -= (agg._sum.amount || 0);
    });
    return { balance };
  }
  async getStatsOverview(userId: number) {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const all = await prisma.transaction.groupBy({ by: ['type'], where: { userId }, _sum: { amount: true } });
    let balance = 0; all.forEach(agg => { if (agg.type === 'income') balance += (agg._sum.amount || 0); else if (agg.type === 'expense') balance -= (agg._sum.amount || 0); });

    const current = await prisma.transaction.groupBy({ by: ['type'], where: { date: { gte: startOfCurrentMonth }, userId }, _sum: { amount: true } });
    let currentIncome = 0, currentExpense = 0;
    current.forEach(agg => { if (agg.type === 'income') currentIncome += (agg._sum.amount || 0); else if (agg.type === 'expense') currentExpense += (agg._sum.amount || 0); });

    const last = await prisma.transaction.groupBy({ by: ['type'], where: { date: { gte: startOfLastMonth, lt: startOfCurrentMonth }, userId }, _sum: { amount: true } });
    let lastIncome = 0, lastExpense = 0;
    last.forEach(agg => { if (agg.type === 'income') lastIncome += (agg._sum.amount || 0); else if (agg.type === 'expense') lastExpense += (agg._sum.amount || 0); });

    const incomeChange = lastIncome === 0 ? 0 : Math.round(((currentIncome - lastIncome) / lastIncome) * 100);
    const expenseChange = lastExpense === 0 ? 0 : Math.round(((currentExpense - lastExpense) / lastExpense) * 100);
    const currentNet = currentIncome - currentExpense; const lastNet = lastIncome - lastExpense;
    const balanceChange = lastNet === 0 ? 0 : Math.round(((currentNet - lastNet) / Math.abs(lastNet)) * 100);

    return { balance, balanceChange, income: currentIncome, incomeChange, expense: currentExpense, expenseChange };
  }
  async getTrend(userId: number) {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const transactions = await prisma.transaction.findMany({ where: { date: { gte: startOfYear }, type: { in: ['income', 'expense'] }, userId } });
    const trendData = Array.from({ length: 12 }, (_, i) => ({ month: (i + 1).toString(), income: 0, expense: 0 }));
    transactions.forEach(t => { const m = t.date.getMonth(); if (t.type === 'income') trendData[m].income += t.amount; if (t.type === 'expense') trendData[m].expense += t.amount; });
    return trendData;
  }
  async getProfile(userId: number) { return prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, currency: true, createdAt: true } }); }
  async updateProfile(userId: number, data: any) { return prisma.user.update({ where: { id: userId }, data, select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, currency: true } }); }
  async getRecurring(userId: number) { return prisma.recurringTransaction.findMany({ where: { userId }, orderBy: { nextDueDate: 'asc' } }); }
  async createRecurring(userId: number, data: any) {
    const start = new Date(data.startDate);
    const payload: any = { name: data.name, type: data.type, amount: parseFloat(data.amount), description: data.description, frequency: data.frequency, startDate: start, nextDueDate: start, autoCreate: !!data.autoCreate, userId };
    if (data.accountId) payload.accountId = parseInt(data.accountId);
    if (data.categoryId) payload.categoryId = parseInt(data.categoryId);
    if (data.endDate) payload.endDate = new Date(data.endDate);
    return prisma.recurringTransaction.create({ data: payload });
  }
  async updateRecurring(userId: number, id: number, data: any) {
    const payload: any = { ...data };
    if (data.amount !== undefined) payload.amount = parseFloat(data.amount);
    if (data.isActive !== undefined) payload.isActive = !!data.isActive;
    if (data.autoCreate !== undefined) payload.autoCreate = !!data.autoCreate;
    if (data.accountId !== undefined) payload.accountId = data.accountId ? parseInt(data.accountId) : null;
    if (data.categoryId !== undefined) payload.categoryId = data.categoryId ? parseInt(data.categoryId) : null;
    if (data.startDate !== undefined) payload.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) payload.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.nextDueDate !== undefined) payload.nextDueDate = new Date(data.nextDueDate);
    return prisma.recurringTransaction.update({ where: { id, userId }, data: payload });
  }
  async deleteRecurring(userId: number, id: number) { return prisma.recurringTransaction.delete({ where: { id, userId } }); }
}
export const otherService = new OtherService();
`);

fs.writeFileSync(path.join(srcPath, 'controllers', 'other.controller.ts'), `import { Response, NextFunction } from 'express';
import { otherService } from '../services/other.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class OtherController {
  async getBalance(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getBalance(req.user.userId)); } catch (e) { next(e); } }
  async getStatsOverview(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getStatsOverview(req.user.userId)); } catch (e) { next(e); } }
  async getTrend(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getTrend(req.user.userId)); } catch (e) { next(e); } }
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getProfile(req.user.userId)); } catch (e) { next(e); } }
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.updateProfile(req.user.userId, req.body)); } catch (e) { next(e); } }
  async getRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getRecurring(req.user.userId)); } catch (e) { next(e); } }
  async createRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { res.status(201).json(await otherService.createRecurring(req.user.userId, req.body)); } catch (e) { next(e); } }
  async updateRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.updateRecurring(req.user.userId, parseInt(req.params.id), req.body)); } catch (e) { next(e); } }
  async deleteRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { await otherService.deleteRecurring(req.user.userId, parseInt(req.params.id)); res.status(204).send(); } catch (e) { next(e); } }
}
export const otherController = new OtherController();
`);

fs.writeFileSync(path.join(srcPath, 'routes', 'other.routes.ts'), `import { Router } from 'express';
import { otherController } from '../controllers/other.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/balance', otherController.getBalance);
router.get('/statistics/overview', otherController.getStatsOverview);
router.get('/statistics/trend', otherController.getTrend);
router.get('/profile', otherController.getProfile);
router.put('/profile', otherController.updateProfile);
router.get('/recurring', otherController.getRecurring);
router.post('/recurring', otherController.createRecurring);
router.put('/recurring/:id', otherController.updateRecurring);
router.delete('/recurring/:id', otherController.deleteRecurring);

export default router;
`);


// ================= INDEX ROUTER & NEW SERVER.TS =================
fs.writeFileSync(path.join(srcPath, 'routes', 'index.ts'), `import { Router } from 'express';
import authRoutes from './auth.routes';
import transactionRoutes from './transaction.routes';
import budgetRoutes from './budget.routes';
import noteRoutes from './note.routes';
import categoryRoutes from './category.routes';
import accountRoutes from './account.routes';
import otherRoutes from './other.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/notes', noteRoutes);
router.use('/categories', categoryRoutes);
router.use('/accounts', accountRoutes);
// Statistics, profile, recurring, and balance are inside otherRoutes
router.use('/', otherRoutes);

export default router;
`);

fs.writeFileSync(path.join(srcPath, 'server.ts'), `import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import apiRoutes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Main API Router
app.use('/api', apiRoutes);

// Centralized error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(\`Backend server running on http://localhost:\${port}\`);
});
`);

console.log('Refactoring completed successfully!');
