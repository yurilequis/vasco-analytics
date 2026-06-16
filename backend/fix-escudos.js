const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const escudos = {
  'Vasco da Gama': '/logos/vasco.png',
  'Vasco': '/logos/vasco.png',
  'Atlético-MG': '/logos/atletico-mineiro.png',
  'São Paulo': '/logos/sao-paulo.png',
  'Athletico Paranaense': '/logos/athletico-paranaense.png',
  'Red Bull Bragantino': '/logos/rb-bragantino.png',
  'Bahia': '/logos/bahia.png',
  'Coritiba': '/logos/coritiba.png',
  'Botafogo': '/logos/botafogo.png',
  'Internacional': '/logos/internacional.png',
  'SC Internacional': '/logos/internacional.png',
  'Cruzeiro': '/logos/cruzeiro.png',
  'Vitória': '/logos/vitoria.png',
  'Grêmio': '/logos/gremio.png',
  'Santos': '/logos/santos.png',
  'Corinthians': '/logos/corinthians.png',
  'Remo': '/logos/remo.png',
  'Mirassol': '/logos/mirassol.png',
  'Chapecoense': '/logos/chapecoense.png',
  'Palmeiras': '/logos/palmeiras.png',
  'Flamengo': '/logos/flamengo.png',
  'Fluminense': '/logos/fluminense.png',
  'Ceará': '/logos/ceara.football-logos.cc.png',
  'Fortaleza': '/logos/fortaleza.football-logos.cc.png',
  'Juventude': '/logos/juventude.football-logos.cc.png',
};

async function fixEscudos() {
  let updated = 0;
  for (const [nome, url] of Object.entries(escudos)) {
    const res = await prisma.equipe.updateMany({
      where: { nome },
      data: { escudoUrl: url }
    });
    if (res.count > 0) {
      console.log(`Updated ${nome} -> ${url}`);
      updated += res.count;
    }
  }
  
  // Para os outros, setar /logos/default.png se ainda for null
  const fallback = await prisma.equipe.updateMany({
    where: { escudoUrl: null },
    data: { escudoUrl: '/logos/default.png' }
  });
  console.log(`Fallback default.png for ${fallback.count} teams.`);
  
  console.log(`Total updated: ${updated}`);
}

fixEscudos().catch(console.error).finally(() => prisma.$disconnect());
