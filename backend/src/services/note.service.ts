import prisma from '../prisma';

export class NoteService {
  async getAll(userId: number) { return prisma.note.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }); }
  async create(userId: number, data: any) { return prisma.note.create({ data: { ...data, userId } }); }
  async update(userId: number, id: number, data: any) { return prisma.note.update({ where: { id, userId }, data }); }
  async delete(userId: number, id: number) { return prisma.note.delete({ where: { id, userId } }); }
}
export const noteService = new NoteService();
