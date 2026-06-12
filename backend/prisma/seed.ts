/* eslint-disable */
import { PrismaClient } from '@prisma/client';

// 1. Instancia o Cliente diretamente (ele lê a DATABASE_URL do seu .env)
const prisma = new PrismaClient();

function normalizarNomeTime(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^(sc|fc|se|cr|clube|esporte|sociedade|associacao|gr|gremio)\s+/g, '')
    .replace(/\s+(sc|fc|mg|rj|sp|rs|pr|ba|pa|sc)$/g, '')
    .trim();
}

async function main() {
  const times = [
    { nome: 'Palmeiras', estado: 'SP', pais: 'Brasil' },
    { nome: 'Flamengo', estado: 'RJ', pais: 'Brasil' },
    { nome: 'Fluminense', estado: 'RJ', pais: 'Brasil' },
    { nome: 'São Paulo', estado: 'SP', pais: 'Brasil' },
    { nome: 'Athletico Paranaense', estado: 'PR', pais: 'Brasil' },
    { nome: 'Red Bull Bragantino', estado: 'SP', pais: 'Brasil' },
    { nome: 'Bahia', estado: 'BA', pais: 'Brasil' },
    { nome: 'Coritiba', estado: 'PR', pais: 'Brasil' },
    { nome: 'Botafogo', estado: 'RJ', pais: 'Brasil' },
    { nome: 'Atlético-MG', estado: 'MG', pais: 'Brasil' },
    { nome: 'Internacional', estado: 'RS', pais: 'Brasil' },
    { nome: 'Vasco da Gama', estado: 'RJ', pais: 'Brasil' },
    { nome: 'Cruzeiro', estado: 'MG', pais: 'Brasil' },
    { nome: 'Vitória', estado: 'BA', pais: 'Brasil' },
    { nome: 'Grêmio', estado: 'RS', pais: 'Brasil' },
    { nome: 'Santos', estado: 'SP', pais: 'Brasil' },
    { nome: 'Corinthians', estado: 'SP', pais: 'Brasil' },
    { nome: 'Remo', estado: 'PA', pais: 'Brasil' },
    { nome: 'Mirassol', estado: 'SP', pais: 'Brasil' },
    { nome: 'Chapecoense', estado: 'SC', pais: 'Brasil' }
  ];

  console.log('🌱 Iniciando o plantio (seeding) dos clubes...');

  const equipesExistentes = await prisma.equipe.findMany();

  for (const time of times) {
    const nomeNormalizado = normalizarNomeTime(time.nome);
    const existe = equipesExistentes.find(e => normalizarNomeTime(e.nome) === nomeNormalizado);

    if (!existe) {
      await prisma.equipe.create({
        data: {
          ...time,
          nomeCurto: time.nome.substring(0, 3).toUpperCase()
        }
      });
      console.log(`✅ Adicionado: ${time.nome}`);
    } else {
      console.log(`⏩ Ignorado (Já existe): ${time.nome} (Conhecido como: ${existe.nome})`);
    }
  }
  
  console.log('🌳 Seeding finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });