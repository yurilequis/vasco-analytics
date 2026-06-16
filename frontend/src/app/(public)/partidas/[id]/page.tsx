import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import CardFormacoes from '@/components/CardFormacoes';
import Link from 'next/link';
import { Calendar, Users, MapPin, PlayCircle, Cloud } from 'lucide-react';


export const revalidate = 60; // ISR: revalida a cada 60s

// ── Tipos ─────────────────────────────────────────────────────────────

interface EquipeSimples {
  id: number;
  nome: string;
  escudoUrl?: string;
}

interface EventoPartida {
  id: number;
  minuto: number;
  minutoAcrescimo: number;
  tipoEvento: string;
  descricao?: string;
  equipeId: number;
  jogador?: {
    id: number;
    nomePopular: string;
  };
}

interface EstatisticaEquipe {
  id: number;
  equipeId: number;
  formacao?: string;
  posseBola?: number;
  xG?: number;
  chutes: number;
  chutesGol: number;
  chutesFora: number;
  defesasGoleiro: number;
  grandesChances: number;
  passesCompletos: number;
  passesTentados: number;
  faltas: number;
  escanteios: number;
  impedimentos: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
}

interface EstatisticaJogador {
  id: number;
  jogadorId: number;
  equipeId: number;
  titular: boolean;
  minutosJogados: number;
  posicao?: string;
  numeroCamisa?: number;
  gols: number;
  assistencias: number;
  finalizacoes: number;
  passesCertos: number;
  passesTentados: number;
  desarmes: number;
  faltasCometidas: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  notaDesempenho?: number | null;
  posicaoPartida?: string;
  posicaoMediaX?: number;
  posicaoMediaY?: number;
  jogador: {
    id: number;
    nomePopular: string;
    fotoUrl?: string;
    peDominante?: string;
    posicao: string;
    posicaoSecundaria?: string;
    funcoes?: string;
    numeroCamisa?: number;
  };
}

interface PartidaCompleta {
  id: number;
  dataHora: string;
  status: string;
  golsCasa: number | null;
  golsVisitante: number | null;
  golsPenaltisCasa: number | null;
  golsPenaltisVisitante: number | null;
  equipeCasa: EquipeSimples;
  equipeVisitante: EquipeSimples;
  competicao: { 
    nome: string;
    classificacao?: {
      posicao: number; pontos: number; jogos: number;
      vitorias: number; empates: number; derrotas: number;
      golsPro: number; golsContra: number; saldoGols: number;
      equipe: { id: number; nome: string; escudoUrl?: string };
    }[];
  };
  estadio?: { nome: string };
  arbitro?: { nomePopular: string };
  treinadorCasa?: { nome: string };
  treinadorVisitante?: { nome: string };
  eventos?: EventoPartida[];
  estatisticasEquipes?: EstatisticaEquipe[];
  estatisticasJogadores?: EstatisticaJogador[];
}

const GET_DETALHES_PARTIDA = `
  query GetPartidaDetalhes($id: Int!) {
    partida(id: $id) {
      id, dataHora, status, golsCasa, golsVisitante
      competicao { 
        nome 
        classificacao {
          posicao, pontos, jogos, vitorias, empates, derrotas, golsPro, golsContra, saldoGols
          equipe { id, nome, escudoUrl }
        }
      }
      equipeCasa { id, nome, escudoUrl }
      equipeVisitante { id, nome, escudoUrl }
      estadio { nome }
      arbitro { nomePopular }
      treinadorCasa { nome }
      treinadorVisitante { nome }
      eventos {
        id, minuto, minutoAcrescimo, tipoEvento, descricao, equipeId
        jogador { id, nomePopular }
      }
      estatisticasEquipes { 
        equipeId, formacao, posseBola, xG, chutes, chutesGol, chutesFora, defesasGoleiro,
        grandesChances, passesCompletos, passesTentados, faltas, escanteios, impedimentos,
        cartoesAmarelos, cartoesVermelhos
      }
      estatisticasJogadores {
        id, equipeId, minutosJogados, posicaoPartida, numeroCamisa,
        gols, assistencias, passesCompletos,
        desarmes, cartoesAmarelos, cartoesVermelhos, notaDesempenho, titular, posicaoMediaX, posicaoMediaY
        jogador {
          id, nomePopular, fotoUrl, peDominante, posicao, funcoes
        }
      }
    }
  }
`;

function getLogoPath(nome: string) {
  const norm = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
  return `/logos/${norm}.png`;
}

