import React from 'react';
import Link from 'next/link';
import { getLogoPath } from '@/utils/logoHelper';
import CardFormacoes from '@/components/CardFormacoes';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ChevronRight } from 'lucide-react';

// ── CONTRATOS ─────────────────────────────
interface Partida {
  id: number;
  dataHora: string;
  status: string;
  competicao: { 
    nome: string;
    classificacao?: {
      posicao: number; pontos: number; jogos: number;
      vitorias: number; empates: number; derrotas: number;
      golsPro: number; golsContra: number; saldoGols: number;
      equipe: { id: number; nome: string; escudoUrl: string | null };
    }[];
  };
  equipeCasa: { id: number; nome: string; escudoUrl: string | null };
  equipeVisitante: { id: number; nome: string; escudoUrl: string | null };
  golsCasa: number | null;
  golsVisitante: number | null;
  estatisticasJogadores?: any[];
  treinadorCasa?: { nome: string };
  treinadorVisitante?: { nome: string };
}

const GET_DASHBOARD_DATA = `
  query {
    partidas {
      id, dataHora, status
      competicao { 
        nome 
        classificacao {
          posicao, pontos, jogos, vitorias, empates, derrotas, golsPro, golsContra, saldoGols
          equipe { id, nome, escudoUrl }
        }
      }
      equipeCasa { id, nome, escudoUrl }
      golsCasa, golsVisitante
      equipeVisitante { id, nome, escudoUrl }
      treinadorCasa { nome }
      treinadorVisitante { nome }
      estatisticasJogadores {
        id, equipeId, numeroCamisa, titular, notaDesempenho, minutosJogados, gols, assistencias, passesCompletos, desarmes, posicaoMediaX, posicaoMediaY, heatmapUrl, cartoesAmarelos, cartoesVermelhos, posicaoPartida
        jogador { id, nomePopular, posicao, posicaoSecundaria, funcoes, fotoUrl, peDominante, numeroCamisa }
      }
    }
  }
`;

async function fetchDashboardData(): Promise<Partida[]> {
  try {
    const resposta = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_DASHBOARD_DATA }),
      cache: 'no-store',
    });
    const resultado = await resposta.json();
    return resultado.data?.partidas || [];
  } catch (e) {
    return [];
  }
}

function resolverEscudo(url: string | null, nome: string) {
  if (url) return url;
  return getLogoPath(nome);
}

