import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOGO_MAP: Record<string, string> = {
  'América-MG': '/logos/america-mineiro.football-logos.cc.png',
  'Athletic': '/logos/athletic.football-logos.cc.png',
  'Atlético-GO': '/logos/atletico-goianiense.football-logos.cc.png',
  'Avaí': '/logos/avai.football-logos.cc.png',
  'Botafogo-SP': '/logos/botafogo-sp.football-logos.cc.png',
  'Ceará': '/logos/ceara.football-logos.cc.png',
  'CRB': '/logos/crb.football-logos.cc.png',
  'Criciúma': '/logos/criciuma.football-logos.cc.png',
  'Cuiabá': '/logos/cuiaba.football-logos.cc.png',
  'Fortaleza': '/logos/fortaleza.football-logos.cc.png',
  'Goiás': '/logos/goias.football-logos.cc.png',
  'Juventude': '/logos/juventude.football-logos.cc.png',
  'Londrina': '/logos/londrina.football-logos.cc.png',
  'Náutico': '/logos/nautico.football-logos.cc.png',
  'Novorizontino': '/logos/novorizontino.football-logos.cc.png',
  'Operário-PR': '/logos/operario-ferroviario.football-logos.cc.png',
  'Ponte Preta': '/logos/ponte-preta.football-logos.cc.png',
  'São Bernardo': '/logos/sao-bernardo.football-logos.cc.png',
  'Sport': '/logos/sport-recife.football-logos.cc.png',
  'Vila Nova': '/logos/vila-nova.football-logos.cc.png'
};

function normalizeName(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function main() {
  console.log('Iniciando atualização de logos da Série B...');

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
