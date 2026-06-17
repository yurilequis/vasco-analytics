"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Terminal,
  Database,
  ExternalLink
} from 'lucide-react';
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { nome: 'Dashboard', rota: '/admin', icone: LayoutDashboard },
    { nome: 'Plantel', rota: '/admin/elenco', icone: Users },
    { nome: 'Base de Dados', rota: '/admin/clubes', icone: Database },
    { nome: 'Automação', rota: '/admin/automacao', icone: Terminal },
    { nome: 'Configurações', icone: Settings, rota: '#' },
  ];

  // Se estiver na tela de login, não renderiza o layout administrativo (sidebar)
  if (pathname === '/admin/login') {
    return <div className="dark bg-black min-h-screen">{children}</div>;
  }

  return (
    <div className="dark flex h-[100dvh] w-screen bg-black text-slate-200 overflow-hidden">
      
      {/* SIDEBAR: DARK PRO */}
      <aside className="w-64 border-r border-slate-900 bg-black flex flex-col shrink-0">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]">V</div>
            <div className="flex flex-col">
               <span className="font-black tracking-tighter text-white text-xs uppercase leading-none">Scouting<span className="text-accent">Pro</span></span>
               <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-1">Vasco Analytics</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[8px] font-black uppercase tracking-[0.4em] text-slate-700 mb-4 mt-4">Navegação Tática</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.rota;
            return (
              <Link
                key={item.nome}
                href={item.rota}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest ${
                  isActive 
                    ? 'bg-accent text-white shadow-xl shadow-accent/20' 
                    : 'text-slate-500 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icone className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  {item.nome}
                </div>
                {isActive && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-900 bg-black/50 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black text-accent uppercase">
              {session?.user?.name?.substring(0, 2) || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">{session?.user?.name || 'Admin'}</p>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Sessão Ativa</p>
              </div>
            </div>
          </div>

          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 text-[9px] font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          >
            <ExternalLink className="w-3 h-3 text-accent" /> Visualizar Site
          </Link>

          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2 py-3 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-rose-600/10 hover:border-rose-600/20 border border-slate-900 rounded-xl transition-all"
          >
            <LogOut className="w-3 h-3" /> Encerrar Acesso
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL: DARK WORKSPACE */}
      <main className="flex-1 overflow-y-auto bg-[#050505] relative pb-24 md:pb-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
           {children}
        </div>
      </main>
    </div>
  );
}
