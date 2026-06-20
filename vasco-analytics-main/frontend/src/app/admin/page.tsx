import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Trophy, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity, 
  MessageSquare,
  Zap,
  Terminal,
  Server
} from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const metrics = [
    { label: 'Plantel Ativo', val: '28', icone: Users, color: 'text-blue-500' },
    { label: 'Análises Mensais', val: '14', icone: Activity, color: 'text-emerald-500' },
    { label: 'Alertas de Sync', val: '0', icone: Zap, color: 'text-amber-500' },
  ];

  return (
    <div className="p-12 space-y-12">
      
      {}
      <header className="flex justify-between items-center">
        <div>
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Workspace / Dashboard</p>
           <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Centro de <span className="text-accent italic">Controle</span></h1>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-xl">
           <div className="w-10 h-10 rounded-xl bg-black border border-slate-800 flex items-center justify-center text-accent">
              <Server className="w-5 h-5" />
           </div>
           <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Database Status</p>
              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter mt-1">PostgreSQL Connected</p>
           </div>
        </div>
      </header>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map(m => (
          <div key={m.label} className="bg-black border border-slate-900 p-8 rounded-[32px] relative overflow-hidden group hover:border-slate-700 transition-all">
             <m.icone className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-5 ${m.color} group-hover:opacity-10 transition-opacity`} />
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{m.label}</p>
             <p className="text-5xl font-black text-white font-mono tracking-tighter italic">{m.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {}
         <div className="lg:col-span-8 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 flex items-center gap-4 px-4">
               Ferramentas de Sistema <div className="flex-1 h-px bg-slate-900" />
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Link href="/admin/elenco" className="bg-slate-900/30 border border-slate-900 p-8 rounded-[40px] hover:bg-slate-900/50 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-black border border-slate-800 rounded-2xl group-hover:border-accent transition-colors">
                        <Users className="w-6 h-6 text-white" />
                     </div>
                     <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Editor de Plantel</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Controle total de atributos FM, fotos e metadados biográficos.</p>
               </Link>

               <Link href="/admin/clubes" className="bg-slate-900/30 border border-slate-900 p-8 rounded-[40px] hover:bg-slate-900/50 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-black border border-slate-800 rounded-2xl group-hover:border-accent transition-colors">
                        <ShieldCheck className="w-6 h-6 text-white" />
                     </div>
                     <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Gestão de Clubes</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Sincronização de escudos e normalização de nomes de adversários.</p>
               </Link>

               <Link href="/admin/automacao" className="bg-slate-900/30 border border-slate-900 p-8 rounded-[40px] hover:bg-slate-900/50 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-black border border-slate-800 rounded-2xl group-hover:border-accent transition-colors">
                        <Terminal className="w-6 h-6 text-white" />
                     </div>
                     <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Automation Engine</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Disparo manual de scrapers e logs de execução em tempo real.</p>
               </Link>
               
               <div className="bg-black border border-slate-900/50 p-8 rounded-[40px] opacity-30 cursor-not-allowed">
                  <Trophy className="w-6 h-6 text-slate-700 mb-6" />
                  <h4 className="text-lg font-black text-slate-700 uppercase tracking-tight">Match Reporter</h4>
                  <p className="text-[10px] text-slate-800 uppercase font-black tracking-widest mt-2">In Development</p>
               </div>
            </div>
         </div>

         {}
         <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 flex items-center gap-4 px-4">
               Audit Logs <MessageSquare className="w-3 h-3" />
            </h3>

            <div className="bg-black border border-slate-900 rounded-[40px] p-8 space-y-8">
               {[
                 { user: 'SC-1', msg: 'Sync estatísticas partida ID #122 finalizado.', time: '2m' },
                 { user: 'ADM', msg: 'Perfil de Lucas Piton atualizado.', time: '14m' },
                 { user: 'SYS', msg: 'Backup incremental PostgreSQL concluído.', time: '1h' },
                 { user: 'SC-1', msg: 'Novo clube detectado: Independiente.', time: '2h' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-6 group">
                    <div className="w-px h-auto bg-slate-900 group-hover:bg-accent transition-colors" />
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-accent uppercase tracking-tighter">{log.user}</span>
                          <span className="text-[9px] font-bold text-slate-700 uppercase">{log.time}</span>
                       </div>
                       <p className="text-xs text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">{log.msg}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
}
