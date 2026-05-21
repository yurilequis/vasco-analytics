import React from 'react';

// 1. O contrato (Interface) para o TypeScript
interface Partida {
  id: number;
  dataHora: string;
  status: string;
  competicao: {
    nome: string;
  };
  equipeCasa: {
    nome: string;
  };
  equipeVisitante: {
    nome: string;
  };
  golsCasa: number | null;
  golsVisitante: number | null;
}

// 2. A mesma consulta GraphQL que testou no Playground
const GET_PARTIDAS = `
  query {
    partidas {
      id
      dataHora
      status
      competicao {
        nome
      }
      equipeCasa {
        nome
      }
      golsCasa
      golsVisitante
      equipeVisitante {
        nome
      }
    }
  }
`;

// 3. Função para ir buscar os dados ao Backend NestJS
async function fetchPartidas(): Promise<Partida[]> {
  const resposta = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: GET_PARTIDAS }),
    cache: 'no-store', // Para vermos as atualizações em tempo real
  });

  const resultado = await resposta.json();

  if (resultado.errors) {
    console.error("❌ Erro reportado pelo GraphQL:", JSON.stringify(resultado.errors, null, 2));
    return [];
  }

  if (!resultado.data) {
    return [];
  }

  return resultado.data.partidas;
}

// Função auxiliar para formatar a data
function formatarData(dataString: string) {
  const data = new Date(dataString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}

// 4. O Ecrã Principal
export default async function PartidasPage() {
  const partidas = await fetchPartidas();

  return (
    <main className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Calendário de Partidas
        </h1>

        <div className="flex flex-col gap-6">
          {partidas.map((partida) => {
            // Verificamos se o jogo já terminou ou ainda está agendado
            const isEncerrada = partida.status.toLowerCase() === 'encerrada';

            return (
              <div
                key={partida.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                {/* Cabeçalho do Cartão: Competição e Data */}
                <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    {partida.competicao.nome}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {formatarData(partida.dataHora)}
                  </span>
                </div>

                {/* Corpo do Cartão: Equipas e Resultado */}
                <div className="flex items-center justify-between px-6 py-8">
                  {/* Equipa da Casa */}
                  <div className="flex flex-1 flex-col items-center sm:items-end">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">
                      {partida.equipeCasa.nome}
                    </span>
                  </div>

                  {/* Placar / Status central */}
                  <div className="mx-4 flex w-32 flex-col items-center justify-center sm:mx-8">
                    {isEncerrada ? (
                      <div className="flex items-center gap-3 text-3xl font-black text-zinc-900 dark:text-zinc-50">
                        <span>{partida.golsCasa ?? 0}</span>
                        <span className="text-zinc-300 dark:text-zinc-700">-</span>
                        <span>{partida.golsVisitante ?? 0}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-2xl font-bold text-zinc-400 dark:text-zinc-600">
                        <span>-</span>
                        <span className="text-zinc-300 dark:text-zinc-700">x</span>
                        <span>-</span>
                      </div>
                    )}
                    
                    {/* Etiqueta de Status */}
                    <span
                      className={`mt-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        isEncerrada
                          ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {partida.status}
                    </span>
                  </div>

                  {/* Equipa Visitante */}
                  <div className="flex flex-1 flex-col items-center sm:items-start">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">
                      {partida.equipeVisitante.nome}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {partidas.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
              <p className="text-zinc-500 dark:text-zinc-400">Nenhuma partida encontrada no momento.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}