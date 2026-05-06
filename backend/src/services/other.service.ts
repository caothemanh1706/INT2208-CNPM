import prisma from '../prisma';

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
