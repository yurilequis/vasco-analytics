"use client";

import React, { useState } from 'react';
import { UploadCloud, Search, ShieldCheck, ChevronRight, Hash, Globe, LayoutGrid, List as ListIcon, ArrowUp, ArrowDown, Filter, RefreshCw } from 'lucide-react';

export interface EquipeAdmin {
  id: number;
  nome: string;
  nomeCurto: string | null;
  estado: string | null;
  pais: string | null;
  escudoUrl: string | null;
}

export default function AdminClubesClient({ 
  equipesIniciais,
  tokenJwt 
}: { 
  equipesIniciais: EquipeAdmin[],
  tokenJwt?: string 
}) {
  const [equipes, setEquipes] = useState(equipesIniciais);
  const [termoBusca, setTermoBusca] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ field: keyof EquipeAdmin, order: 'asc' | 'desc' }>({ field: 'nome', order: 'asc' });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncLogos = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(tokenJwt ? { Authorization: `Bearer ${tokenJwt}` } : {}) },
        body: JSON.stringify({
          query: `
            mutation {
              sincronizarEscudosLocais
            }
          `
        }),
      });
      const data = await response.json();
      const atualizados = data?.data?.sincronizarEscudosLocais;
      if (atualizados !== undefined) {
        alert(`Sincronização concluída! ${atualizados} escudos foram atualizados.`);
        window.location.reload();
      } else {
        alert('Erro ao sincronizar escudos.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao sincronizar.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Pegar todos os estados únicos para o filtro
  const estadosDisponiveis = Array.from(new Set(equipes.map(e => e.estado).filter(Boolean))) as string[];

  const equipesFiltradas = equipes
    .filter(e => {
      const matchBusca = e.nome.toLowerCase().includes(termoBusca.toLowerCase());
      const matchEstado = filtroEstado ? e.estado === filtroEstado : true;
      return matchBusca && matchEstado;
    })
    .sort((a, b) => {
      const fieldA = a[sortConfig.field] || '';
      const fieldB = b[sortConfig.field] || '';
      
      let comparison = 0;
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        comparison = fieldA.localeCompare(fieldB);
      } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        comparison = fieldA - fieldB;
      }
      
      return sortConfig.order === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: keyof EquipeAdmin) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ field }: { field: keyof EquipeAdmin }) => {
    if (sortConfig.field !== field) return <div className="w-4 h-4 opacity-0 group-hover:opacity-30 transition-opacity"><ArrowDown className="w-4 h-4" /></div>;
    return sortConfig.order === 'asc' ? <ArrowUp className="w-4 h-4 text-accent" /> : <ArrowDown className="w-4 h-4 text-accent" />;
  };

  return (
    <div className="p-12 space-y-12">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-900 pb-12">
        <div>
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Workspace / Clubes</p>
           <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Database <span className="text-accent not-italic">Clubes</span></h1>
        </div>
        <div className="bg-slate-900/30 border border-slate-800 px-6 py-3 rounded-2xl">
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total de Registros: <span className="text-white font-mono">{equipes.length}</span></span>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-black border border-slate-900 p-4 rounded-[32px] shadow-2xl">
         <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-center">
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
               <input 
                  type="text" 
                  placeholder="Pesquisar clube na base..." 
                  value={termoBusca}
                  onChange={e => setTermoBusca(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold text-white placeholder:text-slate-700 focus:border-accent focus:outline-none transition-all" 
               />
            </div>
            
            <div className="relative w-full md:w-48">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
               <select 
                 value={filtroEstado}
                 onChange={e => setFiltroEstado(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold text-slate-300 focus:border-accent focus:outline-none transition-all appearance-none cursor-pointer"
               >
                 <option value="">Todos os Estados</option>
                 {estadosDisponiveis.map(uf => (
                   <option key={uf} value={uf}>{uf}</option>
                 ))}
               </select>
            </div>
         </div>

         <div className="flex gap-4 items-center">
            <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-2xl">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:text-slate-300'}`}
               >
                 <LayoutGrid className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-accent/10 text-accent' : 'text-slate-600 hover:text-slate-300'}`}
               >
                 <ListIcon className="w-4 h-4" />
               </button>
            </div>
            <button 
               onClick={handleSyncLogos}
               disabled={isSyncing}
               className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isSyncing ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-white text-black hover:bg-slate-200'}`}
            >
               <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
               {isSyncing ? 'Sincronizando...' : 'Sincronizar Escudos Locais'}
            </button>
         </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {equipesFiltradas.length === 0 ? (
             <div className="col-span-full py-40 text-center border-2 border-dashed border-slate-900 rounded-[40px]">
                <p className="text-[10px] font-black uppercase text-slate-800 tracking-[0.4em]">Nenhum clube localizado</p>
             </div>
           ) : (
             equipesFiltradas.map(e => (
               <div key={e.id} className="bg-black border border-slate-900 p-8 rounded-[40px] hover:border-slate-700 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                     <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center p-3 transition-all group-hover:border-accent shadow-2xl">
                        {e.escudoUrl ? <img src={e.escudoUrl} className="max-h-full max-w-full object-contain" /> : <ShieldCheck className="w-6 h-6 text-slate-700" />}
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight truncate w-40">{e.nome}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded uppercase">{e.nomeCurto || 'N/A'}</span>
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{e.pais || 'Brasil'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-900 grid grid-cols-2 gap-4 relative z-10">
                     <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-600">
                        <Hash className="w-3 h-3" /> ID: {e.id}
                     </div>
                     <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-600 justify-end">
                        <Globe className="w-3 h-3" /> {e.estado || 'INT'}
                     </div>
                  </div>

                  <button className="mt-6 w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-black transition-all flex items-center justify-center gap-2 group/btn">
                     Editar Metadados <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
             ))
           )}
        </div>
      ) : (
        <div className="bg-black border border-slate-900 rounded-[40px] overflow-hidden shadow-2xl">
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 border-b border-slate-900 bg-slate-900/20">
                    <th className="px-8 py-6 cursor-pointer hover:bg-slate-900/40 transition-colors group" onClick={() => handleSort('id')}>
                      <div className="flex items-center gap-2">ID <SortIcon field="id" /></div>
                    </th>
                    <th className="px-8 py-6 cursor-pointer hover:bg-slate-900/40 transition-colors group" onClick={() => handleSort('nome')}>
                      <div className="flex items-center gap-2">Clube <SortIcon field="nome" /></div>
                    </th>
                    <th className="px-8 py-6 cursor-pointer hover:bg-slate-900/40 transition-colors group" onClick={() => handleSort('estado')}>
                      <div className="flex items-center gap-2">Região <SortIcon field="estado" /></div>
                    </th>
                    <th className="px-8 py-6 text-right">Ações</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                 {equipesFiltradas.length === 0 ? (
                   <tr>
                      <td colSpan={4} className="py-20 text-center">
                         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-800">Nenhum clube localizado</p>
                      </td>
                   </tr>
                 ) : (
                   equipesFiltradas.map(e => (
                     <tr key={e.id} className="hover:bg-slate-900/30 transition-all group">
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-bold text-slate-700 font-mono italic">#{e.id}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 overflow-hidden transition-all group-hover:border-accent">
                                 {e.escudoUrl ? <img src={e.escudoUrl} className="max-h-full max-w-full object-contain" /> : <ShieldCheck className="w-4 h-4 text-slate-700" />}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-white uppercase tracking-tight">{e.nome}</p>
                                 <div className="flex items-center gap-2 mt-0.5">
                                   <span className="text-[8px] font-black text-accent bg-accent/10 px-1.5 py-0.5 rounded uppercase">{e.nomeCurto || 'N/A'}</span>
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                             <Globe className="w-3 h-3 text-slate-600" />
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{e.estado || 'INT'} <span className="text-slate-600 font-normal">/ {e.pais || 'Brasil'}</span></span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex justify-end opacity-30 group-hover:opacity-100 transition-opacity">
                              <button className="p-2.5 bg-black border border-slate-800 rounded-xl text-slate-400 hover:text-accent hover:border-accent transition-all">
                                 <ChevronRight className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))
                 )}
              </tbody>
           </table>
        </div>
      )}

    </div>
  );
}
