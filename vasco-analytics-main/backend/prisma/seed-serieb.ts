import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of standard Serie B teams. Using 2024 as a base (since it has Santos, Sport, Ceará, Goiás, Coritiba, etc.)
// If there are specific ones the user wants for 2026, they can just edit the DB.
const TIMES_SERIE_B = [
  'América-MG',
  'Athletic',
  'Atlético-GO',
  'Avaí',
  'Botafogo-SP',
  'Ceará',
  'CRB',
  'Criciúma',
  'Cuiabá',
  'Fortaleza',
  'Goiás',
  'Juventude',
  'Londrina',
  'Náutico',
  'Novorizontino',
  'Operário-PR',
  'Ponte Preta',
  'São Bernardo',
  'Sport',
  'Vila Nova'
];

function normalizeName(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function main() {
  console.log('Iniciando seed de times da Série B...');

  const equipesAtuais = await prisma.equipe.findMany();

  for (const time of TIMES_SERIE_B) {
    const timeNorm = normalizeName(time);
    const existe = equipesAtuais.find(e => normalizeName(e.nome) === timeNorm);

    if (!existe) {
      console.log(`Criando time: ${time}`);
      await prisma.equipe.create({
        data: {
          nome: time,
          nomeCurto: time.substring(0, 3).toUpperCase(),
          pais: 'Brasil',
        }
      });
    } else {
      console.log(`Time ${time} já existe no banco.`);
    }
  }

  console.log('Seed de times da Série B finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
