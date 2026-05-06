import prisma from '../prisma';

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
