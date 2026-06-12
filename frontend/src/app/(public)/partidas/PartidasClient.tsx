"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { getLogoPath } from '@/utils/logoHelper';
import { 
  Trophy, 
  MapPin, 
  ChevronRight,
  Search,
  Zap
} from 'lucide-react';

interface Partida {
  id: number;
  dataHora: string;
  status: string;
  golsCasa: number | null;
  golsVisitante: number | null;
  equipeCasa: { nome: string; escudoUrl: string | null };
  equipeVisitante: { nome: string; escudoUrl: string | null };
  competicao: { nome: string };
  estadio?: { nome: string };
}

function resolverEscudo(url: string | null, nome: string) {
  if (url) return url;
  return getLogoPath(nome);
}

function MatchRow({ partida, compact = false }: { partida: Partida, compact?: boolean }) {
  const date = new Date(partida.dataHora);
  const isEncerrada = partida.status.toLowerCase() === 'encerrada';

  if (compact) {
    return (
      <Link 
        href={`/partidas/${partida.id}`}
        className="flex flex-col p-4 bg-card hover:bg-background border-b border-border transition-all group relative overflow-hidden gap-3"
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-accent transition-colors" />
        
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black uppercase text-accent tracking-[0.2em] border border-accent/20 px-2 py-1 rounded-full bg-accent/5 animate-pulse text-center">
            {date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <Trophy className="w-3 h-3 text-muted" />
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-2 w-[40%] text-center">
             <div className="w-10 h-10 p-1.5 bg-background border border-border rounded-lg shadow-sm">
                <img src={resolverEscudo(partida.equipeCasa.escudoUrl, partida.equipeCasa.nome)} className="max-h-full max-w-full object-contain mx-auto" alt="" />
             </div>
             <span className="text-[10px] font-black text-muted uppercase tracking-tight truncate w-full">{partida.equipeCasa.nome}</span>
          </div>

          <div className="text-[10px] font-black text-muted mx-2">VS</div>

          <div className="flex flex-col items-center gap-2 w-[40%] text-center">
             <div className="w-10 h-10 p-1.5 bg-background border border-border rounded-lg shadow-sm">
                <img src={resolverEscudo(partida.equipeVisitante.escudoUrl, partida.equipeVisitante.nome)} className="max-h-full max-w-full object-contain mx-auto" alt="" />
             </div>
             <span className="text-[10px] font-black text-muted uppercase tracking-tight truncate w-full">{partida.equipeVisitante.nome}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/partidas/${partida.id}`}
      className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 bg-card hover:bg-background border-b border-border transition-all group relative overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-accent transition-colors" />
      
      {/* DATA ANALYTIC */}
      <div className="w-full md:w-24 shrink-0 flex justify-between md:block border-b md:border-b-0 border-border pb-2 md:pb-0 mb-2 md:mb-0">
        <p className="text-[9px] font-black uppercase text-muted tracking-widest">{date.toLocaleDateString('pt-BR', { month: 'short' })}</p>
        <p className="text-xl md:text-2xl font-black text-foreground mt-0 md:mt-1 italic font-mono">{date.getDate()}</p>
      </div>

      {/* CONFRONTO (DARK PRO) */}
      <div className="flex-1 flex items-center justify-between w-full max-w-2xl px-2 md:px-12 md:border-x border-border">
        <div className="flex flex-col-reverse md:flex-row items-center gap-2 md:gap-5 w-5/12 justify-center md:justify-end text-center md:text-right">
           <span className="text-xs font-black text-muted uppercase tracking-tight group-hover:text-foreground transition-colors hidden sm:block">{partida.equipeCasa.nome}</span>
           <div className="w-12 h-12 p-2 bg-background border border-border rounded-xl group-hover:border-accent transition-colors shadow-md">
              <img src={resolverEscudo(partida.equipeCasa.escudoUrl, partida.equipeCasa.nome)} className="max-h-full max-w-full object-contain mx-auto" alt="" />
           </div>
        </div>

        <div className="w-2/12 flex justify-center">
           {isEncerrada ? (
             <div className="flex items-center gap-2 bg-foreground text-background px-4 py-1.5 rounded-lg font-mono font-black text-sm italic">
                <span>{partida.golsCasa}</span>
                <span className="text-muted not-italic">-</span>
                <span>{partida.golsVisitante}</span>
             </div>
           ) : (
             <div className="text-[9px] font-black uppercase text-accent tracking-[0.2em] border border-accent/20 px-3 py-1.5 rounded-full bg-accent/5 animate-pulse text-center">
                {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
             </div>
           )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5 w-5/12 justify-center md:justify-start text-center md:text-left">
           <div className="w-12 h-12 p-2 bg-background border border-border rounded-xl group-hover:border-accent transition-colors shadow-md">
              <img src={resolverEscudo(partida.equipeVisitante.escudoUrl, partida.equipeVisitante.nome)} className="max-h-full max-w-full object-contain mx-auto" alt="" />
           </div>
           <span className="text-xs font-black text-muted uppercase tracking-tight group-hover:text-foreground transition-colors hidden sm:block">{partida.equipeVisitante.nome}</span>
        </div>
      </div>

      {/* COMPETIÇÃO */}
      <div className="hidden lg:flex flex-1 flex-col gap-1 items-start pl-12">
         <div className="flex items-center gap-3">
            <Trophy className="w-3.5 h-3.5 text-accent" />
            <span className="text-[9px] font-black uppercase text-muted tracking-[0.2em]">{partida.competicao.nome}</span>
         </div>
         <div className="flex items-center gap-3 mt-1">
            <MapPin className="w-3.5 h-3.5 text-muted" />
            <span className="text-[9px] font-bold text-muted truncate max-w-[150px] uppercase tracking-tighter">{partida.estadio?.nome || 'A definir'}</span>
         </div>
      </div>

      <div className="hidden md:flex w-12 justify-end relative z-10">
         <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all text-muted group-hover:text-background shadow-md">
            <ChevronRight className="w-4 h-4" />
         </div>
      </div>
    </Link>
  );
}

export default function PartidasClient({ todas }: { todas: Partida[] }) {
  const [termoBusca, setTermoBusca] = useState('');
  const [ordemData, setOrdemData] = useState<'desc' | 'asc'>('desc');
  const [mando, setMando] = useState<'todos' | 'mandante' | 'visitante'>('todos');

  const filtradas = todas.filter(p => {
    // Texto
    const searchMatch = 
      p.equipeCasa.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
      p.equipeVisitante.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.competicao.nome.toLowerCase().includes(termoBusca.toLowerCase());
    
    if (!searchMatch) return false;

    // Mando
    if (mando !== 'todos') {
      const isVascoCasa = p.equipeCasa.nome.toUpperCase().includes('VASCO');
      if (mando === 'mandante' && !isVascoCasa) return false;
      if (mando === 'visitante' && isVascoCasa) return false;
    }

    return true;
  });

  const encerradas = filtradas
    .filter(p => p.status.toLowerCase() === 'encerrada')
    .sort((a,b) => ordemData === 'desc' 
      ? new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      : new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );

  const agendadas = filtradas
    .filter(p => p.status.toLowerCase() !== 'encerrada')
    .sort((a,b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()); // Próximos jogos sempre cronológicos? 
    // Ou usar a ordenação selecionada também para os próximos? 
    // Usually upcoming are chronological ASC naturally. Let's keep it ASC always for upcoming, or apply it if the user wants.
    // Let's apply it:
    // .sort((a,b) => ordemData === 'desc' 
    //  ? new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
    //  : new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    // );
    // Actually, "agendadas" usually you want to see the NEXT one first (ASC). If they choose 'desc', they see the furthest one first.
    // I will keep agendadas chronological (ASC) normally, but respect 'desc' if they change it.

  if (ordemData === 'desc') {
    agendadas.sort((a,b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
  } else {
    agendadas.sort((a,b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-12 md:space-y-16 bg-background">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-8 md:pb-12">
        <div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase leading-none mt-2">Calendário</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
           <select 
             value={mando} 
             onChange={e => setMando(e.target.value as any)}
             className="bg-card border border-border rounded-xl py-3 px-4 text-xs font-black text-muted focus:border-accent focus:outline-none transition-all w-full md:w-auto"
           >
             <option value="todos">Todos os Jogos</option>
             <option value="mandante">Jogos como Mandante</option>
             <option value="visitante">Jogos como Visitante</option>
           </select>

           <select 
             value={ordemData} 
             onChange={e => setOrdemData(e.target.value as any)}
             className="bg-card border border-border rounded-xl py-3 px-4 text-xs font-black text-muted focus:border-accent focus:outline-none transition-all w-full md:w-auto"
           >
             <option value="desc">Mais Recentes</option>
             <option value="asc">Mais Antigas</option>
           </select>

           <div className="relative group w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Procurar" 
                value={termoBusca}
                onChange={e => setTermoBusca(e.target.value)}
                className="bg-card border border-border rounded-xl py-3 pl-12 pr-6 text-xs font-black text-foreground focus:border-accent focus:outline-none transition-all w-full md:w-72 placeholder:text-muted" 
              />
           </div>
           
           <div className="hidden md:block bg-card border border-border p-3 rounded-xl">
              <Zap className="w-4 h-4 text-accent" />
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* RESULTADOS */}
        <div className="flex-1 w-full space-y-6">
          <section className="space-y-6">
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted flex items-center gap-6">
               Últimas partidas <div className="flex-1 h-px bg-border" />
            </h2>
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden divide-y divide-border">
               {encerradas.length > 0 ? encerradas.map(p => <MatchRow key={p.id} partida={p} />) : <p className="p-8 text-center text-muted text-sm font-black uppercase tracking-widest">Nenhuma partida encontrada</p>}
            </div>
          </section>
        </div>

        {/* PRÓXIMOS JOGOS */}
        {agendadas.length > 0 && (
          <div className="w-full lg:w-[350px] shrink-0 space-y-6">
            <section className="space-y-6">
              <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted flex items-center gap-6">
                 Próximas partidas <div className="flex-1 h-px bg-border" />
              </h2>
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden divide-y divide-border">
                 {agendadas.map(p => <MatchRow key={p.id} partida={p} compact={true} />)}
              </div>
            </section>
          </div>
        )}
      </div>

      <footer className="text-center pt-20">
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted">Fonte dos dados: Sofascore</p>
      </footer>
    </div>
  );
}
