import React from 'react';
import Link from 'next/link';

// ── CONTRATOS (INTERFACES) ─────────────────────────────
interface Partida {
  id: number;
  dataHora: string;
  status: string;
  competicao: { nome: string };
  equipeCasa: { nome: string };
  equipeVisitante: { nome: string };
  golsCasa: number | null;
  golsVisitante: number | null;
}

// ── BUSCA DE DADOS E LÓGICA ─────────────────────────────
const GET_DASHBOARD_DATA = `
  query {
    partidas {
      id
      dataHora
      status
      competicao { nome }
      equipeCasa { nome }
      golsCasa
      golsVisitante
      equipeVisitante { nome }
    }
  }
`;

async function fetchDashboardData(): Promise<Partida[]> {
  const resposta = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_DASHBOARD_DATA }),
    cache: 'no-store',
  });

  const resultado = await resposta.json();
  if (resultado.errors || !resultado.data) return [];
  return resultado.data.partidas;
}

function formatarDataSimples(dataString?: string | null) {
  if (!dataString) return 'Data a definir';
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return 'A definir';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(data);
}

// Função para calcular Vitória (V), Empate (E) ou Derrota (D) do Vasco
function getResultadoVasco(partida: Partida): 'V' | 'E' | 'D' {
  const isCasa = partida.equipeCasa.nome.toLowerCase().includes('vasco');
  const golsVasco = isCasa ? partida.golsCasa : partida.golsVisitante;
  const golsAdversario = isCasa ? partida.golsVisitante : partida.golsCasa;
  
  if (golsVasco === null || golsAdversario === null) return 'E';
  if (golsVasco > golsAdversario) return 'V';
  if (golsVasco < golsAdversario) return 'D';
  return 'E';
}

