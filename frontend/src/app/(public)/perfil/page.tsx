"use client";

import React from 'react';
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { User, LogOut, Shield, Mail, ShieldCheck } from 'lucide-react';

export default function PerfilPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.5em] text-xs">Carregando Perfil...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-12 max-w-4xl mx-auto space-y-12 bg-black min-h-screen">
      
      <header className="space-y-4">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 italic">User / Account Details</p>
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Meu <span className="text-accent not-italic">Perfil</span></h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* CARD PRINCIPAL */}
        <div className="md:col-span-8 space-y-8">
          <div className="bg-slate-900/30 border border-slate-900 p-10 rounded-[48px] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <User className="w-48 h-48 text-white" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-[32px] bg-black border border-slate-800 flex items-center justify-center text-3xl font-black text-accent shadow-2xl">
                {session.user?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">{session.user?.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                   <div className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[9px] font-black text-accent uppercase tracking-[0.2em]">
                      {session.user?.role || 'Admin'}
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sessão Segura</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-6 border-t border-slate-800/50 pt-10">
               <div className="flex items-center gap-6">
                  <div className="p-3 bg-black border border-slate-800 rounded-2xl">
                     <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Endereço de E-mail</p>
                     <p className="text-sm font-bold text-white mt-0.5">{session.user?.email}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-6">
                  <div className="p-3 bg-black border border-slate-800 rounded-2xl">
                     <ShieldCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Nível de Permissão</p>
                     <p className="text-sm font-bold text-white mt-0.5">Acesso Total ao Scouting Pro System</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* SIDE ACTIONS */}
        <div className="md:col-span-4 space-y-6">
           <button 
             onClick={() => signOut({ callbackUrl: '/' })}
             className="w-full group bg-black border border-slate-900 p-8 rounded-[40px] flex flex-col items-center gap-6 hover:border-rose-500/50 transition-all shadow-2xl"
           >
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                 <LogOut className="w-8 h-8" />
              </div>
              <div className="text-center">
                 <p className="text-xs font-black text-white uppercase tracking-tighter italic">Encerrar Sessão</p>
                 <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Sair com segurança</p>
              </div>
           </button>

           <div className="bg-slate-900/10 border border-dashed border-slate-900 p-8 rounded-[40px] text-center">
              <Shield className="w-6 h-6 text-slate-800 m-auto mb-4" />
              <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] leading-relaxed">
                 Todos os acessos são criptografados e auditados em conformidade com as diretrizes do sistema.
              </p>
           </div>
        </div>

      </div>

      <footer className="text-center pt-12">
         <p className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-800">Account Management — Vasco Analytics v2.4.0</p>
      </footer>
    </div>
  );
}
