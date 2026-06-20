const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const vasco2 = await p.equipe.findUnique({ where: { id: 2 } });
  const vasco30 = await p.equipe.findUnique({ where: { id: 30 } });
  console.log('Vasco 2:', vasco2?.nome);
  console.log('Vasco 30:', vasco30?.nome);
  
  if (!vasco2 || !vasco30) return;

  // Move all matches
  await p.partida.updateMany({ where: { equipeCasaId: 30 }, data: { equipeCasaId: 2 } });
  await p.partida.updateMany({ where: { equipeVisitanteId: 30 }, data: { equipeVisitanteId: 2 } });
  await p.estatisticaJogador.updateMany({ where: { equipeId: 30 }, data: { equipeId: 2 } });
  await p.estatisticaEquipe.updateMany({ where: { equipeId: 30 }, data: { equipeId: 2 } });
  
  // Get players in 30
  const players30 = await p.jogador.findMany({ where: { equipeId: 30 } });
  const players2 = await p.jogador.findMany({ where: { equipeId: 2 } });
  
  for (const p30 of players30) {
    // See if there's a match in 2
    const match = players2.find(p2 => p2.nomePopular === p30.nomePopular || p2.nomeOriginal === p30.nomeOriginal);
    if (match) {
      // Move stats to match
      await p.estatisticaJogador.updateMany({ where: { jogadorId: p30.id }, data: { jogadorId: match.id } });
      await p.eventoPartida.updateMany({ where: { jogadorId: p30.id }, data: { jogadorId: match.id } });
      await p.perfilFM.deleteMany({ where: { jogadorId: p30.id } });
      await p.jogador.delete({ where: { id: p30.id } });
      console.log(`Merged ${p30.nomePopular} (30) into ${match.nomePopular} (2)`);
    } else {
      await p.jogador.update({ where: { id: p30.id }, data: { equipeId: 2 } });
      console.log(`Moved ${p30.nomePopular} (30) to 2`);
    }
  }
  
  try {
    await p.equipe.delete({ where: { id: 30 } });
    console.log('Deleted Equipe 30');
  } catch(e) {
    console.log('Could not delete Equipe 30', e.message);
  }
  
  // Now merge ghost stats into active players in team 2!
  const ativos = await p.jogador.findMany({ where: { equipeId: 2, ativo: true } });
  const ghosts = await p.jogador.findMany({ where: { equipeId: 2, ativo: false }, include: { estatisticas: true } });
  
  for (const ghost of ghosts) {
    if (ghost.estatisticas.length === 0) continue;
    
    // Normalize string: remove accents, lowercase
    const normalize = (str) => {
      if (!str) return '';
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };
    
    const ghostName = normalize(ghost.nomePopular || ghost.nomeOriginal);
    const ghostParts = ghostName.split(' ');
    const ghostLast = ghostParts[ghostParts.length - 1];
    const ghostFirstInitial = ghostParts[0].charAt(0);
    
    const match = ativos.find(a => {
      const aNamePop = normalize(a.nomePopular);
      const aNameOrig = normalize(a.nomeOriginal);
      const aNameComp = normalize(a.nomeCompleto);
      
      // Exact match
      if (aNamePop === ghostName || aNameOrig === ghostName) return true;
      
      // J. Victor -> João Victor
      // L. Jardim -> Léo Jardim
      // L. Piton -> Lucas Piton
      for (const name of [aNamePop, aNameOrig, aNameComp]) {
        if (!name) continue;
        const parts = name.split(' ');
        const last = parts[parts.length - 1];
        const firstInitial = parts[0].charAt(0);
        
        if (last === ghostLast && firstInitial === ghostFirstInitial) {
           return true;
        }
      }
      return false;
    });
    
    if (match) {
      await p.estatisticaJogador.updateMany({ where: { jogadorId: ghost.id }, data: { jogadorId: match.id } });
      await p.eventoPartida.updateMany({ where: { jogadorId: ghost.id }, data: { jogadorId: match.id } });
      await p.jogador.delete({ where: { id: ghost.id } });
      console.log(`Merged GHOST ${ghost.nomePopular} -> ACTIVE ${match.nomePopular}`);
    }
  }
}

run().catch(console.error).finally(() => p.$disconnect());
