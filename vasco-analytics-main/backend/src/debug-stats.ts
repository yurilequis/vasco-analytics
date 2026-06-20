import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const partidas = await prisma.partida.findMany({
    where: {
      estatisticasEquipes: {
        some: {}
      }
    },
    include: {
      estatisticasEquipes: true,
      equipeCasa: true,
      equipeVisitante: true,
    },
    take: 10
  });

  console.log("--- Verificando Estatísticas de Equipe (Filtrado por existentes) ---");
  if (partidas.length === 0) {
    console.log("❌ Nenhuma partida com estatísticas encontrada no banco todo.");
  }
  for (const p of partidas) {
    console.log(`\nPartida ID: ${p.id} | EventID: ${p.eventId} | ${p.equipeCasa.nome} ${p.golsCasa} x ${p.golsVisitante} ${p.equipeVisitante.nome} (${p.dataHora})`);
    if (p.estatisticasEquipes.length === 0) {
      console.log("❌ Nenhuma estatística de equipe encontrada.");
    } else {
      p.estatisticasEquipes.forEach(e => {
        console.log(`Equipe ID ${e.equipeId}: Posse: ${e.posseBola}%, Chutes: ${e.chutes}, Passes: ${e.passesCompletos}`);
      });
    }
  }

  await prisma.$disconnect();
}

main();