// Helper to calculate Form
function getFormBadge(p: Partida) {
  const isVascoCasa = p.equipeCasa.nome.includes('Vasco');
  const golsVasco = isVascoCasa ? p.golsCasa : p.golsVisitante;
  const golsAdv = isVascoCasa ? p.golsVisitante : p.golsCasa;
  const advEscudo = resolverEscudo(isVascoCasa ? p.equipeVisitante.escudoUrl : p.equipeCasa.escudoUrl, isVascoCasa ? p.equipeVisitante.nome : p.equipeCasa.nome);
  
  if (golsVasco == null || golsAdv == null) return null;
  
  let type = 'D'; // Draw
  let color = 'bg-[#3b3b3b]'; // Gray
  if (golsVasco > golsAdv) { type = 'W'; color = 'bg-accent'; } // Green
  else if (golsVasco < golsAdv) { type = 'L'; color = 'bg-[#e63946]'; } // Red

  return { result: `${golsVasco}-${golsAdv}`, type, color, advEscudo };
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = !!session && session.user?.role === 'ADMIN';
  
  const partidas = await fetchDashboardData();
  const encerradas = partidas.filter(p => p.status.toLowerCase() === 'encerrada').sort((a,b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
  const agendadas = partidas.filter(p => p.status.toLowerCase() !== 'encerrada').sort((a,b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  
  const ultima = encerradas[0];
  const proxima = agendadas[0];

  const recentForm = encerradas.slice(0, 5).reverse().map(getFormBadge).filter(Boolean);

  // Extrair classificação real da primeira partida que a possuir (geralmente Brasileirão)
  const compComTabela = partidas.find(p => p.competicao?.classificacao && p.competicao.classificacao.length > 0)?.competicao;
  const tabelaReal = compComTabela?.classificacao || [];

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-6">
      
      {/* HEADER CARD */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
         <div className="p-8 flex items-center gap-6 pb-6">
            <div className="w-20 h-20 p-2">
               <img src={getLogoPath('Vasco da Gama')} className="w-full h-full object-contain" alt="Vasco da Gama" />
            </div>
            <div>
               <h1 className="text-3xl font-bold text-foreground tracking-tight">Vasco da Gama</h1>
               <p className="text-sm text-muted mt-1">Brasil</p>
            </div>
            <div className="ml-auto">
               {isAdmin && (
                 <button className="px-4 py-2 text-sm font-medium border border-border text-foreground hover:bg-white/5 rounded-full transition-colors flex items-center gap-2">
                   Sincronizar calendário
                 </button>
               )}
            </div>
         </div>
         {/* TABS */}
         <div className="px-8 flex gap-6 border-b border-border text-sm font-medium">
            <Link href="/" className="pb-3 border-b-2 border-accent text-foreground">Visão Geral</Link>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TEAM FORM */}
              <div className="bg-card rounded-2xl border border-border p-6 flex flex-col">
                 <h2 className="text-sm font-bold text-foreground mb-4">Desempenho</h2>
                 <div className="flex gap-3 mt-auto">
                    {recentForm.map((f, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                         <div className={`text-xs font-bold text-white px-2 py-1 rounded w-full text-center ${f!.color}`}>
                           {f!.result}
                         </div>
                         <div className="w-6 h-6 mt-1">
                           <img src={f!.advEscudo} className="w-full h-full object-contain" alt="" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* NEXT MATCH */}
              <div className="bg-card rounded-2xl border border-border p-6 flex flex-col relative group cursor-pointer hover:bg-white/[0.02] transition-colors">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-foreground">Próxima partida</h2>
                    <span className="text-xs text-muted font-medium flex items-center gap-1">{proxima?.competicao.nome}</span>
                 </div>
                 {proxima ? (
                   <Link href={`/partidas/${proxima.id}`} className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col items-center gap-2 w-16">
                         <img src={resolverEscudo(proxima.equipeCasa.escudoUrl, proxima.equipeCasa.nome)} className="w-10 h-10 object-contain" alt="" />
                         <span className="text-[10px] text-muted text-center truncate w-full">{proxima.equipeCasa.nome.split(' ')[0]}</span>
                      </div>
                      <div className="flex flex-col items-center">
                         <span className="text-sm font-bold text-foreground">
                           {new Date(proxima.dataHora).toLocaleTimeString('pt-BR', { hour: 'numeric', minute: '2-digit' })}
                         </span>
                         <span className="text-xs text-muted mt-1 uppercase">
                           {new Date(proxima.dataHora).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }).replace('.', '')}
                         </span>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-16">
                         <img src={resolverEscudo(proxima.equipeVisitante.escudoUrl, proxima.equipeVisitante.nome)} className="w-10 h-10 object-contain" alt="" />
                         <span className="text-[10px] text-muted text-center truncate w-full">{proxima.equipeVisitante.nome.split(' ').slice(-1)[0]}</span>
                      </div>
                   </Link>
                 ) : (
                   <div className="mt-auto text-center text-sm text-muted">Nenhuma partida agendada</div>
                 )}
              </div>
           </div>

           {/* TABLE MOCKUP */}
           <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                 <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Trophy className="w-3 h-3 text-white" />
                 </div>
                 <h2 className="text-sm font-bold text-foreground">{compComTabela?.nome || 'Classificação'}</h2>
                 <Link href={compComTabela ? `/partidas` : '#'} className="ml-auto">
                    <ChevronRight className="w-4 h-4 text-muted hover:text-foreground" />
                 </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-muted border-b border-border/50 text-xs">
                      <th className="py-2 px-2 font-normal w-8 text-center">#</th>
                      <th className="py-2 px-2 font-normal">Equipe</th>
                      <th className="py-2 px-2 font-normal text-center w-8">J</th>
                      <th className="py-2 px-2 font-normal text-center w-8">V</th>
                      <th className="py-2 px-2 font-normal text-center w-8">E</th>
                      <th className="py-2 px-2 font-normal text-center w-8">D</th>
                      <th className="py-2 px-2 font-normal text-center w-12">+/-</th>
                      <th className="py-2 px-2 font-normal text-center w-8">SG</th>
                      <th className="py-2 px-2 font-bold text-foreground text-center w-8">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabelaReal.length > 0 ? (
                       tabelaReal.map((team) => {
                          const isVasco = team.equipe.nome.toUpperCase().includes('VASCO');
                          let posBg = '';
                          if (team.posicao <= 4) posBg = 'bg-emerald-500 text-white';
                          else if (team.posicao <= 6) posBg = 'bg-sky-500 text-white';
                          else if (team.posicao <= 12) posBg = 'bg-amber-500 text-white';
                          else if (team.posicao >= 17) posBg = 'bg-rose-500 text-white';
                          else posBg = 'bg-transparent text-muted';

                          return (
                          <tr key={team.equipe.id} className={`border-b border-border/30 last:border-0 hover:bg-white/[0.02] ${isVasco ? 'bg-white/[0.03]' : ''}`}>
                            <td className="py-2.5 px-2 text-center text-xs">
                               <div className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center font-bold ${posBg}`}>
                                  {team.posicao}
                               </div>
                            </td>
                            <td className="py-2.5 px-2 flex items-center gap-3">
                               <img src={resolverEscudo(team.equipe.escudoUrl, team.equipe.nome)} className="w-5 h-5 object-contain" alt="" />
                               <span className={isVasco ? 'font-bold text-foreground' : 'font-medium text-foreground/90'}>{team.equipe.nome}</span>
                            </td>
                            <td className="py-2.5 px-2 text-center text-muted">{team.jogos}</td>
                            <td className="py-2.5 px-2 text-center text-muted">{team.vitorias}</td>
                            <td className="py-2.5 px-2 text-center text-muted">{team.empates}</td>
                            <td className="py-2.5 px-2 text-center text-muted">{team.derrotas}</td>
                            <td className="py-2.5 px-2 text-center text-muted">{team.golsPro}-{team.golsContra}</td>
                            <td className="py-2.5 px-2 text-center text-muted">{team.saldoGols > 0 ? `+${team.saldoGols}` : team.saldoGols}</td>
                            <td className="py-2.5 px-2 text-center font-bold text-foreground">{team.pontos}</td>
                          </tr>
                          );
                       })
                    ) : (
                       <tr><td colSpan={9} className="text-center py-8 text-muted">Tabela indisponível</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

         {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 xl:col-span-4">
           <div className="bg-card rounded-2xl border border-border p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex flex-col">
                    <span className="text-accent text-xs font-bold uppercase mb-1">Última escalação</span>
                 </div>
                 <Link href={ultima ? `/partidas/${ultima.id}?tab=lineup` : '#'} className="text-xs text-muted hover:text-foreground transition-colors">Ir à Partida</Link>
              </div>
              
              <div className="flex-1 bg-transparent relative overflow-hidden flex flex-col">
                 {(() => {
                    const p = encerradas.find(x => x.estatisticasJogadores && x.estatisticasJogadores.length > 0);
                    if (!p) return <div className="m-auto text-muted text-sm">Escalação indisponível</div>;
                    const isCasa = p.equipeCasa.nome.toUpperCase().includes('VASCO');
                    const idVasco = isCasa ? p.equipeCasa.id : p.equipeVisitante.id;
                    const escalacaoVasco = (p.estatisticasJogadores || []).filter(j => j.equipeId === idVasco && j.titular).sort((a,b) => {
                       if(a.posicaoPartida === 'G' || a.jogador.posicao === 'G') return -1;
                       if(b.posicaoPartida === 'G' || b.jogador.posicao === 'G') return 1;
                       return 0;
                    });
                    const textoEsc = escalacaoVasco.map(e => e.jogador.nomePopular || e.jogador.nome).join(', ');
                    return (
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-4">
                                <img src={getLogoPath('Vasco da Gama')} className="w-10 h-10 object-contain" alt="Vasco da Gama" />
                                <div>
                                   <h3 className="font-bold text-foreground text-sm">Vasco da Gama</h3>
                                   <p className="text-xs text-muted">vs {isCasa ? p.equipeVisitante.nome : p.equipeCasa.nome}</p>
                                </div>
                             </div>
                          </div>
                          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.05] text-sm text-foreground/90 leading-relaxed">
                             {textoEsc}
                          </div>
                       </div>
                    );
                 })()}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Icon for Serie A mock
function Trophy({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z" />
    </svg>
  );
}
