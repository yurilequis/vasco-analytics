import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const count = await prisma.usuario.count();
  console.log(`Existem ${count} usuários no banco de dados.`);
  if (count > 0) {
    const users = await prisma.usuario.findMany({
      select: { id: true, email: true, nome: true, role: true },
    });
    console.log('Usuários:', JSON.stringify(users, null, 2));
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
