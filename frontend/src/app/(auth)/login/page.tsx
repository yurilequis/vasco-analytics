"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, User, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    if (modo === "login") {
      const res = await signIn("credentials", { redirect: false, email, senha });
      if (res?.error) {
        setErro("Credenciais inválidas.");
        setCarregando(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const res = await signIn("register", { redirect: false, nome, email, senha });
      if (res?.error) {
        setErro("Erro ao registrar. Tente outro e-mail.");
        setCarregando(false);
      } else {
        router.push("/");
        router.refresh();
      }
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-black border border-slate-900 rounded-[40px] shadow-2xl p-10 backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center m-auto mb-6 shadow-xl">
               <ShieldCheck className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Vasco <span className="text-accent not-italic">Analytics</span></h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Plataforma de Dados</p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl mb-6">
            <button 
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${modo === 'login' ? 'bg-black text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              onClick={() => { setModo('login'); setErro(''); }}
            >
              Entrar
            </button>
            <button 
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${modo === 'registro' ? 'bg-black text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              onClick={() => { setModo('registro'); setErro(''); }}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === "registro" && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-slate-700"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-slate-700"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-3 rounded-xl text-center">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-accent hover:bg-white text-black font-black uppercase tracking-widest text-xs py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : (modo === "login" ? "Entrar" : "Criar Conta")}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ou</span>
            <div className="h-px flex-1 bg-slate-800"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full bg-white text-black hover:bg-slate-200 font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-3 mt-6"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
}
