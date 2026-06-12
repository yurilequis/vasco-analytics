import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALIAS_EQUIPES: Record<string, string> = {
  'athletico': 'athletico paranaense',
  'athletico-pr': 'athletico paranaense',
  'atletico mineiro': 'atletico-mg',
  'atletico-pr': 'athletico paranaense',
  'operario': 'operario-pr',
  'operario ferroviario': 'operario-pr',
  'paysandu sc': 'paysandu',
  'sport recife': 'sport',
  'vasco da gama': 'vasco',
};

function normalizarNome(nome: string): string {
  let n = nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(
      /^(sc|fc|se|cr|clube|esporte|sociedade|associacao|gr|gremio)\s+/g,
      '',
    )
    .replace(/\s+(sc|fc|mg|rj|sp|rs|pr|ba|pa|sc)$/g, '')
    .replace(/-/g, ' ')
    .trim();

  if (ALIAS_EQUIPES[n]) {
     n = ALIAS_EQUIPES[n].replace(/-/g, ' ');
  }
  
  return n.trim();
}

async function main() {
  console.log('🔍 Iniciando limpeza de times duplicados...');

  const equipes = await prisma.equipe.findMany({
    orderBy: { id: 'asc' },
  });

  const mapaNormalizado = new Map<string, number>(); // nomeNormalizado -> idPrincipal
  const paraDeletar: number[] = [];

  for (const equipe of equipes) {
    const nomeNorm = normalizarNome(equipe.nome);

    if (mapaNormalizado.has(nomeNorm)) {
      const idPrincipal = mapaNormalizado.get(nomeNorm)!;
      console.log(
        `♻️  Detectada duplicata: "${equipe.nome}" (ID: ${equipe.id}) -> "${equipes.find((e) => e.id === idPrincipal)?.nome}" (ID: ${idPrincipal})`,
      );

      // 1. Mover Partidas (Casa)
      const partidasCasa = await prisma.partida.findMany({ where: { equipeCasaId: equipe.id } });
      for (const p of partidasCasa) {
          try {
             await prisma.partida.update({ where: { id: p.id }, data: { equipeCasaId: idPrincipal } });
          } catch (e) {
             // Exclui a duplicata se não puder atualizar (violação de restrição única)
             await prisma.eventoPartida.deleteMany({ where: { partidaId: p.id } });
             await prisma.estatisticaEquipe.deleteMany({ where: { partidaId: p.id } });
             await prisma.estatisticaJogador.deleteMany({ where: { partidaId: p.id } });
             await prisma.partida.delete({ where: { id: p.id } });
          }
      }

      // 2. Mover Partidas (Visitante)
      const partidasVisitante = await prisma.partida.findMany({ where: { equipeVisitanteId: equipe.id } });
      for (const p of partidasVisitante) {
          try {
             await prisma.partida.update({ where: { id: p.id }, data: { equipeVisitanteId: idPrincipal } });
          } catch (e) {
             await prisma.eventoPartida.deleteMany({ where: { partidaId: p.id } });
             await prisma.estatisticaEquipe.deleteMany({ where: { partidaId: p.id } });
             await prisma.estatisticaJogador.deleteMany({ where: { partidaId: p.id } });
             await prisma.partida.delete({ where: { id: p.id } });
          }
      }

      // 3. Mover Jogadores
      await prisma.jogador.updateMany({
        where: { equipeId: equipe.id },
        data: { equipeId: idPrincipal },
      });

      // 4. Mover Estatísticas
      await prisma.estatisticaEquipe.updateMany({
        where: { equipeId: equipe.id },
        data: { equipeId: idPrincipal },
      });

      // 5. Mover Eventos
      await prisma.eventoPartida.updateMany({
        where: { equipeId: equipe.id },
        data: { equipeId: idPrincipal },
      });

      paraDeletar.push(equipe.id);
    } else {
      mapaNormalizado.set(nomeNorm, equipe.id);
    }
  }

  if (paraDeletar.length > 0) {
    await prisma.equipe.deleteMany({
      where: { id: { in: paraDeletar } },
    });
    console.log(`✅ Removidas ${paraDeletar.length} equipes duplicadas.`);
  } else {
    console.log('✨ Nenhum time duplicado encontrado.');
  }

  console.log('\n🔍 Iniciando limpeza de jogadores duplicados...');
  const todosJogadores = await prisma.jogador.findMany({
    orderBy: { id: 'asc' },
  });

  const mapaJogadores = new Map<string, number>(); // equipeId_nomeNorm -> idPrincipal
  const jogadoresDeletar: number[] = [];

  for (const jogador of todosJogadores) {
    if (!jogador.equipeId) continue;
    
    // Normalize nome
    const nomeNorm = normalizarNome(jogador.nomeCompleto || jogador.nomePopular);
    const chave = `${jogador.equipeId}_${nomeNorm}`;

    if (mapaJogadores.has(chave)) {
      const idPrincipal = mapaJogadores.get(chave)!;
      console.log(`♻️  Detectado jogador duplicado: "${jogador.nomePopular}" (ID: ${jogador.id}) -> ID: ${idPrincipal}`);

      // Mover Estatísticas
      const estatisticas = await prisma.estatisticaJogador.findMany({ where: { jogadorId: jogador.id } });
      for (const e of estatisticas) {
          try {
             await prisma.estatisticaJogador.update({ where: { id: e.id }, data: { jogadorId: idPrincipal } });
          } catch (err) {
             await prisma.estatisticaJogador.delete({ where: { id: e.id } });
          }
      }

      // Mover Eventos (Principal e Secundário)
      await prisma.eventoPartida.updateMany({
        where: { jogadorId: jogador.id },
        data: { jogadorId: idPrincipal },
      });
      await prisma.eventoPartida.updateMany({
        where: { jogadorSecundarioId: jogador.id },
        data: { jogadorSecundarioId: idPrincipal },
      });

      jogadoresDeletar.push(jogador.id);
    } else {
      mapaJogadores.set(chave, jogador.id);
    }
  }

  if (jogadoresDeletar.length > 0) {
    // Delete PerfilFM associated if exists
    await prisma.perfilFM.deleteMany({
      where: { jogadorId: { in: jogadoresDeletar } },
    });
    await prisma.jogador.deleteMany({
      where: { id: { in: jogadoresDeletar } },
    });
    console.log(`✅ Removidos ${jogadoresDeletar.length} jogadores duplicados.`);
  } else {
    console.log('✨ Nenhum jogador duplicado encontrado.');
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
