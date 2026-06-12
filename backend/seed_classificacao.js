const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const path = require('path');
const prisma = new PrismaClient();

const venvPath = path.join(process.cwd(), 'python_venv', 'Scripts', 'python.exe');
const scriptPath = path.join(process.cwd(), 'src', 'scraping', 'python_scripts', 'sofascore.py');
// Fetching for 2026 Season
const execCmd = `"${venvPath}" "${scriptPath}" classificacao 325 87678`;

exec(execCmd, async (error, stdout, stderr) => {
  if (error) { console.error(error); return; }
  try {
    const res = JSON.parse(stdout);
    
    // Clear old classification to prevent phantom teams
    await prisma.classificacaoEquipe.deleteMany({ where: { competicaoId: 2 } });

    for (const linha of res.dados) {
      const equipe = await prisma.equipe.upsert({
        where: { nome: linha.equipe_nome },
        update: {},
        create: { nome: linha.equipe_nome, nomeCurto: linha.equipe_nome.substring(0, 3).toUpperCase() }
      });
      await prisma.classificacaoEquipe.create({
        data: {
          competicaoId: 2, equipeId: equipe.id,
          posicao: linha.posicao, pontos: linha.pontos, jogos: linha.jogos,
          vitorias: linha.vitorias, empates: linha.empates, derrotas: linha.derrotas,
          golsPro: linha.gols_pro, golsContra: linha.gols_contra, saldoGols: linha.saldo_gols
        }
      });
    }
    console.log('Classificação de 2026 atualizada no BD!');
  } catch(e) { console.error('Parse erro', e, stdout); }
  finally { await prisma.$disconnect(); }
});
