import { PrismaClient } from '@prisma/client';

async function fixNationalities() {
  const prisma = new PrismaClient();
  
  const updates = [
    { nome: 'Andrés Gómez', pais: 'CO' },
    { nome: 'Carlos Cuesta', pais: 'CO' },
    { nome: 'Marino Hinestroza', pais: 'CO' },
    { nome: 'Alan Saldivia', pais: 'UY' },
    { nome: 'Claudio Spinelli', pais: 'AR' },
    { nome: 'Johan Rojas', pais: 'CO' },
    { nome: 'Nuno Moreira', pais: 'PT' },
    { nome: 'Puma', pais: 'UY' },
  ];

  for (const p of updates) {
    const affected = await prisma.jogador.updateMany({
      where: {
        equipeId: 12, // Vasco
        OR: [
          { nomePopular: { contains: p.nome } },
          { nomeCompleto: { contains: p.nome } }
        ]
      },
      data: {
        nacionalidade: p.pais
      }
    });
    console.log(`Atualizou ${affected.count} jogador(es) contendo ${p.nome} para ${p.pais}`);
  }

  await prisma.$disconnect();
}

fixNationalities().catch(console.error);
