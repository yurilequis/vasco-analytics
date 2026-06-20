import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MERGE_PAIRS = [
  { redundanteId: 28, canonicoId: 5 }, // Athletico -> Athletico Paranaense
  { redundanteId: 29, canonicoId: 10 }, // Atlético Mineiro -> Atlético-MG
  { redundanteId: 47, canonicoId: 39 }, // Operário -> Operário-PR
  { redundanteId: 26, canonicoId: 52 }, // Paysandu SC -> Paysandu
  { redundanteId: 30, canonicoId: 44 }, // Sport Recife -> Sport
];

async function mergeEquipes(redundanteId: number, canonicoId: number) {
  console.log(`Iniciando merge: Equipe ID ${redundanteId} -> Equipe ID ${canonicoId}`);

  // Verifica se ambas as equipes existem
  const [eqRedundante, eqCanonica] = await Promise.all([
    prisma.equipe.findUnique({ where: { id: redundanteId } }),
    prisma.equipe.findUnique({ where: { id: canonicoId } })
  ]);

  if (!eqRedundante || !eqCanonica) {
    console.log(`Pulo: Uma das equipes (${redundanteId} ou ${canonicoId}) não existe mais.`);
    return;
  }

  // Transaction para garantir que todas as atualizações e o delete aconteçam juntos
  await prisma.$transaction(async (tx) => {
    // 1. Atualizar Jogadores
    await tx.jogador.updateMany({
      where: { equipeId: redundanteId },
      data: { equipeId: canonicoId }
    });

    // 2. Atualizar Partidas (Casa e Visitante)
    await tx.partida.updateMany({
      where: { equipeCasaId: redundanteId },
      data: { equipeCasaId: canonicoId }
    });
    
    await tx.partida.updateMany({
      where: { equipeVisitanteId: redundanteId },
      data: { equipeVisitanteId: canonicoId }
    });

    // 3. Atualizar Estatisticas de Jogador
    await tx.estatisticaJogador.updateMany({
      where: { equipeId: redundanteId },
      data: { equipeId: canonicoId }
    });

    // 4. Atualizar Estatisticas de Equipe
    // Pode haver conflito de unique constraint se já existir stats para a equipe canônica na mesma partida.
    // Nesse caso, precisaríamos fazer um merge mais cuidadoso, mas para equipes duplicadas é improvável 
    // que ambas tenham jogado a mesma partida e gerado duas stats. 
    // Se ocorrer erro, o transaction fará rollback.
    try {
      await tx.estatisticaEquipe.updateMany({
        where: { equipeId: redundanteId },
        data: { equipeId: canonicoId }
      });
    } catch (e) {
      console.log(`Atenção: Conflito de estatística de equipe. Ignorando update.`, e);
      await tx.estatisticaEquipe.deleteMany({
        where: { equipeId: redundanteId }
      });
    }

    // 5. Atualizar Eventos da Partida
    await tx.eventoPartida.updateMany({
      where: { equipeId: redundanteId },
      data: { equipeId: canonicoId }
    });

    // 6. Deletar a equipe redundante
    await tx.equipe.delete({
      where: { id: redundanteId }
    });

    console.log(`[SUCESSO] ${eqRedundante.nome} mergeado em ${eqCanonica.nome} e excluído.`);
  });
}

async function main() {
  for (const pair of MERGE_PAIRS) {
    try {
      await mergeEquipes(pair.redundanteId, pair.canonicoId);
    } catch (e) {
      console.error(`Erro ao fazer merge de ${pair.redundanteId} para ${pair.canonicoId}:`, e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
