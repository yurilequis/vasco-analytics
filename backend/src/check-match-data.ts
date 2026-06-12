import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const match = await prisma.partida.findUnique({
    include: {
      estatisticasJogadores: {
        include: {
          jogador: true,
        },
      },
    },
    where: { id: 6 },
  });

  if (match) {
    console.log(`Partida ID: ${match.id}`);
    const titulares = match.estatisticasJogadores.filter((ej) => ej.titular);

    const casaTitulares = titulares.filter(
      (t) => t.equipeId === match.equipeCasaId,
    );
    console.log(`Casa (${match.equipeCasaId}):`);
    casaTitulares.forEach((t) =>
      console.log(
        `- ${t.jogador.nomePopular} | X: ${t.posicaoMediaX} | Y: ${t.posicaoMediaY}`,
      ),
    );

    const foraTitulares = titulares.filter(
      (t) => t.equipeId === match.equipeVisitanteId,
    );
    console.log(`\nFora (${match.equipeVisitanteId}):`);
    foraTitulares.forEach((t) =>
      console.log(
        `- ${t.jogador.nomePopular} | X: ${t.posicaoMediaX} | Y: ${t.posicaoMediaY}`,
      ),
    );
  }

  await prisma.$disconnect();
}

main();