function resolverEscudo(urlDB: string | null | undefined, nome: string) {
  if (urlDB && urlDB.trim() !== '') return urlDB;
  return getLogoPath(nome);
}

export default async function PartidaDetalhesPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const { tab = 'facts' } = await searchParams;
  const partidaId = parseInt(id, 10);
  const session = await getServerSession(authOptions);
  const isAdmin = !!session && session.user?.role === 'ADMIN';

  let json;
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: GET_DETALHES_PARTIDA,
        variables: { id: partidaId },
      }),
      cache: 'no-store'
    });
    json = await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return notFound();
  }

  if (json.errors) {
    console.error('Erro na query partida:', json.errors);
    return notFound();
  }

  const partida = json.data?.partida as PartidaCompleta;
  if (!partida) return notFound();

  const isEncerrada = partida.status.toLowerCase() === 'encerrado' || partida.status.toLowerCase() === 'ft';
  const dataLocal = new Date(partida.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  // Pegar estatísticas dos dois times
  const estEquipeCasa = partida.estatisticasEquipes?.find(e => e.equipeId === partida.equipeCasa.id);
  const estEquipeVisitante = partida.estatisticasEquipes?.find(e => e.equipeId === partida.equipeVisitante.id);
  
  // Separar e ordenar eventos
  const eventos = [...(partida.eventos || [])].sort((a, b) => a.minuto - b.minuto);

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* HEADER BANNER FOTMOB STYLE */}
      <div className="bg-[#151515] text-white">
         <header className="max-w-4xl mx-auto pt-8">
            <div className="flex flex-col gap-6">
               <div className="text-center text-xs font-bold text-muted uppercase tracking-widest flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {partida.competicao.nome} • {dataLocal}
               </div>

               <div className="flex items-center justify-between px-4 md:px-12">
                  <div className="flex flex-1 items-center justify-end gap-6">
                     <h2 className="text-xl md:text-2xl font-bold text-foreground text-right">{partida.equipeCasa.nome}</h2>
                     <img src={resolverEscudo(partida.equipeCasa.escudoUrl, partida.equipeCasa.nome)} className="w-14 h-14 md:w-16 md:h-16 object-contain" alt="" />
                  </div>

                  <div className="flex flex-col items-center justify-center px-10 shrink-0">
                     <div className="text-4xl md:text-5xl font-bold text-foreground flex items-center gap-4">
                        <span>{partida.golsCasa ?? '-'}</span>
                        <span className="text-muted text-3xl font-light">-</span>
                        <span>{partida.golsVisitante ?? '-'}</span>
                     </div>
                     <div className="text-xs text-muted mt-2 uppercase font-bold tracking-widest">
                        {isEncerrada ? 'Encerrado' : partida.status}
                     </div>
                  </div>

                  <div className="flex flex-1 items-center justify-start gap-6">
                     <img src={resolverEscudo(partida.equipeVisitante.escudoUrl, partida.equipeVisitante.nome)} className="w-14 h-14 md:w-16 md:h-16 object-contain" alt="" />
                     <h2 className="text-xl md:text-2xl font-bold text-foreground">{partida.equipeVisitante.nome}</h2>
                  </div>
               </div>

               {/* Nav Tabs */}
               <div className="flex items-center gap-8 px-6 pt-4 text-sm font-semibold border-b border-border/50">
                  <Link href="?tab=facts" scroll={false} className={`pb-4 border-b-2 transition-colors ${tab === 'facts' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'}`}>Resumo</Link>
                  <Link href="?tab=lineup" scroll={false} className={`pb-4 border-b-2 transition-colors ${tab === 'lineup' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'}`}>Escalação</Link>
                  <Link href="?tab=table" scroll={false} className={`pb-4 border-b-2 transition-colors ${tab === 'table' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'}`}>Tabela</Link>
                  <Link href="?tab=stats" scroll={false} className={`pb-4 border-b-2 transition-colors ${tab === 'stats' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-white'}`}>Estatísticas</Link>
               </div>
            </div>
         </header>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

         {tab === 'facts' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 space-y-6">
                 {/* STATS HIGHLIGHTS */}
                 <section className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-foreground mb-6 text-center">Estatísticas Principais</h3>
                    <div className="space-y-6 max-w-2xl mx-auto">
                      {[
                        { label: 'Posse de bola', c: estEquipeCasa?.posseBola, f: estEquipeVisitante?.posseBola, sfx: '%' },
                        { label: 'Gols esperados (xG)', c: estEquipeCasa?.xG, f: estEquipeVisitante?.xG, dec: 2 },
                        { label: 'Total de finalizações', c: estEquipeCasa?.chutes, f: estEquipeVisitante?.chutes },
                        { label: 'Finalizações no gol', c: estEquipeCasa?.chutesGol, f: estEquipeVisitante?.chutesGol },
                        { label: 'Escanteios', c: estEquipeCasa?.escanteios, f: estEquipeVisitante?.escanteios },
                      ].map(stat => {
                        const v1 = stat.c ?? 0, v2 = stat.f ?? 0;
                        const total = v1 + v2;
                        const pct = total === 0 ? 50 : (v1 / total) * 100;
                        const dc = stat.dec ? Number(stat.c ?? 0).toFixed(stat.dec) : (stat.c ?? '0');
                        const df = stat.dec ? Number(stat.f ?? 0).toFixed(stat.dec) : (stat.f ?? '0');
                        const noData = stat.c == null && stat.f == null;
                        
                        return (
                          <div key={stat.label} className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-foreground text-center">{stat.label}</span>
                            <div className="flex items-center gap-4">
                              <div className={`w-10 text-right text-xs font-bold ${noData ? 'text-muted' : (v1 >= v2 ? 'text-foreground' : 'text-muted')}`}>
                                {noData ? '-' : `${dc}${stat.sfx || ''}`}
                              </div>
                              <div className="flex-1 flex h-2.5 rounded-full overflow-hidden bg-background">
                                <div className={`h-full ${v1 >= v2 && !noData ? 'bg-white' : 'bg-muted'} transition-all`} style={{ width: `${noData ? 50 : pct}%` }} />
                                <div className={`h-full ${v2 > v1 && !noData ? 'bg-accent' : 'bg-[#eab308]'} transition-all`} style={{ width: `${noData ? 50 : 100 - pct}%` }} />
                              </div>
                              <div className={`w-10 text-left text-xs font-bold ${noData ? 'text-muted' : (v2 >= v1 ? 'text-foreground' : 'text-muted')}`}>
                                {noData ? '-' : `${df}${stat.sfx || ''}`}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-8 text-center border-t border-border/50 pt-4">
                      <Link href="?tab=stats" scroll={false} className="text-xs font-bold text-muted hover:text-foreground uppercase tracking-widest transition-colors">Ver todas estatísticas</Link>
                    </div>
                 </section>

                 {/* EVENTS TIMELINE */}
                 <section className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-foreground mb-8 text-center border-b border-border/50 pb-4">Eventos</h3>
                    <div className="relative space-y-6 max-w-xl mx-auto">
                       {eventos.map(ev => {
                         const tipo = ev.tipoEvento.toUpperCase();
                         const isCasa = ev.equipeId === partida.equipeCasa.id;
                         const isGoal = tipo.includes('GOAL');
                         const isYellow = tipo.includes('YELLOW');
                         const isRed = tipo.includes('RED');
                         const isSub = tipo.includes('SUB');

                         return (
                           <div key={ev.id} className={`flex items-center w-full relative ${isCasa ? 'flex-row' : 'flex-row-reverse'}`}>
                              <div className={`w-[45%] flex flex-col ${isCasa ? 'items-end text-right' : 'items-start text-left'}`}>
                                 <div className="flex items-center gap-2">
                                    {isCasa && <span className="text-xs font-bold text-foreground">{ev.jogador?.nomePopular || ev.descricao}</span>}
                                    {isGoal && <span className="text-sm">⚽</span>}
                                    {isYellow && <span className="w-2.5 h-3.5 bg-yellow-400 rounded-sm"></span>}
                                    {isRed && <span className="w-2.5 h-3.5 bg-red-500 rounded-sm"></span>}
                                    {isSub && <span className="text-sm">🔄</span>}
                                    {!isCasa && <span className="text-xs font-bold text-foreground">{ev.jogador?.nomePopular || ev.descricao}</span>}
                                 </div>
                              </div>
                              <div className="w-[10%] flex justify-center relative z-10">
                                 <span className="text-xs font-bold text-muted bg-card px-2">{ev.minuto}'</span>
                              </div>
                              <div className="w-[45%]" />
                           </div>
                         )
                       })}
                       {eventos.length === 0 && <p className="text-center text-muted text-sm py-4">Nenhum evento registrado</p>}
                    </div>
                 </section>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 {/* HIGHLIGHTS CARD */}
                 <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                       <PlayCircle className="w-5 h-5 text-red-500" />
                       <div>
                         <h3 className="text-sm font-bold text-foreground leading-tight">Melhores momentos</h3>
                         <p className="text-[10px] text-muted">www.youtube.com</p>
                       </div>
                    </div>
                    <div className="aspect-video bg-background rounded-lg border border-border flex items-center justify-center text-muted relative overflow-hidden group cursor-pointer">
                       <img src="https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity blur-sm" alt="Thumbnail" />
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* MATCH INFO CARD */}
                 <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-muted" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-foreground">{partida.estadio?.nome || 'A definir'}</p>
                          <p className="text-[10px] text-muted">Brasil</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-muted" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-foreground">Público</p>
                          <p className="text-[10px] text-muted">20.133</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                          <Cloud className="w-4 h-4 text-muted" />
                       </div>
                       <div className="flex justify-between flex-1 items-center">
                          <p className="text-xs font-bold text-foreground">Clima</p>
                          <p className="text-xs font-bold text-foreground">23°C</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {tab === 'lineup' && (
           <section className="bg-card border border-border rounded-2xl p-6 overflow-hidden">
              <h3 className="text-sm font-bold text-foreground mb-6 text-center border-b border-border/50 pb-4">Escalações</h3>
              {partida.estatisticasJogadores && partida.estatisticasJogadores.length > 0 ? (
                 <div className="bg-[#151515] rounded-xl border border-border/50 relative overflow-hidden flex flex-col">
                    <CardFormacoes 
                      jogadores={partida.estatisticasJogadores}
                      partidaId={partida.id}
                      isAdmin={isAdmin}
                      idCasa={partida.equipeCasa.id}
                      idVisitante={partida.equipeVisitante.id}
                      nomeCasa={partida.equipeCasa.nome}
                      nomeVisitante={partida.equipeVisitante.nome}
                      escudoCasa={partida.equipeCasa.escudoUrl || null}
                      escudoVisitante={partida.equipeVisitante.escudoUrl || null}
                      treinadorCasa={partida.treinadorCasa?.nome}
                      treinadorVisitante={partida.treinadorVisitante?.nome}
                      formacaoCasa={estEquipeCasa?.formacao || undefined}
                      formacaoVisitante={estEquipeVisitante?.formacao || undefined}
                    />
                 </div>
              ) : (
                 <div className="text-center text-muted text-sm py-12">
                    Escalação não disponível
                 </div>
              )}
           </section>
         )}

         {tab === 'table' && (
           <section className="bg-card border border-border rounded-2xl p-6 overflow-hidden">
              <h3 className="text-sm font-bold text-foreground mb-6 text-center border-b border-border/50 pb-4">Classificação - {partida.competicao.nome}</h3>
              
              {partida.competicao.classificacao && partida.competicao.classificacao.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                       <thead>
                          <tr className="border-b border-border/50 text-muted uppercase text-xs">
                             <th className="p-3 font-medium text-center w-8">#</th>
                             <th className="p-3 font-medium">Equipe</th>
                             <th className="p-3 font-medium text-center">J</th>
                             <th className="p-3 font-medium text-center">V</th>
                             <th className="p-3 font-medium text-center">E</th>
                             <th className="p-3 font-medium text-center">D</th>
                             <th className="p-3 font-medium text-center">SG</th>
                             <th className="p-3 font-bold text-center text-white">Pts</th>
                          </tr>
                       </thead>
                       <tbody>
                          {partida.competicao.classificacao.map((c) => (
                             <tr key={c.equipe.id} className={`border-b border-border/20 hover:bg-white/5 transition-colors ${c.equipe.nome.toUpperCase().includes('VASCO') ? 'bg-white/5' : ''}`}>
                                <td className="p-3 text-center text-muted font-mono">{c.posicao}</td>
                                <td className="p-3 font-medium flex items-center gap-3">
                                   <img src={resolverEscudo(c.equipe.escudoUrl || null, c.equipe.nome)} alt="" className="w-5 h-5 object-contain" />
                                   <span className={c.equipe.nome.toUpperCase().includes('VASCO') ? 'text-white font-bold' : 'text-slate-300'}>{c.equipe.nome}</span>
                                </td>
                                <td className="p-3 text-center text-slate-400">{c.jogos}</td>
                                <td className="p-3 text-center text-slate-400">{c.vitorias}</td>
                                <td className="p-3 text-center text-slate-400">{c.empates}</td>
                                <td className="p-3 text-center text-slate-400">{c.derrotas}</td>
                                <td className="p-3 text-center text-slate-400">{c.saldoGols}</td>
                                <td className="p-3 text-center font-bold text-white">{c.pontos}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              ) : (
                 <div className="text-center text-muted text-sm py-12">
                    Tabela de classificação não disponível
                 </div>
              )}
           </section>
         )}

         {tab === 'stats' && (
           <section className="bg-card border border-border rounded-2xl p-6 overflow-hidden">
              <h3 className="text-sm font-bold text-foreground mb-6 text-center border-b border-border/50 pb-4">Estatísticas Detalhadas</h3>
              {estEquipeCasa && estEquipeVisitante ? (
                 <div className="max-w-2xl mx-auto space-y-6">
                   {[
                     { label: 'Posse de bola', c: estEquipeCasa?.posseBola, f: estEquipeVisitante?.posseBola, sfx: '%' },
                     { label: 'Gols esperados (xG)', c: estEquipeCasa?.xG, f: estEquipeVisitante?.xG, dec: 2 },
                     { label: 'Total de finalizações', c: estEquipeCasa?.chutes, f: estEquipeVisitante?.chutes },
                     { label: 'Finalizações no gol', c: estEquipeCasa?.chutesGol, f: estEquipeVisitante?.chutesGol },
                     { label: 'Finalizações para fora', c: estEquipeCasa?.chutesFora, f: estEquipeVisitante?.chutesFora },
                     { label: 'Grandes chances', c: estEquipeCasa?.grandesChances, f: estEquipeVisitante?.grandesChances },
                     { label: 'Passes certos', c: estEquipeCasa?.passesCompletos, f: estEquipeVisitante?.passesCompletos },
                     { label: 'Passes tentados', c: estEquipeCasa?.passesTentados, f: estEquipeVisitante?.passesTentados },
                     { label: 'Faltas', c: estEquipeCasa?.faltas, f: estEquipeVisitante?.faltas },
                     { label: 'Escanteios', c: estEquipeCasa?.escanteios, f: estEquipeVisitante?.escanteios },
                     { label: 'Impedimentos', c: estEquipeCasa?.impedimentos, f: estEquipeVisitante?.impedimentos },
                     { label: 'Defesas do Goleiro', c: estEquipeCasa?.defesasGoleiro, f: estEquipeVisitante?.defesasGoleiro },
                     { label: 'Cartões Amarelos', c: estEquipeCasa?.cartoesAmarelos, f: estEquipeVisitante?.cartoesAmarelos },
                     { label: 'Cartões Vermelhos', c: estEquipeCasa?.cartoesVermelhos, f: estEquipeVisitante?.cartoesVermelhos },
                   ].map(stat => {
                     const v1 = stat.c ?? 0, v2 = stat.f ?? 0;
                     const total = v1 + v2;
                     const pct = total === 0 ? 50 : (v1 / total) * 100;
                     const dc = stat.dec ? Number(stat.c ?? 0).toFixed(stat.dec) : (stat.c ?? '0');
                     const df = stat.dec ? Number(stat.f ?? 0).toFixed(stat.dec) : (stat.f ?? '0');
                     const noData = stat.c == null && stat.f == null;
                     
                     return (
                       <div key={stat.label} className="flex flex-col gap-2">
                         <span className="text-xs font-bold text-foreground text-center">{stat.label}</span>
                         <div className="flex items-center gap-4">
                           <div className={`w-10 text-right text-xs font-bold ${noData ? 'text-muted' : (v1 >= v2 ? 'text-foreground' : 'text-muted')}`}>
                             {noData ? '-' : `${dc}${stat.sfx || ''}`}
                           </div>
                           <div className="flex-1 flex h-2.5 rounded-full overflow-hidden bg-background border border-border/50">
                             <div className={`h-full ${v1 >= v2 && !noData ? 'bg-white' : 'bg-muted'} transition-all`} style={{ width: `${noData ? 50 : pct}%` }} />
                             <div className={`h-full ${v2 > v1 && !noData ? 'bg-accent' : 'bg-[#eab308]'} transition-all`} style={{ width: `${noData ? 50 : 100 - pct}%` }} />
                           </div>
                           <div className={`w-10 text-left text-xs font-bold ${noData ? 'text-muted' : (v2 >= v1 ? 'text-foreground' : 'text-muted')}`}>
                             {noData ? '-' : `${df}${stat.sfx || ''}`}
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
              ) : (
                 <div className="text-center text-muted text-sm py-12">
                    Estatísticas detalhadas não disponíveis
                 </div>
              )}
           </section>
         )}

      </main>
    </div>
  );
}
