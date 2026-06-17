'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Flag, Ruler, Shirt, Activity, Award, TrendingUp, ChevronLeft, Target, Shield, Clock, BarChart3, RefreshCw } from 'lucide-react';
import PlayerRadar from '@/components/PlayerRadar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function calcularIdade(dataNascimento: string | null | undefined) {
  if (!dataNascimento) return '--';
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

interface PerfilFM {
  cabeceamento: number | null;
  chutesLonge: number | null;
  cobrancaFalta: number | null;
  cruzamento: number | null;
  desarme: number | null;
  drible: number | null;
  escanteios: number | null;
  finalizacao: number | null;
  laterais: number | null;
  marcacao: number | null;
  passe: number | null;
  penaltis: number | null;
  primeiroToque: number | null;
  tecnica: number | null;
  agressividade: number | null;
  antecipacao: number | null;
  bravura: number | null;
  compostura: number | null;
  concentracao: number | null;
  decisoes: number | null;
  determinacao: number | null;
  imprevisibilidade: number | null;
  indiceTrabalho: number | null;
  lideranca: number | null;
  posicionamento: number | null;
  semBola: number | null;
  trabalhoEquipe: number | null;
  visaoJogo: number | null;
  aceleracao: number | null;
  agilidade: number | null;
  aptidaoNatural: number | null;
  equilibrio: number | null;
  forca: number | null;
  impulsao: number | null;
  resistencia: number | null;
  velocidade: number | null;
}

interface PartidaSimples {
  id: number;
  dataHora: string;
  golsCasa: number | null;
  golsVisitante: number | null;
  equipeCasa: { nome: string, escudoUrl: string | null };
  equipeVisitante: { nome: string, escudoUrl: string | null };
}

interface EstatisticaJogadorPartida {
  id: number;
  titular: boolean;
  notaDesempenho: number | null;
  minutosJogados: number;
  gols: number;
  assistencias: number;
  passesCompletos: number;
  desarmes: number;
  partida: PartidaSimples;
}

