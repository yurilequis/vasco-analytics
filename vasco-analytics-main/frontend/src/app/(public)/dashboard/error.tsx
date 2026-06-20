'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="p-10 md:p-20 max-w-7xl mx-auto space-y-8">
      <h2 className="text-red-500 text-3xl font-black uppercase tracking-widest">Erro no Dashboard</h2>
      <p className="text-slate-300">Por favor, tire um print ou copie o erro abaixo e envie para o desenvolvedor:</p>
      <pre className="mt-4 p-4 bg-slate-900 rounded-xl text-red-400 font-mono text-xs overflow-auto">{error.message}</pre>
      <pre className="mt-4 p-4 bg-slate-900 rounded-xl text-slate-400 font-mono text-xs overflow-auto">{error.stack}</pre>
      <button onClick={reset} className="mt-8 bg-accent text-white px-6 py-3 rounded-xl font-bold">Tentar novamente</button>
    </div>
  );
}