import prisma from '../prisma';

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
