"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export interface EstatisticaJogador {
  id: number;
  equipeId: number;
  jogador: { nomePopular: string; posicao: string; };
  numeroCamisa: number | null;
  titular: boolean;
  notaDesempenho: number | null;
  minutosJogados: number;
  gols: number;
  assistencias: number;
  passesCompletos: number;
  desarmes: number;
  posicaoMediaX: number | null;
  posicaoMediaY: number | null;
  heatmapUrl: string | null;
}

interface Props {
  jogadores: EstatisticaJogador[];
  idCasa: number;
  idVisitante: number;
  nomeCasa: string;
  nomeVisitante: string;
}

export default function CampinhoTatico({ jogadores, idCasa, idVisitante, nomeCasa, nomeVisitante }: Props) {
  // Controle de Abas para não embaralhar os times
  const [equipeAtiva, setEquipeAtiva] = useState<number>(idCasa);
  const jogadoresDoTime = jogadores.filter(j => j.equipeId === equipeAtiva);
  const titulares = jogadoresDoTime.filter(j => j.titular);

  const [jogadorSelecionado, setJogadorSelecionado] = useState<EstatisticaJogador | null>(
    titulares.sort((a, b) => (b.notaDesempenho || 0) - (a.notaDesempenho || 0))[0] || null
  );

  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Botões para trocar o time */}
      <div className="flex gap-4">
        <button 
          onClick={() => { setEquipeAtiva(idCasa); setJogadorSelecionado(null); }}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${equipeAtiva === idCasa ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
        >
          {nomeCasa}
        </button>
        <button 
          onClick={() => { setEquipeAtiva(idVisitante); setJogadorSelecionado(null); }}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${equipeAtiva === idVisitante ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
        >
          {nomeVisitante}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Lado Esquerdo: O Campinho */}
        <div className="relative h-[600px] w-full max-w-md overflow-hidden rounded-xl border-4 border-zinc-200 bg-green-700 shadow-inner lg:w-1/2 dark:border-zinc-800 dark:bg-green-900">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/40"></div>
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40"></div>
          <div className="absolute left-1/2 top-0 h-24 w-48 -translate-x-1/2 rounded-b-lg border-2 border-t-0 border-white/40"></div>
          <div className="absolute bottom-0 left-1/2 h-24 w-48 -translate-x-1/2 rounded-t-lg border-2 border-b-0 border-white/40"></div>

          {titulares.map((j) => {
            const top = j.posicaoMediaX ? `${j.posicaoMediaX}%` : '50%';
            const left = j.posicaoMediaY ? `${j.posicaoMediaY}%` : '50%';
            const isSelected = jogadorSelecionado?.id === j.id;

            return (
              <button
                key={j.id}
                onClick={() => { setJogadorSelecionado(j); setImgError(false); }}
                className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-bold shadow-lg transition-transform hover:scale-110 z-10 ${
                  isSelected ? 'scale-110 border-yellow-400 bg-black text-yellow-400 z-20' : 'border-white bg-zinc-900 text-white'
                }`}
                style={{ top, left }}
              >
                {j.numeroCamisa || '-'}
                {j.notaDesempenho && (
                  <span className={`absolute -bottom-4 rounded px-1.5 py-0.5 text-[10px] ${j.notaDesempenho >= 7.5 ? 'bg-blue-500 text-white' : j.notaDesempenho >= 7.0 ? 'bg-green-500 text-white' : j.notaDesempenho >= 6.0 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                    {j.notaDesempenho.toFixed(1)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lado Direito: Painel do Jogador */}
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:w-1/2 dark:border-zinc-800 dark:bg-zinc-950">
          {jogadorSelecionado ? (
            <>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{jogadorSelecionado.jogador.nomePopular}</h3>
                  <p className="text-sm font-medium text-zinc-500">Camisa {jogadorSelecionado.numeroCamisa || 'N/A'} • {jogadorSelecionado.jogador.posicao}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Nota</span>
                  <span className={`text-3xl font-black ${(jogadorSelecionado.notaDesempenho || 0) >= 7.5 ? 'text-blue-500' : (jogadorSelecionado.notaDesempenho || 0) >= 7.0 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {jogadorSelecionado.notaDesempenho?.toFixed(1) || '-'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900"><span className="text-xs text-zinc-500">Minutos Jogados</span><span className="text-xl font-bold dark:text-zinc-100">{jogadorSelecionado.minutosJogados}</span></div>
                <div className="flex flex-col rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900"><span className="text-xs text-zinc-500">Gols / Assistências</span><span className="text-xl font-bold dark:text-zinc-100">{jogadorSelecionado.gols} / {jogadorSelecionado.assistencias}</span></div>
                <div className="flex flex-col rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900"><span className="text-xs text-zinc-500">Passes Certos</span><span className="text-xl font-bold dark:text-zinc-100">{jogadorSelecionado.passesCompletos}</span></div>
                <div className="flex flex-col rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900"><span className="text-xs text-zinc-500">Desarmes</span><span className="text-xl font-bold dark:text-zinc-100">{jogadorSelecionado.desarmes}</span></div>
              </div>

              {/* Mapa de Calor */}
            {jogadorSelecionado.heatmapUrl && !imgError && (
              <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50/50 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <span className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Mapa de Calor</span>
                <Image 
                  src={jogadorSelecionado.heatmapUrl} 
                  alt={`Mapa de calor de ${jogadorSelecionado.jogador.nomePopular}`}
                  width={400}
                  height={192}
                  unoptimized
                  className="h-48 w-full object-contain opacity-80 mix-blend-multiply dark:mix-blend-lighten"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">Selecione um jogador no campinho</div>
          )}
        </div>
      </div>
    </div>
  );
}