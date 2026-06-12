import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOGO_MAP: Record<string, string> = {
  'Athletico Paranaense': '/logos/athletico-paranaense.png',
  'Atlético-MG': '/logos/atletico-mineiro.png',
  'Bahia': '/logos/bahia.png',
  'Botafogo': '/logos/botafogo.png',
  'Chapecoense': '/logos/chapecoense.png',
  'Corinthians': '/logos/corinthians.png',
  'Coritiba': '/logos/coritiba.png',
  'Cruzeiro': '/logos/cruzeiro.png',
  'Flamengo': '/logos/flamengo.png',
  'Fluminense': '/logos/fluminense.png',
  'Grêmio': '/logos/gremio.png',
  'Internacional': '/logos/internacional.png',
  'Mirassol': '/logos/mirassol.png',
  'Palmeiras': '/logos/palmeiras.png',
  'Red Bull Bragantino': '/logos/rb-bragantino.png',
  'Remo': '/logos/remo.png',
  'Santos': '/logos/santos.png',
  'São Paulo': '/logos/sao-paulo.png',
  'Vasco da Gama': '/logos/vasco.png',
  'Vitória': '/logos/vitoria.png'
};

function normalizeName(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function main() {
  console.log('Iniciando atualização de logos da Série A...');

  const equipes = await prisma.equipe.findMany();

  for (const [nomeOriginal, arquivoLogo] of Object.entries(LOGO_MAP)) {
    const nomeNormalizado = normalizeName(nomeOriginal);
    const equipeDb = equipes.find(e => normalizeName(e.nome) === nomeNormalizado);

    if (equipeDb) {
      await prisma.equipe.update({
        where: { id: equipeDb.id },
        data: { escudoUrl: arquivoLogo }
      });
      console.log(`Logo atualizada para: ${nomeOriginal} -> ${arquivoLogo}`);
    } else {
      console.log(`Time ${nomeOriginal} não encontrado no banco.`);
    }
  }

  console.log('Atualização de logos finalizada com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
