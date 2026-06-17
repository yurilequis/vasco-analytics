"use client";

import React, { useState } from 'react';
import { EstatisticaJogador } from './CampinhoTatico';
import Link from 'next/link';

interface Props {
  jogadores: EstatisticaJogador[];
  idCasa: number;
  idVisitante: number;
  nomeCasa: string;
  nomeVisitante: string;
}

export default function EstatisticasJogadoresPartida({ jogadores, idCasa, idVisitante, nomeCasa, nomeVisitante }: Props) {
  const [abaAtiva, setAbaAtiva] = useState<'casa' | 'visitante'>('casa');
  
  const equipeAtivaId = abaAtiva === 'casa' ? idCasa : idVisitante;
  const jogadoresExibidos = jogadores.filter(j => j.equipeId === equipeAtivaId)
    .sort((a, b) => {
      
      if (a.titular && !b.titular) return -1;
      if (!a.titular && b.titular) return 1;
      return (b.notaDesempenho || 0) - (a.notaDesempenho || 0);
    });

  const getBadgeColor = (nota: number | null) => {
    if (nota === null) return 'bg-slate-800 text-slate-500';
    if (nota >= 7.5) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (nota >= 7.0) return 'bg-green-500/20 text-green-400 border border-green-500/30';
    if (nota >= 6.0) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
  };

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-900 rounded-[48px] overflow-hidden shadow-2xl">
      
      {}
      <div className="flex border-b border-slate-900">
        <button 
          className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.3em] transition-all ${abaAtiva === 'casa' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'}`}
          onClick={() => setAbaAtiva('casa')}
        >
          {nomeCasa}
        </button>
        <button 
          className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.3em] transition-all ${abaAtiva === 'visitante' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'}`}
          onClick={() => setAbaAtiva('visitante')}
        >
          {nomeVisitante}
        </button>
      </div>

      {}
      <div className="overflow-x-auto w-full pb-8">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30">
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 w-12">#</th>
              <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Jogador</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Nota</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center" title="Minutos Jogados">Min</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center" title="Gols">G</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center" title="Assistências">A</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center" title="Passes Certos">Passes</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center" title="Desarmes">Des</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center" title="Cartão Amarelo">🟨</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center" title="Cartão Vermelho">🟥</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/50">
            {jogadoresExibidos.map((j) => (
              <tr key={j.id} className="hover:bg-slate-900/40 transition-colors group">
                <td className="py-3 px-6 text-xs font-mono font-bold text-slate-600">
                  {j.numeroCamisa || '-'}
                </td>
                <td className="py-3 px-6">
                  <div className="flex flex-col">
                    <Link href={`/elenco/${j.jogador.nomePopular.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-black text-white group-hover:text-accent transition-colors truncate max-w-[200px]">
                      {j.jogador.nomePopular}
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {j.jogador.posicao} {j.titular ? '' : ' (Res)'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center justify-center w-9 h-6 rounded text-[11px] font-mono font-black ${getBadgeColor(j.notaDesempenho)}`}>
                    {j.notaDesempenho ? j.notaDesempenho.toFixed(1) : '-'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-xs font-mono font-bold text-slate-400">
                  {j.minutosJogados}&apos;
                </td>
                <td className="py-3 px-4 text-center text-xs font-mono font-bold text-white">
                  {j.gols > 0 ? <span className="text-emerald-400">{j.gols}</span> : 0}
                </td>
                <td className="py-3 px-4 text-center text-xs font-mono font-bold text-white">
                  {j.assistencias > 0 ? <span className="text-sky-400">{j.assistencias}</span> : 0}
                </td>
                <td className="py-3 px-4 text-center text-xs font-mono font-bold text-slate-400">
                  {j.passesCompletos}
                </td>
                <td className="py-3 px-4 text-center text-xs font-mono font-bold text-slate-400">
                  {j.desarmes}
                </td>
                <td className="py-3 px-4 text-center text-xs">
                  {j.cartoesAmarelos > 0 ? <span className="inline-block w-2.5 h-3.5 bg-amber-400 rounded-sm"></span> : <span className="text-slate-800">-</span>}
                </td>
                <td className="py-3 px-4 text-center text-xs">
                  {j.cartoesVermelhos > 0 ? <span className="inline-block w-2.5 h-3.5 bg-rose-500 rounded-sm"></span> : <span className="text-slate-800">-</span>}
                </td>
              </tr>
            ))}
            {jogadoresExibidos.length === 0 && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-xs font-black uppercase tracking-widest text-slate-600">
                  Sem dados de jogadores para esta equipe
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
