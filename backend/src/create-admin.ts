import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  const count = await prisma.usuario.count();

  if (count > 0) {
    console.log('Já existem usuários no banco.');
    await prisma.$disconnect();
    return;
  }

  const senhaHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.create({
    data: {
      nome: 'Yuri Gabriel',
      email: 'admin@vascoanalytics.com',
      senha: senhaHash,
      role: 'ADMIN',
    },
  });

  console.log('Usuário admin criado com sucesso!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
