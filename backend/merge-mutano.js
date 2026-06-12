const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const mutanoId = 836;
  const jSilvaId = 1234;

  console.log('Transferindo EstatisticasJogador...');
  const stats = await p.estatisticaJogador.findMany({ where: { jogadorId: jSilvaId } });
  for (const s of stats) {
    // Upsert into Mutano to avoid unique constraint if Mutano already has a row
    await p.estatisticaJogador.upsert({
      where: { partidaId_jogadorId: { partidaId: s.partidaId, jogadorId: mutanoId } },
      update: {
        titular: s.titular,
        minutosJogados: s.minutosJogados,
        notaDesempenho: s.notaDesempenho,
        gols: s.gols,
        assistencias: s.assistencias,
        cartoesAmarelos: s.cartoesAmarelos,
        cartoesVermelhos: s.cartoesVermelhos,
        chutes: s.chutes,
        chutesGol: s.chutesGol,
        passesTentados: s.passesTentados,
        passesCompletos: s.passesCompletos,
        driblesTentados: s.driblesTentados,
        driblesCompletos: s.driblesCompletos,
        desarmes: s.desarmes,
        interceptacoes: s.interceptacoes,
        faltasCometidas: s.faltasCometidas,
        faltasSofridas: s.faltasSofridas,
        posicaoMediaX: s.posicaoMediaX,
        posicaoMediaY: s.posicaoMediaY,
        heatmapUrl: s.heatmapUrl,
        // Mantém a posição caso seja edição manual
        posicaoPartida: s.posicaoPartida
      },
      create: {
        partidaId: s.partidaId,
        jogadorId: mutanoId,
        equipeId: s.equipeId,
        titular: s.titular,
        minutosJogados: s.minutosJogados,
        notaDesempenho: s.notaDesempenho,
        gols: s.gols,
        assistencias: s.assistencias,
        cartoesAmarelos: s.cartoesAmarelos,
        cartoesVermelhos: s.cartoesVermelhos,
        chutes: s.chutes,
        chutesGol: s.chutesGol,
        passesTentados: s.passesTentados,
        passesCompletos: s.passesCompletos,
        driblesTentados: s.driblesTentados,
        driblesCompletos: s.driblesCompletos,
        desarmes: s.desarmes,
        interceptacoes: s.interceptacoes,
        faltasCometidas: s.faltasCometidas,
        faltasSofridas: s.faltasSofridas,
        posicaoMediaX: s.posicaoMediaX,
        posicaoMediaY: s.posicaoMediaY,
        heatmapUrl: s.heatmapUrl,
        posicaoPartida: s.posicaoPartida
      }
    });
    // Apaga o registro antigo
    await p.estatisticaJogador.delete({ where: { id: s.id } });
  }

  console.log('Transferindo EventosPrincipais...');
  await p.eventoPartida.updateMany({
    where: { jogadorId: jSilvaId },
    data: { jogadorId: mutanoId }
  });

  console.log('Transferindo EventosSecundarios...');
  await p.eventoPartida.updateMany({
    where: { jogadorSecundarioId: jSilvaId },
    data: { jogadorSecundarioId: mutanoId }
  });

  console.log('Excluindo J. Silva...');
  await p.jogador.delete({ where: { id: jSilvaId } });
  
  console.log('Sucesso!');
}

main().catch(e => console.error(e)).finally(() => p.$disconnect());
