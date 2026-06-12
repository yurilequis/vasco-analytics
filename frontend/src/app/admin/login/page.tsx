"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      senha,
    });

    if (res?.error) {
      setErro("Acesso Negado. Credenciais não localizadas.");
      setCarregando(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-black border border-slate-900 rounded-[40px] shadow-2xl p-10 backdrop-blur-md">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center m-auto mb-6 shadow-xl">
               <ShieldCheck className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Security <span className="text-accent not-italic">Gateway</span></h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Credencial de Acesso</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-12 py-4 bg-slate-900/50 border border-slate-900 rounded-2xl text-white placeholder-slate-700 focus:border-accent focus:outline-none transition-all font-medium text-sm"
                  placeholder="admin@vascoanalytics.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Chave de Segurança</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full px-12 py-4 bg-slate-900/50 border border-slate-900 rounded-2xl text-white placeholder-slate-700 focus:border-accent focus:outline-none transition-all font-medium text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {erro && (
              <div className="p-4 bg-rose-600/10 border border-rose-600/20 rounded-2xl text-rose-500 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-white text-black font-black uppercase tracking-widest py-4 px-6 rounded-2xl hover:bg-slate-200 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 
                  Validando...
                </>
              ) : "Autenticar no Sistema"}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-900 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-slate-700">
             <span>System v2.4.0</span>
             <span>Encrypted 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
