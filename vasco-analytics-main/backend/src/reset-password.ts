import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  const email = 'admin@vascoanalytics.com';
  const novaSenha = 'admin123';

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    console.log(`Usuário ${email} não encontrado.`);
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await prisma.usuario.create({
      data: {
        nome: 'Yuri Gabriel',
        email: email,
        senha: senhaHash,
        role: 'ADMIN',
      },
    });
    console.log(`Usuário ${email} criado com a senha: ${novaSenha}`);
  } else {
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await prisma.usuario.update({
      where: { email },
      data: { senha: senhaHash },
    });
    console.log(`Senha do usuário ${email} resetada para: ${novaSenha}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
