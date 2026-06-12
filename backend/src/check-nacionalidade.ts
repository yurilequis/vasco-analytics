import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const jogadores = await prisma.jogador.findMany({
    select: { id: true, nomePopular: true, nacionalidade: true }
  });
  
  const estrangeiros = jogadores.filter(j => j.nacionalidade && j.nacionalidade.toUpperCase() !== 'BRASIL');
  console.log("Estrangeiros:");
  console.log(estrangeiros);

  const comBR = jogadores.filter(j => j.nacionalidade === 'BR');
  console.log("\nCom nacionalidade BR:");
  console.log(comBR);
  
  // Update BR to Brasil
  const res = await prisma.jogador.updateMany({
    where: { nacionalidade: 'BR' },
    data: { nacionalidade: 'Brasil' }
  });
  console.log("\nAtualizados BR -> Brasil:", res.count);

}

main().catch(console.error).finally(() => prisma.$disconnect());
