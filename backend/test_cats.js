const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.category.findMany();
  console.log('CATEGORIES IN DATABASE:', cats.length);
  console.log(JSON.stringify(cats, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
