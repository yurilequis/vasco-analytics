"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, AlertTriangle, Users, Target } from 'lucide-react';
import { getLogoPath } from '@/utils/logoHelper';

interface Estatistica {
  notaDesempenho: number | null;
  gols: number;
  assistencias: number;
  minutosJogados: number;
  partida?: {
    dataHora: string;
  };
}

interface JogadorDash {
  id: number;
  nomePopular: string;
  posicao: string;
  estatisticas: Estatistica[];
  perfilFM: {
    potencial?: number;
  } | null;
}

export default function Dashboard() {
  const [jogadores, setJogadores] = useState<JogadorDash[]>([]);
  const [partidas, setPartidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [temporada, setTemporada] = useState<'2025' | '2026' | 'geral'>('geral');

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const query = `
          query {
            jogadoresPorClube(clube: "Vasco") {
              id
              nomePopular
              posicao
              estatisticas(take: 50) {
                notaDesempenho
                gols
                assistencias
                minutosJogados
                partida {
                  dataHora
                }
              }
            }
            partidas {
              id
              dataHora
              status
              golsCasa
              golsVisitante
              equipeCasa { nome }
              equipeVisitante { nome }
              competicao {
                nome
                classificacao {
                  posicao
                  equipe { nome }
                }
              }
            }
          }
        `;
        const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const json = await res.json();
        setJogadores(json.data?.jogadoresPorClube || []);
        setPartidas(json.data?.partidas || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    buscarDados();
  }, []);

  if (loading) return <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.5em] text-xs">Carregando Inteligência...</div>;

  // Process data based on season
  const jogadoresFiltrados = jogadores.filter(j => j != null).map(j => {
    const stats = (j.estatisticas || []).filter(e => {
      if (!e) return false;
      if (temporada === 'geral') return true;
      if (!e.partida?.dataHora) return true; // fallback
      return e.partida.dataHora.startsWith(temporada);
    });

    const totalGols = stats.reduce((sum, e) => sum + (e?.gols || 0), 0);
    const totalAssists = stats.reduce((sum, e) => sum + (e?.assistencias || 0), 0);
    const totalMinutos = stats.reduce((sum, e) => sum + (e?.minutosJogados || 0), 0);
    const notasValidas = stats.filter(e => e?.notaDesempenho != null).map(e => e?.notaDesempenho as number);
    const notaMedia = notasValidas.length > 0 ? notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length : null;

    return { ...j, totalGols, totalAssists, totalMinutos, notaMedia, partidas: stats.length };
  });

  const partidasFiltradas = partidas.filter(p => {
    if (!p) return false;
    if (temporada === 'geral') return true;
    return p.dataHora?.startsWith(temporada);
  });

  const partidasEncerradas = partidasFiltradas.filter(p => p?.status?.toLowerCase() === 'encerrada');
  const ultimas5 = [...partidasEncerradas].sort((a,b) => new Date(b?.dataHora || 0).getTime() - new Date(a?.dataHora || 0).getTime()).slice(0, 5);
  
  let vitorias = 0, empates = 0, derrotas = 0, golsMarcados = 0, golsSofridos = 0;
  let forma = ultimas5.map(p => {
    const isVascoCasa = p?.equipeCasa?.nome?.includes('Vasco');
    const golsV = isVascoCasa ? p?.golsCasa : p?.golsVisitante;
    const golsA = isVascoCasa ? p?.golsVisitante : p?.golsCasa;
    if (golsV > golsA) return 'V';
    if (golsV < golsA) return 'D';
    return 'E';
  }).reverse();

  partidasEncerradas.forEach(p => {
    if (!p) return;
    const isVascoCasa = p?.equipeCasa?.nome?.includes('Vasco');
    const golsV = isVascoCasa ? p?.golsCasa : p?.golsVisitante;
    const golsA = isVascoCasa ? p?.golsVisitante : p?.golsCasa;
    if (golsV !== null && golsV !== undefined) golsMarcados += golsV;
    if (golsA !== null && golsA !== undefined) golsSofridos += golsA;
    if (golsV > golsA) vitorias++;
    else if (golsV < golsA) derrotas++;
    else empates++;
  });

  const pts = (vitorias * 3) + empates;
  const maxPts = partidasEncerradas.length * 3;
  const aproveitamento = maxPts > 0 ? ((pts / maxPts) * 100).toFixed(1) : '0.0';
  const saldoGols = golsMarcados - golsSofridos;

  const artilheiros = [...jogadoresFiltrados].sort((a, b) => (b?.totalGols || 0) - (a?.totalGols || 0)).slice(0, 3);
  const garcons = [...jogadoresFiltrados].sort((a, b) => (b?.totalAssists || 0) - (a?.totalAssists || 0)).slice(0, 3);
  const melhoresNotas = [...jogadoresFiltrados].filter(p => p?.notaMedia !== null && (p?.partidas || 0) >= 3).sort((a, b) => (b?.notaMedia || 0) - (a?.notaMedia || 0)).slice(0, 3);

  // Classificação atual (do último jogo da competição principal, e.g. Brasileirão)
  let classificacaoVasco = null;
  let zona = { texto: '-', cor: 'text-slate-500', bg: 'bg-slate-900' };
  
  const campeonato = partidasFiltradas.find(p => p.competicao?.nome?.includes('Brasileirão'));
  if (campeonato && Array.isArray(campeonato.competicao.classificacao)) {
     const vascoItem = campeonato.competicao.classificacao.find((c: any) => c?.equipe?.nome?.includes('Vasco'));
     if (vascoItem) {
        classificacaoVasco = vascoItem.posicao;
        if (classificacaoVasco <= 4) zona = { texto: 'G4: Libertadores', cor: 'text-emerald-500', bg: 'bg-emerald-500/10' };
        else if (classificacaoVasco <= 6) zona = { texto: 'G6: Pré-Libertadores', cor: 'text-sky-500', bg: 'bg-sky-500/10' };
        else if (classificacaoVasco <= 12) zona = { texto: 'Sul-Americana', cor: 'text-amber-500', bg: 'bg-amber-500/10' };
        else if (classificacaoVasco >= 17) zona = { texto: 'Z4: Rebaixamento', cor: 'text-rose-500', bg: 'bg-rose-500/10' };
        else zona = { texto: 'Meio de Tabela', cor: 'text-slate-400', bg: 'bg-slate-800' };
     }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
         <div className="flex items-center gap-6">
            <img src={getLogoPath('Vasco')} alt="Vasco" className="w-16 h-16 object-contain drop-shadow-xl" />
            <div>
               <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Inteligência de Elenco</h1>
               <p className="text-muted font-bold text-sm mt-1 uppercase tracking-widest">Dashboard de Scouting e Performance</p>
            </div>
         </div>
         <select
            value={temporada}
            onChange={(e) => setTemporada(e.target.value as any)}
            className="bg-card border border-border rounded-xl py-3 px-6 text-sm font-black text-foreground shadow-sm focus:border-accent focus:outline-none transition-all uppercase tracking-widest cursor-pointer"
         >
            <option value="geral">Todas Temporadas</option>
            <option value="2026">Temporada 2026</option>
            <option value="2025">Temporada 2025</option>
         </select>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* TOP SCORERS */}
        <section className="bg-card p-6 md:p-8 rounded-xl border border-border">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2 mb-6">
            <Target className="w-4 h-4" /> Artilheiros
          </h3>
          <div className="space-y-4">
            {artilheiros.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-muted italic">{i + 1}</span>
                  <div>
                    <Link href={`/elenco/${p.id}`} className="text-sm font-black text-foreground hover:text-accent transition-colors block">{p.nomePopular}</Link>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted">{p.posicao}</span>
                  </div>
                </div>
                <div className="text-xl font-black text-accent">{p.totalGols}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TOP ASSISTS */}
        <section className="bg-card p-6 md:p-8 rounded-xl border border-border">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2 mb-6">
            <Users className="w-4 h-4" /> Assistências
          </h3>
          <div className="space-y-4">
            {garcons.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-muted italic">{i + 1}</span>
                  <div>
                    <Link href={`/elenco/${p.id}`} className="text-sm font-black text-foreground hover:text-accent transition-colors block">{p.nomePopular}</Link>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted">{p.posicao}</span>
                  </div>
                </div>
                <div className="text-xl font-black text-accent">{p.totalAssists}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BEST RATINGS */}
        <section className="bg-card p-6 md:p-8 rounded-xl border border-border">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4" /> Maiores Notas
          </h3>
          <div className="space-y-4">
            {melhoresNotas.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-muted italic">{i + 1}</span>
                  <div>
                    <Link href={`/elenco/${p.id}`} className="text-sm font-black text-foreground hover:text-accent transition-colors block">{p.nomePopular}</Link>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted">{p.partidas} Partidas</span>
                  </div>
                </div>
                <div className="text-xl font-black text-accent">{p.notaMedia?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* VASCO PERFORMANCE */}
      <section className="bg-card p-6 md:p-10 rounded-xl border border-border relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />
         <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10 mb-10">
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2 flex items-center gap-2">
                 <Target className="w-4 h-4" /> Desempenho Coletivo
               </h3>
               <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tight">Estatísticas do Clube</h2>
            </div>
            
            {classificacaoVasco && (
              <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted mb-2">Situação Atual no Brasileirão</p>
                 <div className="flex items-center gap-4">
                    <span className="text-5xl font-black text-foreground font-mono italic">{classificacaoVasco}º</span>
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${zona.bg} ${zona.cor}`}>
                       {zona.texto}
                    </span>
                 </div>
              </div>
            )}
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
            {[
              { label: 'Jogos', value: partidasEncerradas.length },
              { label: 'Vitórias', value: vitorias, color: 'text-emerald-500' },
              { label: 'Empates', value: empates, color: 'text-muted' },
              { label: 'Derrotas', value: derrotas, color: 'text-rose-500' },
              { label: 'Gols Pró', value: golsMarcados },
              { label: 'Gols Sofr', value: golsSofridos },
              { label: 'Saldo', value: saldoGols > 0 ? `+${saldoGols}` : saldoGols },
              { label: 'Aprov', value: `${aproveitamento}%` }
            ].map(stat => (
               <div key={stat.label} className="bg-background border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-2">{stat.label}</p>
                  <p className={`text-2xl font-black font-mono italic ${stat.color || 'text-foreground'}`}>{stat.value}</p>
               </div>
            ))}
         </div>

         <div className="mt-8 pt-8 border-t border-border relative z-10">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-4">Forma (Últimos 5 jogos)</p>
            <div className="flex gap-2">
               {forma.map((r, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                     r === 'V' ? 'bg-emerald-500 text-white' : 
                     r === 'E' ? 'bg-slate-600 text-white' : 
                     'bg-rose-500 text-white'
                  }`}>
                     {r}
                  </div>
               ))}
               {forma.length === 0 && <span className="text-xs text-slate-600 font-bold">Sem dados recentes</span>}
            </div>
         </div>
      </section>

    </div>
  );
}
