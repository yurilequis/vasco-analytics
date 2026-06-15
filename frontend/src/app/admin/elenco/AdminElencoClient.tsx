"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Edit2, Zap, X, Check, Database, ChevronRight, Filter, UserPlus, Search } from 'lucide-react';
import { traduzirPosicao } from '@/utils/posicaoHelper';

export interface JogadorAdmin {
  id: number;
  nomePopular: string;
  nomeCompleto?: string | null;
  posicao: string;
  posicaoSecundaria: string | null;
  peDominante: string | null;
  numeroCamisa: number | null;
  categoria: string;
  emprestado: boolean;
  tipoContrato: string | null;
  clubeEmprestimo?: string | null;
  ativo: boolean;
  fotoUrl?: string | null;
  equipeId?: number | null;
  alturaCm?: number | null;
  dataNascimento?: string | null;
}

export interface EquipeAdmin {
  id: number;
  nome: string;
  estado?: string | null;
}

export default function AdminElencoClient({ 
  jogadoresIniciais,
  equipesDisponiveis,
  tokenJwt 
}: { 
  jogadoresIniciais: JogadorAdmin[],
  equipesDisponiveis: EquipeAdmin[],
  tokenJwt?: string 
}) {
  const [jogadores, setJogadores] = useState(jogadoresIniciais);
  const [filtroCategoria, setFiltroCategoria] = useState('Profissional');
  const [filtroStatus, setFiltroStatus] = useState<'plantel' | 'emprestados' | 'inativos'>('plantel');
  const [termoBusca, setTermoBusca] = useState('');

  // Quick Edit State
  const [quickEditData, setQuickEditData] = useState<JogadorAdmin | null>(null);
  const [isSavingQuick, setIsSavingQuick] = useState(false);

  const equipesPorEstado = equipesDisponiveis.reduce((acc, eq) => {
    const uf = eq.estado || 'Outros / Exterior';
    if (!acc[uf]) acc[uf] = [];
    acc[uf].push(eq);
    return acc;
  }, {} as Record<string, EquipeAdmin[]>);

  const handleSaveQuickEdit = async () => {
    if (!quickEditData || !tokenJwt) return;
    setIsSavingQuick(true);
    try {
      const mut = `
        mutation AtualizarQuick($id: Int!, $nomePopular: String, $nomeCompleto: String, $numeroCamisa: Int, $ativo: Boolean, $emprestado: Boolean, $tipoContrato: String, $clubeEmprestimo: String) {
          atualizarJogadorAdmin(id: $id, nomePopular: $nomePopular, nomeCompleto: $nomeCompleto, numeroCamisa: $numeroCamisa, ativo: $ativo, emprestado: $emprestado, tipoContrato: $tipoContrato, clubeEmprestimo: $clubeEmprestimo) {
            id, nomePopular, nomeCompleto, numeroCamisa, ativo, emprestado, tipoContrato, clubeEmprestimo
          }
        }
      `;
      const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenJwt}` },
        body: JSON.stringify({
          query: mut,
          variables: {
            id: quickEditData.id,
            nomePopular: quickEditData.nomePopular,
            nomeCompleto: quickEditData.nomeCompleto,
            numeroCamisa: quickEditData.numeroCamisa ? Number(quickEditData.numeroCamisa) : null,
            ativo: quickEditData.ativo,
            emprestado: quickEditData.emprestado,
            tipoContrato: quickEditData.tipoContrato || 'DEFINITIVO',
            clubeEmprestimo: (quickEditData.tipoContrato === 'EMPRESTADO' || quickEditData.tipoContrato === 'EMPRESTIMO') ? quickEditData.clubeEmprestimo : null
          }
        })
      });
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);
      
      const att = json.data.atualizarJogadorAdmin;
      setJogadores(prev => prev.map(j => j.id === att.id ? { ...j, ...att } : j));
      setQuickEditData(null);
    } catch (e) {
      alert('Erro ao salvar edição rápida: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setIsSavingQuick(false);
    }
  };

  const jogadoresFiltrados = jogadores.filter(j => {
    // Filtro por termo de busca
    if (termoBusca && !j.nomePopular.toLowerCase().includes(termoBusca.toLowerCase())) return false;
    
    // Filtro por categoria
    if ((j.categoria || 'Profissional') !== filtroCategoria) return false;

    // Filtro por Status
    if (filtroStatus === 'plantel') {
      return j.ativo === true && j.tipoContrato !== 'EMPRESTADO';
    } else if (filtroStatus === 'emprestados') {
      return j.tipoContrato === 'EMPRESTADO';
    } else if (filtroStatus === 'inativos') {
      return j.ativo === false;
    }
    
    return true;
  });

  return (
    <div className="p-4 md:p-12 space-y-8 md:space-y-12">
      
      {/* HEADER: DATA MANAGEMENT */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-900 pb-12">
        <div>
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Workspace / Elenco</p>
           <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Squad <span className="text-accent not-italic">Manager</span></h1>
        </div>

        <div className="flex flex-wrap gap-3 bg-black border border-slate-800 p-1.5 rounded-2xl">
           {['Profissional', 'Sub-20', 'Sub-17'].map(cat => (
             <button 
               key={cat} 
               onClick={() => setFiltroCategoria(cat)} 
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filtroCategoria === cat ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-600 hover:text-slate-300'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
            <input 
               type="text" 
               placeholder="Busca rápida por nome..." 
               value={termoBusca}
               onChange={e => setTermoBusca(e.target.value)}
               className="w-full bg-black border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold text-white placeholder:text-slate-700 focus:border-accent focus:outline-none transition-all" 
            />
         </div>

         <div className="flex flex-col sm:flex-row gap-4">
            {/* TABS DE STATUS */}
            <div className="flex bg-zinc-950 border border-zinc-800 p-1 rounded-xl">
               <button 
                 onClick={() => setFiltroStatus('plantel')}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filtroStatus === 'plantel' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Plantel
               </button>
               <button 
                 onClick={() => setFiltroStatus('emprestados')}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filtroStatus === 'emprestados' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Emprestados
               </button>
               <button 
                 onClick={() => setFiltroStatus('inativos')}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filtroStatus === 'inativos' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Inativos
               </button>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-all">
               <Filter className="w-4 h-4" /> Filtros
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl">
               <UserPlus className="w-4 h-4" /> Novo Atleta
            </button>
         </div>
      </div>

      {/* DATA GRID (TERMINAL STYLE) */}
      <div className="bg-black border border-slate-900 rounded-[24px] md:rounded-[40px] overflow-x-auto shadow-2xl">
         <table className="w-full text-left whitespace-nowrap">
            <thead>
               <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 border-b border-slate-900 bg-slate-900/20">
                  <th className="px-8 py-6">ID</th>
                  <th className="px-8 py-6">Jogador</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-center">Nº</th>
                  <th className="px-8 py-6 text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
               {jogadoresFiltrados.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800">Sem resultados para os critérios aplicados</p>
                    </td>
                 </tr>
               ) : (
                 jogadoresFiltrados.map(j => (
                   <tr key={j.id} className="hover:bg-slate-900/30 transition-all group">
                      <td className="px-8 py-6">
                         <span className="text-[10px] font-bold text-slate-700 font-mono italic">#{j.id}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-accent">
                               {j.fotoUrl ? <img src={j.fotoUrl} className="w-full h-full object-cover" /> : <Database className="w-4 h-4 text-slate-700" />}
                            </div>
                            <div>
                               <p className="text-sm font-black text-white uppercase tracking-tight">{j.nomePopular}</p>
                               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{traduzirPosicao(j.posicao).nome}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         {j.ativo === false ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/30 border border-red-900/50 rounded-lg">
                               <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                               <span className="text-[9px] font-black uppercase text-red-400">Sem Clube / Ex-jogador</span>
                            </div>
                         ) : j.tipoContrato === 'EMPRESTADO' ? (
                            <div className="flex flex-col gap-1">
                               <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/30 border border-amber-900/50 rounded-lg w-fit">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  <span className="text-[9px] font-black uppercase text-amber-400">Emprestado</span>
                               </div>
                               {j.clubeEmprestimo && <span className="text-[10px] text-slate-400 font-bold ml-1">Para: {j.clubeEmprestimo}</span>}
                            </div>
                         ) : j.tipoContrato === 'EMPRESTIMO' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/30 border border-emerald-900/50 rounded-lg">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                               <span className="text-[9px] font-black uppercase text-emerald-400">Empréstimo</span>
                            </div>
                         ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                               <span className="text-[9px] font-black uppercase text-slate-400">Regularizado</span>
                            </div>
                         )}
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="text-sm font-black text-slate-300 font-mono group-hover:text-accent transition-colors">{j.numeroCamisa || '--'}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => setQuickEditData(j)}
                               className="p-2.5 bg-black border border-slate-800 rounded-xl text-amber-400 hover:text-white hover:border-amber-500 hover:bg-amber-500/10 transition-all"
                               title="Edição Rápida"
                             >
                                <Zap className="w-4 h-4" />
                             </button>
                             <Link href={`/admin/jogadores/${j.id}`} className="p-2.5 bg-black border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-white transition-all" title="Perfil Completo">
                                <ChevronRight className="w-4 h-4" />
                             </Link>
                          </div>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

      <footer className="flex justify-between items-center px-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
         <span>Vasco Analytics v2.0 - Hybrid SaaS Architecture</span>
         <span>Page 01 of 01</span>
      </footer>

      {/* QUICK EDIT MODAL */}
      {quickEditData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-900 bg-slate-900/20">
              <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Edição Rápida
              </h2>
              <button onClick={() => setQuickEditData(null)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Apelido (Popular)</label>
                  <input 
                    type="text" 
                    value={quickEditData.nomePopular || ''} 
                    onChange={e => setQuickEditData({...quickEditData, nomePopular: e.target.value})}
                    className="w-full bg-black border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Número</label>
                  <input 
                    type="number" 
                    value={quickEditData.numeroCamisa || ''} 
                    onChange={e => setQuickEditData({...quickEditData, numeroCamisa: e.target.value ? Number(e.target.value) : null})}
                    className="w-full bg-black border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  value={quickEditData.nomeCompleto || ''} 
                  onChange={e => setQuickEditData({...quickEditData, nomeCompleto: e.target.value})}
                  className="w-full bg-black border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Contrato / Status</label>
                  <select 
                    value={!quickEditData.ativo ? 'inativo' : (quickEditData.tipoContrato || 'DEFINITIVO')}
                    onChange={e => {
                      const v = e.target.value;
                      if (v === 'inativo') setQuickEditData({...quickEditData, ativo: false, tipoContrato: 'DEFINITIVO', emprestado: false});
                      else if (v === 'DEFINITIVO') setQuickEditData({...quickEditData, ativo: true, tipoContrato: 'DEFINITIVO', emprestado: false, clubeEmprestimo: null});
                      else if (v === 'EMPRESTIMO') setQuickEditData({...quickEditData, ativo: true, tipoContrato: 'EMPRESTIMO', emprestado: false});
                      else if (v === 'EMPRESTADO') setQuickEditData({...quickEditData, ativo: true, tipoContrato: 'EMPRESTADO', emprestado: true});
                    }}
                    className="w-full bg-black border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-accent outline-none"
                  >
                    <option value="DEFINITIVO">Definitivo (Plantel)</option>
                    <option value="EMPRESTIMO">Empréstimo (Vasco Pegou)</option>
                    <option value="EMPRESTADO">Emprestado (Vasco Cedeu)</option>
                    <option value="inativo">Sem Clube / Inativo</option>
                  </select>
                </div>
                
                {(quickEditData.tipoContrato === 'EMPRESTADO' || quickEditData.tipoContrato === 'EMPRESTIMO') && quickEditData.ativo && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Clube Associado</label>
                    <select
                      value={quickEditData.clubeEmprestimo || ''}
                      onChange={e => setQuickEditData({...quickEditData, clubeEmprestimo: e.target.value})}
                      className="w-full bg-black border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-accent outline-none"
                    >
                      <option value="">Selecione...</option>
                      {Object.entries(equipesPorEstado).sort(([a],[b]) => a.localeCompare(b)).map(([uf, times]) => (
                        <optgroup key={uf} label={uf}>
                          {times.sort((a,b) => a.nome.localeCompare(b.nome)).map(t => (
                            <option key={t.id} value={t.nome}>{t.nome}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-900 bg-slate-900/20 flex justify-end gap-3">
              <button 
                onClick={() => setQuickEditData(null)}
                disabled={isSavingQuick}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveQuickEdit}
                disabled={isSavingQuick}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSavingQuick ? 'Salvando...' : <><Check className="w-4 h-4" /> Confirmar</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
