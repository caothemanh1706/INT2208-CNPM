import prisma from '../prisma';

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
