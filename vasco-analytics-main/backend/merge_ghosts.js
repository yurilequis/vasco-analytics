const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const vasco2 = await p.equipe.findFirst({ where: { nome: 'Vasco da Gama' } });
  if (!vasco2) return;

  const ativos = await p.jogador.findMany({ where: { equipeId: vasco2.id, ativo: true } });
  const ghosts = await p.jogador.findMany({ where: { equipeId: vasco2.id, ativo: false }, include: { estatisticas: true } });
  
  let count = 0;
  for (const ghost of ghosts) {
    if (ghost.estatisticas.length === 0) continue;
    
    // Normalize string: remove accents, lowercase
    const normalize = (str) => {
      if (!str) return '';
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };
    
    const ghostName = normalize(ghost.nomePopular || ghost.nomeOriginal);
    if (!ghostName) continue;
    
    const ghostParts = ghostName.split(' ').filter(Boolean);
    if (ghostParts.length === 0) continue;
    
    const ghostLast = ghostParts[ghostParts.length - 1];
    const ghostFirstInitial = ghostParts[0].charAt(0);
    
    const match = ativos.find(a => {
      const aNamePop = normalize(a.nomePopular);
      const aNameOrig = normalize(a.nomeOriginal);
      const aNameComp = normalize(a.nomeCompleto);
      
      // Exact match
      if (aNamePop === ghostName || aNameOrig === ghostName) return true;
      
      // Initial + Last Name match (e.g., L. Jardim -> Léo Jardim)
      for (const name of [aNamePop, aNameOrig, aNameComp]) {
        if (!name) continue;
        const parts = name.split(' ').filter(Boolean);
        if (parts.length === 0) continue;
        
        const last = parts[parts.length - 1];
        const firstInitial = parts[0].charAt(0);
        
        if (last === ghostLast && firstInitial === ghostFirstInitial) {
           return true;
        }
      }
      return false;
    });
    
    if (match) {
      // Merge stats
      await p.estatisticaJogador.updateMany({ where: { jogadorId: ghost.id }, data: { jogadorId: match.id } });
      await p.eventoPartida.updateMany({ where: { jogadorId: ghost.id }, data: { jogadorId: match.id } });
      // Delete ghost
      await p.jogador.delete({ where: { id: ghost.id } });
      count++;
      console.log(`✅ Merged GHOST ${ghost.nomePopular || ghost.nomeOriginal} -> ACTIVE ${match.nomePopular}`);
    } else {
      console.log(`❌ No match found for GHOST ${ghost.nomePopular || ghost.nomeOriginal}`);
    }
  }
  console.log(`Total merged: ${count}`);
}

run().catch(console.error).finally(() => p.$disconnect());
