import React from 'react';
// import CampinhoTatico from '@/components/CampinhoTatico'; // Descomente quando for usar
import { GET_DETALHES_PARTIDA } from './queries';
// 1. Definição da Query GraphQL (Coloque aqui!)

// 2. Componente da Página
export default async function PartidaDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: params agora é uma Promise e precisa ser awaited
  const { id } = await params;
  const partidaId = parseInt(id, 10);

  // 3. Execução da busca (Data Fetching no lado do servidor)
  const resposta = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_DETALHES_PARTIDA,
      variables: { id: partidaId },
    }),
    cache: 'no-store',
  });

  const { data, errors } = await resposta.json();

  if (errors || !data?.partida) {
    return <div className="p-10 text-white">Erro ao carregar partida ou partida não encontrada.</div>;
  }

  const partida = data.partida;

  return (
    <main className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto max-w-5xl">
        {/* Aqui entra o seu design: Placar, CampinhoTatico, etc. */}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {partida.equipeCasa.nome} x {partida.equipeVisitante.nome}
        </h1>
        
        {/* Exemplo de uso dos dados */}
        <p className="text-zinc-500 dark:text-zinc-400">
           Estádio: {partida.estadio?.nome || 'A definir'}
        </p>

        {/* Aqui você chamaria o seu CampinhoTatico passando:
           <CampinhoTatico eventos={partida.eventos} /> 
        */}
      </div>
    </main>
  );
}