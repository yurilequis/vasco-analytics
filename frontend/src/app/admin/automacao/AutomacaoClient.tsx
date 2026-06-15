"use client";

import React, { useState } from 'react';
import { Terminal, Play, RefreshCw, CheckCircle, AlertCircle, Database } from 'lucide-react';

export default function AutomacaoClient() {
  const [loading, setLoading] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ type: 'success' | 'error' | 'info', text: string, time: string }[]>([]);

  const addMessage = (type: 'success' | 'error' | 'info', text: string) => {
    const time = new Date().toLocaleTimeString('pt-BR');
    setMessages(prev => [{ type, text, time }, ...prev].slice(0, 10));
  };

  const dispararScraping = async (mutation: string, label: string) => {
    setLoading(label);
    addMessage('info', `Iniciando: ${label}...`);
    
    try {
      const query = `mutation { ${mutation} }`;
      const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const json = await res.json();
      
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      
      addMessage('success', `${label} concluído com sucesso.`);
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : 'Erro desconhecido';
      addMessage('error', `Falha em ${label}: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const tarefas = [
    { id: 'elenco', label: 'Sincronizar Elenco', mutation: 'dispararScrapingElenco', desc: 'Atualiza a lista de jogadores e números de camisa.' },
    { id: 'partidas', label: 'Sincronizar Partidas', mutation: 'dispararScrapingPartidas', desc: 'Busca novos jogos e resultados básicos.' },
    { id: 'detalhes', label: 'Processar Detalhes', mutation: 'dispararScrapingDetalhes', desc: 'Extrai escalações, estádios e árbitros das partidas.' },
    { id: 'stats', label: 'Calcular Estatísticas', mutation: 'dispararScrapingEstatisticas', desc: 'Processa scouts individuais e notas de desempenho.' },
  ];

  return (
    <div className="p-12 space-y-12">
      <header>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2 italic">System / Automation</p>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Automation <span className="text-accent italic">Engine</span></h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COMANDOS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {tarefas.map(t => (
              <div key={t.id} className="bg-slate-900/30 border border-slate-900 p-6 rounded-[32px] flex items-center justify-between group">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{t.label}</h4>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t.desc}</p>
                </div>
                <button 
                  onClick={() => dispararScraping(t.mutation, t.label)}
                  disabled={loading !== null}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${loading === t.label ? 'bg-amber-500 text-black animate-pulse' : 'bg-white text-black hover:bg-accent hover:text-white disabled:opacity-30'}
                  `}
                >
                  {loading === t.label ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  {loading === t.label ? 'Executando' : 'Disparar'}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-black border border-slate-900 p-8 rounded-[40px] relative overflow-hidden">
             <Database className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-5" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Database Health</h3>
             <div className="flex items-center gap-12">
                <div>
                   <p className="text-xs font-black text-white italic">PostgreSQL</p>
                   <p className="text-[9px] font-black text-emerald-500 uppercase mt-1">Status: Active</p>
                </div>
                <div>
                   <p className="text-xs font-black text-white italic">Scraping API</p>
                   <p className="text-[9px] font-black text-amber-500 uppercase mt-1">Status: Standby</p>
                </div>
             </div>
          </div>
        </div>

        {/* TERMINAL LOG */}
        <div className="lg:col-span-5">
           <div className="bg-black border border-slate-900 rounded-[40px] overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 border-b border-slate-900 flex items-center justify-between bg-slate-900/20">
                 <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Execution Log</span>
                 </div>
                 <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                 </div>
              </div>
              
              <div className="flex-1 p-8 font-mono text-[10px] overflow-y-auto space-y-4">
                 {messages.length === 0 && (
                    <div className="text-slate-800 uppercase font-black tracking-widest">Aguardando comandos do terminal...</div>
                 )}
                 {messages.map((m, i) => (
                   <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-700 shrink-0">[{m.time}]</span>
                      <div className="flex items-start gap-2">
                         {m.type === 'success' && <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />}
                         {m.type === 'error' && <AlertCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />}
                         <span className={`
                           ${m.type === 'success' ? 'text-emerald-400' : ''}
                           ${m.type === 'error' ? 'text-rose-400' : ''}
                           ${m.type === 'info' ? 'text-sky-400' : ''}
                           font-medium leading-relaxed
                         `}>
                           {m.text}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
