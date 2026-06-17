"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List, Search, UserPlus, Shield, Activity, ChevronRight } from 'lucide-react';
import { traduzirPosicao } from '@/utils/posicaoHelper';
import Image from 'next/image';

export interface Jogador {
  id: number;
  nomePopular: string;
  posicao: string;
  numeroCamisa: number | null;
  nacionalidade: string | null;
  fotoUrl?: string;
  alturaCm?: number;
  dataNascimento?: string;
  categoria?: string;
  emprestado?: boolean;
}

function calcularIdade(dataNascimento?: string) {
  if (!dataNascimento) return '-';
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

function renderBandeira(nac: string | null | undefined) {
  if (!nac) return '🇧🇷';
  const n = nac.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (n === 'BRASIL' || n === 'BR') return '🇧🇷';
  if (n === 'ARGENTINA') return '🇦🇷';
  if (n === 'URUGUAI') return '🇺🇾';
  if (n === 'CHILE') return '🇨🇱';
  if (n === 'PARAGUAI') return '🇵🇾';
  if (n === 'COLOMBIA') return '🇨🇴';
  if (n === 'EQUADOR') return '🇪🇨';
  if (n === 'FRANCA') return '🇫🇷';
  if (n === 'SUICA') return '🇨🇭';
  if (n === 'PORTUGAL') return '🇵🇹';
  if (n === 'ESPANHA') return '🇪🇸';
  if (n === 'ITALIA') return '🇮🇹';
  // fallback to 3 letters
  return nac.substring(0, 3).toUpperCase();
}



const BaseTableRow = ({ jogador, onClick }: { jogador: Jogador, onClick: () => void }) => {
  const infoPosicao = traduzirPosicao(jogador.posicao);
  return (
    <tr 
      onClick={onClick} 
      className="hover:bg-card/50 transition-all group cursor-pointer border-b border-border last:border-0"
    >
      <td className="px-8 py-6">
        <span className="text-sm font-black text-muted font-mono italic group-hover:text-accent transition-colors">{jogador.numeroCamisa || '--'}</span>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-6">
          <div className="relative w-12 h-12 rounded-xl bg-card border border-border overflow-hidden shrink-0 shadow-xl transition-all group-hover:border-accent">
             {jogador.fotoUrl ? <Image src={jogador.fotoUrl} alt={jogador.nomePopular} fill sizes="48px" className="object-cover" /> : <Shield className="w-5 h-5 m-auto mt-3 text-muted relative z-10" />}
          </div>
          <span className="text-base font-black text-foreground uppercase tracking-tight group-hover:text-accent transition-colors italic">{jogador.nomePopular}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className="text-[10px] font-black uppercase text-muted bg-card border border-border px-3 py-1 rounded-lg tracking-widest">{infoPosicao.nome}</span>
      </td>
      <td className="px-8 py-6 text-center text-xl" title={jogador.nacionalidade || 'Brasil'}>{renderBandeira(jogador.nacionalidade)}</td>
      <td className="px-8 py-6 text-center font-mono text-xs font-black text-muted italic">{calcularIdade(jogador.dataNascimento)}</td>
      <td className="px-8 py-6 text-center font-mono text-xs font-black text-muted italic">{jogador.alturaCm ? `${jogador.alturaCm}cm` : '-'}</td>
      <td className="px-8 py-6 text-right">
         {jogador.emprestado ? (
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 text-[9px] font-black uppercase tracking-widest text-orange-500 border border-orange-500/20">Emprestado</div>
         ) : (
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-[9px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">Apto</div>
         )}
      </td>
    </tr>
  );
};

export default function ElencoClient({ jogadoresIniciais }: { jogadoresIniciais: Jogador[] }) {
  const router = useRouter();
  const [termoBusca, setTermoBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('Profissional');
  const [visao, setVisao] = useState<'lista' | 'cards'>('lista');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'idade' | 'altura' | 'numero' | 'posicao'>('posicao');
  const [filtroPosicao, setFiltroPosicao] = useState<string>('Todas');

  const jogadoresFiltrados = jogadoresIniciais
    .filter(j => 
      (j.categoria || 'Profissional') === abaAtiva && 
      j.nomePopular.toLowerCase().includes(termoBusca.toLowerCase()) &&
      (filtroPosicao === 'Todas' || traduzirPosicao(j.posicao).setor === filtroPosicao)
    )
    .sort((a, b) => {
      if (ordenacao === 'nome') return a.nomePopular.localeCompare(b.nomePopular);
      if (ordenacao === 'posicao') {
        const pesoA = traduzirPosicao(a.posicao).peso;
        const pesoB = traduzirPosicao(b.posicao).peso;
        if (pesoA !== pesoB) return pesoA - pesoB;
        return a.nomePopular.localeCompare(b.nomePopular);
      }
      if (ordenacao === 'idade') {
         const idadeA = typeof calcularIdade(a.dataNascimento) === 'number' ? calcularIdade(a.dataNascimento) as number : 0;
         const idadeB = typeof calcularIdade(b.dataNascimento) === 'number' ? calcularIdade(b.dataNascimento) as number : 0;
         return idadeA - idadeB;
      }
      if (ordenacao === 'altura') return (b.alturaCm || 0) - (a.alturaCm || 0);
      if (ordenacao === 'numero') return (a.numeroCamisa || 999) - (b.numeroCamisa || 999);
      return 0;
    });

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-10 md:space-y-16 bg-background">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase leading-none italic">Elenco</h1>
        </div>

        <div className="flex flex-wrap gap-4 bg-background border border-border p-2 rounded-xl shadow-xl">
           {['Profissional', 'Sub-20', 'Sub-17'].map(cat => (
             <button 
               key={cat} 
               onClick={() => setAbaAtiva(cat)} 
               className={`px-8 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${abaAtiva === cat ? 'bg-accent text-black shadow-lg' : 'text-muted hover:text-foreground hover:bg-card'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full md:w-auto">
           <div className="relative w-full sm:w-[350px] group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Localizar Atleta na Database..." 
                value={termoBusca} 
                onChange={e => setTermoBusca(e.target.value)} 
                className="w-full bg-background border border-border rounded-xl py-4 pl-14 pr-8 text-sm font-black text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-all shadow-inner" 
              />
           </div>

           <select
             value={filtroPosicao}
             onChange={e => setFiltroPosicao(e.target.value)}
             className="bg-background border border-border rounded-xl py-4 px-6 text-sm font-black text-muted focus:border-accent focus:outline-none transition-all outline-none"
           >
             <option value="Todas">Todas as Posições</option>
             <option value="Goleiros">Goleiros</option>
             <option value="Defensores">Defensores</option>
             <option value="Meio-campistas">Meio-campistas</option>
             <option value="Atacantes">Atacantes</option>
           </select>

           <select
             value={ordenacao}
             onChange={e => setOrdenacao(e.target.value as any)}
             className="bg-background border border-border rounded-xl py-4 px-6 text-sm font-black text-muted focus:border-accent focus:outline-none transition-all outline-none"
           >
             <option value="nome">Ordenar por Nome</option>
             <option value="posicao">Ordenar por Posição</option>
             <option value="numero">Ordenar por Número</option>
             <option value="idade">Ordenar por Idade</option>
             <option value="altura">Ordenar por Altura</option>
           </select>
         </div>
         
         <div className="flex gap-2 p-1.5 bg-card border border-border rounded-xl shadow-xl">
           {[
             { id: 'lista', icon: List },
             { id: 'cards', icon: LayoutGrid }
           ].map(v => (
             <button 
               key={v.id} 
               onClick={() => setVisao(v.id as 'lista' | 'cards')} 
               className={`p-3 rounded-lg transition-all ${visao === v.id ? 'bg-background text-accent border border-border shadow-md' : 'text-muted hover:text-foreground'}`}
             >
               <v.icon className="w-5 h-5" />
             </button>
           ))}
         </div>
      </div>

      {jogadoresFiltrados.length === 0 ? (
        <div className="py-48 text-center border border-border rounded-xl bg-card">
           <p className="text-muted font-black uppercase tracking-[0.5em] text-xs">No Data Transmission Detected</p>
        </div>
      ) : (
        <div className="space-y-24">
          {visao === 'lista' ? (
              <div className="space-y-8">
                <div className="flex items-center gap-6 px-4">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted shrink-0 italic">LISTA COMPLETA</h2>
                   <div className="flex-1 h-px bg-border" />
                   <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{jogadoresFiltrados.length} units</span>
                </div>
                <div className="bg-background border border-border rounded-xl overflow-x-auto shadow-xl relative">
                   <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent pointer-events-none min-w-max" />
                   <table className="w-full text-left relative z-10 whitespace-nowrap">
                      <thead>
                        <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-muted border-b border-border bg-card">
                          <th className="px-8 py-6 text-left cursor-pointer hover:text-accent transition-colors" onClick={() => setOrdenacao('numero')}>Nº</th>
                          <th className="px-8 py-6 text-left cursor-pointer hover:text-accent transition-colors" onClick={() => setOrdenacao('nome')}>Identificação do Atleta</th>
                          <th className="px-8 py-6 text-left cursor-pointer hover:text-accent transition-colors" onClick={() => setOrdenacao('posicao')}>Posição</th>
                          <th className="px-8 py-6 text-center">Nac</th>
                          <th className="px-8 py-6 text-center cursor-pointer hover:text-accent transition-colors" onClick={() => setOrdenacao('idade')}>Idade</th>
                          <th className="px-8 py-6 text-center cursor-pointer hover:text-accent transition-colors" onClick={() => setOrdenacao('altura')}>Alt</th>
                          <th className="px-8 py-6 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {jogadoresFiltrados.map(j => <BaseTableRow key={j.id} jogador={j} onClick={() => router.push(`/elenco/${j.id}`)} />)}
                      </tbody>
                   </table>
                </div>
              </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {jogadoresFiltrados.map(j => (
                <div 
                  key={j.id} 
                  onClick={() => router.push(`/elenco/${j.id}`)}
                  className="bg-card border border-border rounded-xl p-8 flex flex-col items-center group cursor-pointer hover:border-accent/40 transition-all hover:-translate-y-1 relative overflow-hidden shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full translate-x-12 -translate-y-12" />
                  <div className="absolute top-6 right-6 text-[10px] font-black text-muted font-mono italic group-hover:text-accent transition-colors">ID#{j.id}</div>
                  
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-background border border-border shadow-md mb-6 group-hover:scale-105 transition-transform relative">
                    <div className="absolute inset-0 border-4 border-background/50 rounded-xl z-10" />
                    {j.fotoUrl ? <Image src={j.fotoUrl} alt={j.nomePopular} fill sizes="128px" className="object-cover transition-all duration-700" /> : <UserPlus className="w-10 h-10 m-auto mt-10 text-muted relative z-10" />}
                  </div>

                  {j.emprestado && (
                     <div className="absolute top-6 left-6 bg-orange-500 text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-md tracking-widest z-20 shadow-xl shadow-orange-500/20">
                        Emprestado
                     </div>
                  )}

                  <p className="text-[10px] font-black text-accent mb-2 uppercase tracking-[0.2em]">{j.numeroCamisa ? `Nº ${j.numeroCamisa}` : '--'}</p>
                  <h3 className="text-xl font-black text-foreground tracking-tighter text-center leading-tight italic uppercase">{j.nomePopular}</h3>
                  <p className="text-[9px] font-bold uppercase text-muted tracking-[0.3em] mt-2 group-hover:text-foreground transition-colors">{traduzirPosicao(j.posicao).nome}</p>
                  
                  <div className="mt-8 pt-6 border-t border-border w-full grid grid-cols-2 gap-4 text-center">
                     <div>
                        <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Idade</p>
                        <p className="text-sm font-black text-foreground font-mono italic">{calcularIdade(j.dataNascimento)}</p>
                     </div>
                     <div className="border-l border-border text-right pr-2">
                        <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Altura</p>
                        <p className="text-sm font-black text-foreground font-mono italic">{j.alturaCm ? `${j.alturaCm}cm` : '--'}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="py-20 text-center">
         <div className="w-12 h-px bg-slate-900 m-auto mb-6" />
         <p className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-800">Scouting Database / Version 2.4.0 / encrypted</p>
      </footer>

    </div>
  );
}
