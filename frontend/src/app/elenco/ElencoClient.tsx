"use client"; // Isto avisa o Next.js que este componente corre no navegador (cliente)

import React, { useState } from 'react';

interface Jogador {
  id: number;
  nomePopular: string;
  posicao: string;
  numeroCamisa: number | null;
  nacionalidade: string | null;
}

// Criamos um mapa de "pesos" para ordenar os jogadores por posição tática no campo
const ordemTatica: Record<string, number> = {
  'goleiro': 1,
  'zagueiro': 2,
  'lateral': 3,
  'volante': 4,
  'meia': 5,
  'atacante': 6
};

export default function ElencoClient({ jogadoresIniciais }: { jogadoresIniciais: Jogador[] }) {
  // Estado que guarda a opção de ordenação atual escolhida pelo utilizador
  const [ordenacao, setOrdenacao] = useState<string>('posicao');

  // Lógica de ordenação da lista
  const jogadoresOrdenados = [...jogadoresIniciais].sort((a, b) => {
    if (ordenacao === 'alfabetica') {
      return a.nomePopular.localeCompare(b.nomePopular);
    }
    
    if (ordenacao === 'posicao') {
      const pesoA = ordemTatica[a.posicao?.toLowerCase()] || 99;
      const pesoB = ordemTatica[b.posicao?.toLowerCase()] || 99;
      
      // Se tiverem posições diferentes, ordena pelo peso tático
      if (pesoA !== pesoB) return pesoA - pesoB;
      // Se jogarem na mesma posição, desempata pela ordem alfabética do nome
      return a.nomePopular.localeCompare(b.nomePopular);
    }
    
    if (ordenacao === 'camisa') {
      // Quem não tem camisa (null) vai para o fim da lista (999)
      const camisaA = a.numeroCamisa || 999;
      const camisaB = b.numeroCamisa || 999;
      return camisaA - camisaB;
    }
    
    return 0;
  });

  return (
    <main className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        
        {/* Cabeçalho e Filtros */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Elenco Vasco da Gama
          </h1>
          
          <div className="flex items-center gap-3">
            <label htmlFor="ordenacao" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Ordenar por:
            </label>
            <select
              id="ordenacao"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white"
            >
              <option value="posicao">Posição</option>
              <option value="alfabetica">Ordem Alfabética (A-Z)</option>
              <option value="camisa">Número</option>
            </select>
          </div>
        </div>

        {/* Grid de Jogadores */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {jogadoresOrdenados.map((jogador) => (
            <div
              key={jogador.id}
              className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-2xl font-bold text-zinc-400 dark:bg-zinc-800">
                {jogador.numeroCamisa || 'S/N'}
              </div>
              
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {jogador.nomePopular}
              </h2>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-zinc-500">
                {jogador.posicao}
              </p>
              
              <p className="mt-3 text-xs text-zinc-400">
                {jogador.nacionalidade || 'Não informada'}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}