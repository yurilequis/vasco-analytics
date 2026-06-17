"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Activity } from 'lucide-react';

export interface EstatisticaJogador {
  id: number;
  equipeId: number;
  jogador: {
    id?: number;
    nomePopular: string;
    posicao: string;
    posicaoSecundaria?: string | null;
    funcoes?: string | null;
    fotoUrl?: string | null;
  };
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
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  posicaoPartida?: string | null;
}

interface Props {
  jogadores: EstatisticaJogador[];
  idCasa: number;
  idVisitante: number;
  nomeCasa: string;
  nomeVisitante: string;
}

export default function CampinhoTatico({ jogadores, idCasa, idVisitante, nomeCasa, nomeVisitante }: Props) {
  const [mounted, setMounted] = useState(false);
  const [timeSelecionado, setTimeSelecionado] = useState<'casa' | 'visitante'>('casa');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const [mostrarSubs, setMostrarSubs] = useState(false);
  
  const [jogadorSelecionado, setJogadorSelecionado] = useState<EstatisticaJogador | null>(() => {
    const todosStarters = jogadores.filter(j => j.titular);
    return todosStarters.sort((a, b) => (b.notaDesempenho || 0) - (a.notaDesempenho || 0))[0] || null;
  });

  const [imgError, setImgError] = useState(false);

  
  const idTime = timeSelecionado === 'casa' ? idCasa : idVisitante;
  const nomeTime = timeSelecionado === 'casa' ? nomeCasa : nomeVisitante;
  
  const jogadoresTime = jogadores.filter(j => j.equipeId === idTime);
  const titularesTime = jogadoresTime.filter(j => j.titular && j.posicaoMediaX !== null);
  const reservasEntraram = jogadoresTime.filter(j => !j.titular && j.minutosJogados > 0);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-8 w-full min-h-[550px] bg-[#14181f] border border-slate-800 rounded-[40px] animate-pulse"></div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        <div className="flex items-center bg-slate-900 rounded-2xl p-1 border border-slate-800 shadow-inner">
          <button
            onClick={() => setTimeSelecionado('casa')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeSelecionado === 'casa' ? 'bg-white text-black shadow-md' : 'text-slate-500 hover:text-white'}`}
          >
            {nomeCasa}
          </button>
          <button
            onClick={() => setTimeSelecionado('visitante')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeSelecionado === 'visitante' ? 'bg-white text-black shadow-md' : 'text-slate-500 hover:text-white'}`}
          >
            {nomeVisitante}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={mostrarSubs}
              onChange={(e) => setMostrarSubs(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-accent focus:ring-accent"
            />
            Mostrar Substituições
          </label>
        </div>
      </div>

      {}
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
        
        {}
        <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
          {}
          <div className="relative h-[600px] w-full max-w-sm overflow-hidden rounded-[48px] border border-slate-800 bg-gradient-to-b from-[#0c261c] to-[#06140e] shadow-2xl">
            {}
            <div className="absolute inset-4 border border-white/10 rounded-[32px] pointer-events-none"></div>
            <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-white/10 pointer-events-none"></div>
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 pointer-events-none"></div>
            <div className="absolute left-1/2 top-4 h-20 w-44 -translate-x-1/2 rounded-b-2xl border border-t-0 border-white/10 pointer-events-none"></div>
            <div className="absolute bottom-4 left-1/2 h-20 w-44 -translate-x-1/2 rounded-t-2xl border border-b-0 border-white/10 pointer-events-none"></div>
            
            {}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
              <svg width="40" height="120" viewBox="0 0 40 120">
                <line x1="20" y1="10" x2="20" y2="100" stroke="#fff" strokeWidth="4" strokeDasharray="4 4" />
                <path d="M 12 95 L 20 110 L 28 95" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {}
            {titularesTime.map((j) => {
              
              
              
              
              const topVal = timeSelecionado === 'casa' ? j.posicaoMediaX : 100 - (j.posicaoMediaX || 50);
              const leftVal = timeSelecionado === 'casa' ? j.posicaoMediaY : 100 - (j.posicaoMediaY || 50);
              
              const top = `${topVal}%`;
              const left = `${leftVal}%`;
              const isSelected = jogadorSelecionado?.id === j.id;
              const isGK = j.jogador.posicao.toLowerCase().includes('goleiro');

              return (
                <button
                  key={j.id}
                  onClick={() => { setJogadorSelecionado(j); setImgError(false); }}
                  className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[10px] font-black shadow-2xl transition-all hover:scale-110 z-10 overflow-hidden group ${
                    isSelected 
                      ? 'scale-125 ring-4 ring-offset-2 ring-offset-black ring-accent z-20 border-white' 
                      : 'border-white/20'
                  } ${
                    isGK 
                      ? 'bg-emerald-600 text-white' 
                      : timeSelecionado === 'casa' ? 'bg-white text-black' : 'bg-slate-900 text-white border-slate-700'
                  }`}
                  style={{ top, left }}
                >
                   {}
                   <span className={`relative z-10 ${isSelected ? 'opacity-0' : 'opacity-100'}`}>{j.numeroCamisa || '-'}</span>
                   
                   {}
                   {j.jogador.fotoUrl && !imgError && (
                     <img 
                       src={`${j.jogador.fotoUrl}?id=${j.jogador.id || j.id}`} 
                       alt="" 
                       className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                       onError={() => setImgError(true)}
                     />
                   )}
                </button>
              );
            })}
          </div>

          {}
          {mostrarSubs && (
            <div className="w-full flex flex-wrap justify-center gap-2 py-4 border-t border-slate-900/50 mt-4">
              {reservasEntraram.map(j => (
                <button
                  key={j.id}
                  onClick={() => { setJogadorSelecionado(j); setImgError(false); }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-black shadow-lg transition-all overflow-hidden ${
                    jogadorSelecionado?.id === j.id
                      ? 'bg-accent border-accent text-white scale-110'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                  title={`${j.jogador.nomePopular}`}
                >
                   {j.jogador.fotoUrl && !imgError ? (
                    <img 
                      src={`${j.jogador.fotoUrl}?id=${j.jogador.id || j.id}`} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    j.numeroCamisa || '-'
                  )}
                </button>
              ))}
              {reservasEntraram.length === 0 && (
                <span className="text-[10px] text-slate-700 uppercase font-black tracking-widest italic">Sem substituições registradas</span>
              )}
            </div>
          )}
        </div>

        {}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="w-full rounded-[40px] border border-slate-900 bg-slate-950 p-8 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
            
            {jogadorSelecionado ? (
              <div className="flex flex-col gap-8 h-full">
                
                {}
                <div className="flex items-start justify-between border-b border-slate-900 pb-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic leading-tight">{jogadorSelecionado.jogador.nomePopular}</h3>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-black text-slate-400 uppercase tracking-wider">#{jogadorSelecionado.numeroCamisa || '??'}</span>
                      <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{jogadorSelecionado.jogador.posicao}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Match Rating</span>
                    <span className={`text-4xl font-mono font-black italic ${(jogadorSelecionado.notaDesempenho || 0) >= 7.5 ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]' : (jogadorSelecionado.notaDesempenho || 0) >= 7.0 ? 'text-green-400' : (jogadorSelecionado.notaDesempenho || 0) >= 6.0 ? 'text-amber-400' : 'text-rose-500'}`}>
                      {jogadorSelecionado.notaDesempenho?.toFixed(1) || '-'}
                    </span>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Minutos', val: `${jogadorSelecionado.minutosJogados}'` },
                    { label: 'Gols / Assists', val: `${jogadorSelecionado.gols} / ${jogadorSelecionado.assistencias}` },
                    { label: 'Passes Certos', val: jogadorSelecionado.passesCompletos },
                    { label: 'Desarmes', val: jogadorSelecionado.desarmes }
                  ].map(s => (
                    <div key={s.label} className="bg-slate-900/30 border border-slate-900/50 p-4 rounded-3xl group hover:border-slate-800 transition-all">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{s.label}</p>
                      <p className="text-lg font-black text-white font-mono">{s.val}</p>
                    </div>
                  ))}
                </div>

                {}
                <div className="flex-1 flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-900"></div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 italic">Heatmap Analysis</span>
                      <div className="h-px flex-1 bg-slate-900"></div>
                   </div>
                   
                   <div className="relative flex-1 min-h-[220px] bg-black/40 rounded-3xl border border-slate-900/50 overflow-hidden flex items-center justify-center group">
                      {jogadorSelecionado.heatmapUrl && !imgError ? (
                        <Image 
                          src={jogadorSelecionado.heatmapUrl} 
                          alt="Heatmap"
                          width={400}
                          height={220}
                          unoptimized
                          className="h-full w-full object-contain opacity-60 mix-blend-screen group-hover:opacity-100 transition-opacity duration-700"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                           <MapPin className="w-6 h-6 text-slate-800" />
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Heatmap Data</span>
                        </div>
                      )}
                      {}
                      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center gap-6 text-center">
                <Activity className="w-12 h-12 text-slate-900 animate-pulse" />
                <p className="text-[10px] font-black uppercase text-slate-700 tracking-[0.4em] max-w-[200px] leading-relaxed">
                  Selecione um atleta no radar tático para carregar o perfil analítico
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}