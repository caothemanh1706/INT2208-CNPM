import prisma from '../prisma';

export class AccountService {
  async getAll(userId: number) {
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }]
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId }
    });

    return accounts.map(acc => {
      let liveBalance = acc.balance; // Initial balance
      transactions.forEach(t => {
        if (t.accountId === acc.id) {
          if (t.type === 'income') {
            liveBalance += t.amount;
          } else if (t.type === 'expense') {
            liveBalance -= t.amount;
          } else if (t.type === 'transfer') {
            liveBalance -= t.amount;
          }
        }
        if (t.toAccountId === acc.id && t.type === 'transfer') {
          liveBalance += t.amount;
        }
      });
      return { ...acc, balance: liveBalance };
    });
  }
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