// ── TELA PRINCIPAL ──────────────────────────────────────
export default async function Home() {
  const partidas = await fetchDashboardData();

  // Filtros
  const encerradas = partidas.filter(p => p.status.toLowerCase() === 'encerrada');
  const agendadas = partidas.filter(p => p.status.toLowerCase() === 'agendada');

  // Variáveis principais
  const ultimoJogo = encerradas[0]; 
  const proximoJogo = agendadas.length > 0 ? agendadas[agendadas.length - 1] : undefined;
  
  // Pegamos os últimos 5 jogos e invertemos para mostrar do mais antigo (esquerda) para o mais recente (direita)
  const ultimos5Jogos = encerradas.slice(0, 5).reverse();

  return (
    <main className="min-h-screen pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white pt-14 pb-10 dark:border-zinc-800/50 dark:bg-transparent">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[100px] dark:block" />
        <div className="relative mx-auto flex max-w-6xl items-center gap-6 px-6">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-900 shadow-xl ring-1 ring-zinc-800 dark:bg-zinc-950 dark:ring-zinc-800">
            {/* Logo do Vasco Principal */}
            <span className="text-4xl font-black text-red-600">✠</span>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Vasco da Gama
            </h1>
            <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              🇧🇷 Brasil &bull; Estádio São Januário
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        
        {/* 2. GRID SUPERIOR: ÚLTIMO JOGO + PRÓXIMO/FORMA */}
        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
          
          {/* DESTAQUE: Último Jogo (Esquerda) */}
          <div className="col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-zinc-800 dark:to-zinc-950 dark:ring-white/10 lg:col-span-8">
            <div className="flex items-center justify-between border-b border-white/5 bg-black/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">Último Resultado</span>
                <span className="text-xs font-semibold text-zinc-400">{ultimoJogo?.competicao.nome || 'Competição'}</span>
              </div>
              <span className="text-xs font-medium text-zinc-400">{ultimoJogo ? formatarDataSimples(ultimoJogo.dataHora) : 'A definir'}</span>
            </div>
            
            {ultimoJogo ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12">
                <div className="flex w-full max-w-xl items-center justify-between">
                  {/* Mandante */}
                  <div className="flex w-1/3 flex-col items-center gap-4 text-center">
                    <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-zinc-800 ring-4 ring-zinc-800/50">
                      {/* TODO: Substituir pelo src da logo real quando enviar */}
                      <span className="text-sm text-zinc-500">Logo Casa</span>
                    </div>
                    <span className="text-sm font-bold text-white sm:text-lg">{ultimoJogo.equipeCasa.nome}</span>
                  </div>

                  {/* Placar */}
                  <div className="flex w-1/3 flex-col items-center justify-center">
                    <div className="flex items-center gap-4 text-4xl font-black text-white sm:text-6xl">
                      <span>{ultimoJogo.golsCasa ?? 0}</span>
                      <span className="text-2xl text-zinc-600 sm:text-4xl">-</span>
                      <span>{ultimoJogo.golsVisitante ?? 0}</span>
                    </div>
                    <span className="mt-2 rounded-full bg-zinc-800/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Fim de Jogo
                    </span>
                  </div>

                  {/* Visitante */}
                  <div className="flex w-1/3 flex-col items-center gap-4 text-center">
                    <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-zinc-800 ring-4 ring-zinc-800/50">
                      {/* TODO: Substituir pelo src da logo real quando enviar */}
                      <span className="text-sm text-zinc-500">Logo Fora</span>
                    </div>
                    <span className="text-sm font-bold text-white sm:text-lg">{ultimoJogo.equipeVisitante.nome}</span>
                  </div>
                </div>
                
                {/* Goleadores (Mockado aguardando API) */}
                <div className="mt-10 flex w-full max-w-xl justify-between border-t border-white/10 pt-4 text-sm font-medium text-zinc-400">
                  <div className="flex flex-col gap-1">
                    {ultimoJogo.golsCasa && ultimoJogo.golsCasa > 0 ? <span>⚽ Vegetti&apos;</span> : <span />}
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    {ultimoJogo.golsVisitante && ultimoJogo.golsVisitante > 0 ? <span>⚽ Adversário&apos;</span> : <span />}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-12 text-zinc-500">Nenhuma partida registrada.</div>
            )}
            
            <div className="bg-black/20 px-6 py-3 text-right border-t border-white/5">
               <Link href={ultimoJogo ? `/partidas/${ultimoJogo.id}` : '#'} className="text-xs font-bold uppercase tracking-wider text-blue-500 transition-colors hover:text-blue-400">
                 Ver Estatísticas Completas &rarr;
               </Link>
            </div>
          </div>

          {/* LATERAL DIREITA: Próxima Partida + Forma Atual */}
          <div className="col-span-1 flex flex-col gap-5 lg:col-span-4">
            
            {/* Próxima Partida */}
            <div className="group flex flex-1 flex-col justify-between rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#18181b]">
              <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Próxima Partida</h3>
              </div>
              <div className="flex flex-col p-5">
                <span className="mb-4 text-xs font-bold text-red-600 dark:text-red-500">{proximoJogo?.competicao.nome || 'Competição'}</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-lg font-bold text-zinc-900 dark:text-white">
                    <span>{proximoJogo?.equipeCasa.nome || 'Casa'}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">-</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold text-zinc-900 dark:text-white">
                    <span>{proximoJogo?.equipeVisitante.nome || 'Visitante'}</span>
                    <span className="text-zinc-300 dark:text-zinc-600">-</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded bg-green-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-950/30 dark:border dark:border-green-900/50 dark:text-green-500">
                    Agendado
                  </span>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {proximoJogo ? formatarDataSimples(proximoJogo.dataHora) : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Forma Atual */}
            <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#18181b]">
              <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Forma Atual</h3>
              </div>
              <div className="flex items-center justify-between p-6">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Últimos 5 jogos</span>
                <div className="flex gap-2">
                  {ultimos5Jogos.map((jogo, idx) => {
                    const res = getResultadoVasco(jogo);
                    let corBg = 'bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'; // Empate (E)
                    if (res === 'V') corBg = 'bg-green-500 text-white';
                    if (res === 'D') corBg = 'bg-red-500 text-white';
                    
                    return (
                      <div key={jogo.id || idx} title={`${jogo.equipeCasa.nome} x ${jogo.equipeVisitante.nome}`} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-sm ${corBg}`}>
                        {res}
                      </div>
                    );
                  })}
                  {ultimos5Jogos.length === 0 && <span className="text-xs text-zinc-500">Sem dados</span>}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. GRID DO MEIO: CLASSIFICAÇÃO E CENTRAL DE DADOS */}
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Tabela de Classificação */}
          <div className="col-span-1 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#18181b] lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Classificação</h3>
              <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Brasileirão 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="pb-3 pl-2 font-semibold">#</th>
                    <th className="pb-3 font-semibold">Equipe</th>
                    <th className="pb-3 text-center font-semibold text-zinc-900 dark:text-zinc-300">Pts</th>
                    <th className="pb-3 text-center font-semibold">PJ</th>
                    <th className="hidden pb-3 text-center font-semibold sm:table-cell">VIT</th>
                    <th className="hidden pb-3 text-center font-semibold sm:table-cell">SG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  <tr className="bg-zinc-50 dark:bg-zinc-800/30">
                    <td className="py-4 pl-2 font-bold text-zinc-900 dark:text-white">6</td>
                    <td className="flex items-center gap-3 py-4 font-bold text-zinc-900 dark:text-white">
                       <span className="text-red-600">✠</span> Vasco da Gama
                    </td>
                    <td className="py-4 text-center font-black text-zinc-900 dark:text-white">20</td>
                    <td className="py-4 text-center font-medium">11</td>
                    <td className="hidden py-4 text-center font-medium sm:table-cell">6</td>
                    <td className="hidden py-4 text-center font-medium sm:table-cell">+4</td>
                  </tr>
                  <tr>
                     <td colSpan={6} className="py-10 text-center text-sm font-medium text-zinc-400 dark:text-zinc-500">
                        Sincronização com Sofascore em andamento...
                     </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Central de Dados */}
          <div className="col-span-1 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#18181b]">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Central de Dados</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Navegue pelo nosso banco de dados detalhado para análises profundas.</p>
            <div className="mt-4 flex flex-col gap-3">
               <Link href="/elenco" className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-bold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-white hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white">
                  <span>Ver Elenco Completo</span>
                  <span className="text-red-600 transition-transform group-hover:translate-x-1">→</span>
               </Link>
               <Link href="/partidas" className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm font-bold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-white hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white">
                  <span>Calendário de Partidas</span>
                  <span className="text-red-600 transition-transform group-hover:translate-x-1">→</span>
               </Link>
            </div>
          </div>
        </div>

        {/* 4. GRID INFERIOR: NOTÍCIAS */}
        <div className="mb-10">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
            <span className="h-4 w-1 rounded-full bg-red-600"></span>
            Últimas Notícias
          </h3>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Notícia Principal */}
            <div className="group relative col-span-1 min-h-[350px] overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-black/5 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-zinc-700 dark:via-zinc-900 dark:to-black dark:ring-white/10 lg:col-span-8 lg:min-h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <span className="mb-4 inline-block rounded bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">Copa do Brasil</span>
                <h2 className="text-3xl font-bold leading-tight text-white transition-transform duration-300 group-hover:text-zinc-200 md:text-4xl lg:text-5xl">
                  Vasco enfrentará o Flu nas oitavas da Copa do Brasil; veja todos os confrontos
                </h2>
                <p className="mt-4 hidden text-sm font-medium text-zinc-300 sm:block md:text-base">
                  Jogos de ida e volta serão na mesma semana. Sorteio define caminho cruzmaltino rumo ao título nacional.
                </p>
              </div>
            </div>

            {/* Notícias Secundárias */}
            <div className="col-span-1 flex flex-col gap-5 lg:col-span-4">
              <div className="group relative flex-1 min-h-[200px] overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-black/5 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-zinc-800 dark:to-zinc-950 dark:ring-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-zinc-300">
                    Reforços não engrenam, e Vasco mudará rota na segunda janela
                  </h3>
                </div>
              </div>

              <div className="group relative flex-1 min-h-[200px] overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-black/5 dark:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] dark:from-zinc-800 dark:to-zinc-950 dark:ring-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-red-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Vídeo
                  </span>
                  <h3 className="text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-zinc-300">
                    Análise: Clássico tenso põe estratégia de Renato à prova
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}