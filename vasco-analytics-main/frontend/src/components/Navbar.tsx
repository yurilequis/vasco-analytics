"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { User, LayoutGrid, Terminal, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    { nome: 'Home', rota: '/', icone: LayoutGrid },
    { nome: 'Dashboard', rota: '/dashboard', icone: LayoutGrid },
    { nome: 'Partidas', rota: '/partidas', icone: Terminal },
    { nome: 'Plantel', rota: '/elenco', icone: User },
  ];

  return (
    <>
      <header className="h-16 border-b border-border bg-background flex items-center px-8 shrink-0 z-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-6 md:gap-12 w-full relative z-10">
          
          {}
          <button 
            className="md:hidden p-2 -ml-2 text-muted hover:text-white transition-colors"
            onClick={() => setMenuAberto(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img src="/logos/vasco.png" alt="Vasco" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-sm font-black tracking-tighter text-white uppercase">
              Vasco <span className="text-accent italic">Analytics</span>
            </span>
          </Link>

          {}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const isActive = pathname === link.rota;
              return (
                <Link
                  key={link.nome}
                  href={link.rota}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl border ${
                    isActive
                      ? 'text-white bg-card border-border shadow-xl'
                      : 'text-muted border-transparent hover:text-white hover:bg-card/50'
                  }`}
                >
                  {link.nome}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="h-8 w-24 animate-pulse rounded-xl bg-slate-900"></div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/admin" 
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-accent hover:text-white transition-colors border border-accent/20 rounded-xl px-4 py-2 hover:bg-accent/10"
                >
                   Painel Admin
                </Link>
                <div className="hidden sm:block h-6 w-px bg-border"></div>
                <Link 
                  href="/perfil"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/50 transition-all">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">{session.user?.name?.split(' ')[0]}</p>
                    <div className="flex items-center gap-1 mt-1">
                       <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                       <p className="text-[8px] font-bold text-muted uppercase tracking-widest">Online</p>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <Link 
                href="/admin/login" 
                className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
              >
                Autenticar
              </Link>
            )}
          </div>
        </div>
      </header>

      {}
      {menuAberto && (
        <div className="fixed inset-0 z-[100] flex justify-start">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuAberto(false)} />
           <div className="relative w-72 bg-background h-full border-r border-border p-6 flex flex-col gap-8 shadow-2xl transition-transform duration-300 ease-out">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <img src="/logos/vasco.png" alt="Vasco" className="w-6 h-6 object-contain" />
                    <span className="text-xs font-black tracking-tighter text-white uppercase">Menu</span>
                 </div>
                 <button className="text-muted hover:text-white p-2" onClick={() => setMenuAberto(false)}>
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <nav className="flex flex-col gap-4">
                {links.map((link) => {
                  const isActive = pathname === link.rota;
                  return (
                    <Link
                      key={link.nome}
                      href={link.rota}
                      onClick={() => setMenuAberto(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all rounded-xl border ${
                        isActive
                          ? 'text-white bg-card border-border'
                          : 'text-muted border-transparent hover:text-white hover:bg-card/50'
                      }`}
                    >
                      <link.icone className="w-4 h-4" />
                      {link.nome}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto">
                 {status === 'loading' ? (
                   <div className="h-8 w-24 animate-pulse rounded-xl bg-card"></div>
                 ) : session ? (
                   <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-accent">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">{session.user?.name}</p>
                          <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Online</p>
                        </div>
                     </div>
                     <Link 
                       href="/admin" 
                       onClick={() => setMenuAberto(false)}
                       className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-black bg-accent rounded-xl px-4 py-3"
                     >
                        Painel Admin
                     </Link>
                   </div>
                 ) : (
                   <Link 
                     href="/admin/login" 
                     onClick={() => setMenuAberto(false)}
                     className="block text-center bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-slate-200 transition-all"
                   >
                     Autenticar
                   </Link>
                 )}
              </div>

              <div className="text-center pt-4 border-t border-border/50">
                 <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted">Fonte dos dados: Sofascore</p>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