interface JogadorDetalhado {
  id: number;
  nomePopular: string;
  nomeCompleto: string | null;
  posicao: string;
  alturaCm: number | null;
  peDominante: string | null;
  dataNascimento: string | null;
  numeroCamisa: number | null;
  fotoUrl: string | null;
  biografia: string | null;
  emprestado: boolean;
  tipoContrato: string;
  perfilFM: PerfilFM | null;
  estatisticas: EstatisticaJogadorPartida[];
}

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = !!session;
  const [jogador, setJogador] = useState<JogadorDetalhado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscar = async () => {
      try {
        const query = `
          query GetPlayer($id: Int!) {
            jogador(id: $id) {
              id, nomePopular, nomeCompleto, posicao, alturaCm, peDominante, 
              dataNascimento, numeroCamisa, fotoUrl, biografia, emprestado, tipoContrato,
              perfilFM {
                cabeceamento, chutesLonge, cobrancaFalta, cruzamento, desarme, drible, escanteios, finalizacao, laterais, marcacao, passe, penaltis, primeiroToque, tecnica,
                agressividade, antecipacao, bravura, compostura, concentracao, decisoes, determinacao, imprevisibilidade, indiceTrabalho, lideranca, posicionamento, semBola, trabalhoEquipe, visaoJogo,
                aceleracao, agilidade, aptidaoNatural, equilibrio, forca, impulsao, resistencia, velocidade
              }
              estatisticas(take: 10) {
                id, titular, notaDesempenho, minutosJogados, gols, assistencias, passesCompletos, desarmes
                partida {
                  id, dataHora, golsCasa, golsVisitante
                  equipeCasa { nome, escudoUrl }
                  equipeVisitante { nome, escudoUrl }
                }
              }
            }
          }
        `;
        const res = await fetch((process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables: { id: Number(params.id) } }),
        });
        const json = await res.json();
        setJogador(json.data?.jogador);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    buscar();
  }, [params.id]);

  if (loading) return <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.5em] text-xs">Carregando Relatório...</div>;
  if (!jogador) return <div className="p-20 text-center text-slate-500">Atleta não localizado.</div>;

  const fm = jogador.perfilFM;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12">
        
        {/* HEADER: CLINICAL PROFILE */}
        <header className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 border-b border-border pb-8 md:pb-12">
          <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-xl bg-card border border-border overflow-hidden shadow-xl">
                {jogador.fotoUrl ? <img src={jogador.fotoUrl} className="w-full h-full object-cover" /> : <Shirt className="w-16 h-16 m-auto mt-16 text-muted" />}
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-emerald-900/30 border-4 border-background">
                {jogador.numeroCamisa || '-'}
              </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                 <span className="text-[10px] font-black uppercase text-accent tracking-[0.3em] bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full">{jogador.posicao}</span>
                 {jogador.emprestado && <span className="text-[10px] font-black uppercase text-orange-400 tracking-[0.3em] bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">Emprestado</span>}
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground italic mb-2 leading-none">{jogador.nomePopular}</h1>
              <p className="text-muted font-bold text-sm tracking-widest uppercase mb-8">{jogador.nomeCompleto || jogador.nomePopular}</p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                 {[
                   { icon: Calendar, label: 'Nascimento', value: jogador.dataNascimento ? new Date(jogador.dataNascimento).toLocaleDateString('pt-BR') : '--', sub: calcularIdade(jogador.dataNascimento) },
                   { icon: Flag, label: 'Nacionalidade', value: 'Brasil' },
                   { icon: Ruler, label: 'Estatura', value: jogador.alturaCm ? `${jogador.alturaCm} cm` : '--' },
                   { icon: Activity, label: 'Pé Dominante', value: jogador.peDominante || 'Destro' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 bg-card border border-border px-6 py-4 rounded-xl min-w-[200px]">
                      <div className="p-3 bg-background rounded-lg border border-border text-accent"><item.icon className="w-5 h-5" /></div>
                      <div>
                         <p className="text-[9px] font-black uppercase text-muted tracking-widest">{item.label}</p>
                         <p className="text-sm font-bold text-foreground">{item.value} {item.sub && <span className="text-muted text-xs">({item.sub} anos)</span>}</p>
                      </div>
                   </div>
                 ))}
              </div>
          </div>

          <div className="bg-card border border-border p-8 rounded-xl text-center shadow-sm min-w-[180px]">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted mb-2">Nota Média (Temp)</p>
              <div className="text-5xl font-black text-foreground font-mono italic">
                {jogador.estatisticas.filter(e => e.notaDesempenho).length > 0 
                  ? (jogador.estatisticas.reduce((s, e) => s + (e.notaDesempenho || 0), 0) / jogador.estatisticas.filter(e => e.notaDesempenho).length).toFixed(1) 
                  : '-'}
              </div>
              <div className="mt-4 flex gap-1 justify-center">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">{jogador.estatisticas.length} Partidas</span>
              </div>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* RADAR & FM STATS */}
            {/* RADAR & FM STATS */}
            <section className="lg:col-span-5 bg-card rounded-xl border border-border p-6 shadow-sm relative overflow-hidden flex flex-col items-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground self-start mb-6 flex items-center gap-4">
                  <Target className="w-4 h-4 text-accent" /> Perfil Técnico
                </h3>
                <div className="h-[260px] w-full">
                  <PlayerRadar fm={fm} />
                </div>
            </section>

            <section className="lg:col-span-7 bg-card p-6 rounded-xl border border-border shadow-sm h-full flex flex-col">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground mb-6 flex items-center gap-4">
                  <Shield className="w-4 h-4 text-accent" /> Biografia
              </h3>
              <p className="text-sm font-medium text-muted leading-relaxed flex-1">
                  {jogador.biografia || "Nenhuma biografia ou observação técnica registrada."}
              </p>
            </section>
        </div>

        {/* HISTÓRICO DE PARTIDAS */}
        <div className="lg:col-span-12">
            <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-8 pb-6 border-b border-border flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground flex items-center gap-4">
                      <Clock className="w-4 h-4 text-accent" /> Últimas Partidas
                  </h3>
                </div>
                <div className="overflow-x-auto w-full pb-6">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border bg-background">
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted">Data</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted">Partida</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted text-center">Nota</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted text-center">Min</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted text-center">G</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted text-center">A</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-muted text-center">Passes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {jogador.estatisticas.map((est) => (
                        <tr key={est.id} className="hover:bg-background transition-colors group">
                          <td className="py-4 px-6 text-xs font-mono font-bold text-muted">
                            {new Date(est.partida.dataHora).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-6">
                            <Link href={`/partidas/${est.partida.id}`} className="flex items-center gap-3 group-hover:text-accent transition-colors">
                              <span className="text-xs font-black uppercase tracking-wider text-muted">{est.partida.equipeCasa.nome}</span>
                              <span className="text-xs font-black text-foreground px-2 py-0.5 bg-background rounded border border-border font-mono">
                                {est.partida.golsCasa} - {est.partida.golsVisitante}
                              </span>
                              <span className="text-xs font-black uppercase tracking-wider text-muted">{est.partida.equipeVisitante.nome}</span>
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-9 h-6 rounded text-[11px] font-mono font-black ${
                              !est.notaDesempenho ? 'bg-background text-muted' :
                              est.notaDesempenho >= 7.5 ? 'bg-accent/20 text-accent border border-accent/40' :
                              est.notaDesempenho >= 7.0 ? 'bg-green-900/50 text-green-400 border border-green-800' :
                              est.notaDesempenho >= 6.0 ? 'bg-amber-900/50 text-amber-400 border border-amber-800' :
                              'bg-rose-900/50 text-rose-400 border border-rose-800'
                            }`}>
                              {est.notaDesempenho ? est.notaDesempenho.toFixed(1) : '-'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-xs font-mono font-bold text-muted">{est.minutosJogados}&apos;</td>
                          <td className="py-4 px-4 text-center text-xs font-mono font-bold text-accent">{est.gols > 0 ? est.gols : <span className="text-muted/50">0</span>}</td>
                          <td className="py-4 px-4 text-center text-xs font-mono font-bold text-accent">{est.assistencias > 0 ? est.assistencias : <span className="text-muted/50">0</span>}</td>
                          <td className="py-4 px-4 text-center text-xs font-mono font-bold text-muted">{est.passesCompletos}</td>
                        </tr>
                      ))}
                      {jogador.estatisticas.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-xs font-black uppercase tracking-widest text-muted">
                            Sem histórico de partidas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
