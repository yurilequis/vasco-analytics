const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Get eventId for partida 38
  const partida = await p.partida.findUnique({
    where: { id: 38 },
    select: { id: true, eventId: true, equipeCasa: { select: { nome: true } }, equipeVisitante: { select: { nome: true } } }
  });
  console.log('Partida 38:', JSON.stringify(partida));
}
main().catch(console.error).finally(() => p.$disconnect());
