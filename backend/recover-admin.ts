import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('admin123', 10);
  
  await prisma.usuario.create({
    data: {
      nome: 'Yuri Gabriel',
      email: 'admin@vascoanalytics.com',
      senha: senhaHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin user recreated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
