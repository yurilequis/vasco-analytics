import React from 'react';
import CardPartida, { PartidaResumo } from '@/components/CardPartida';

const GET_PARTIDAS_SIMPLES = `
  query {
    partidas {
      id
      dataHora
      status
      golsCasa
      golsVisitante
      competicao { nome }
      equipeCasa { nome }
      equipeVisitante { nome }
    }
  }
`;

// Tipando o retorno da função para o ESLint parar de chorar
async function fetchPartidas(): Promise<PartidaResumo[]> {
  try {
    const resposta = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_PARTIDAS_SIMPLES }),
      cache: 'no-store',
    });
    const resultado = await resposta.json();
    return resultado.data?.partidas || [];
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    return [];
  }
}

export default async function PartidasPage() {
  const partidas = await fetchPartidas();

  return (
    <main className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Calendário de Partidas</h1>
        <div className="flex flex-col gap-6">
          {/* Agora o .map entende automaticamente que é do tipo PartidaResumo */}
          {partidas.map((partida) => <CardPartida key={partida.id} partida={partida} />)}
        </div>
      </div>
    </main>
  );
}