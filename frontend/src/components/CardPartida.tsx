import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLogoPath } from '@/utils/logoHelper';


export interface PartidaResumo {
  id: number;
  dataHora: string;
  status: string;
  golsCasa: number | null;
  golsVisitante: number | null;
  competicao: { nome: string };
  equipeCasa: { nome: string };
  equipeVisitante: { nome: string };
}

export default function CardPartida({ partida }: { partida: PartidaResumo }) {
  const isEncerrada = partida.status.toLowerCase() === 'encerrada';

  function formatarData(dataString: string | number) {
    if (!dataString) return 'Data indefinida';
    const isNumero = /^\d+$/.test(String(dataString));
    const data = new Date(isNumero ? Number(dataString) : dataString);
    if (isNaN(data.getTime())) return 'Data a confirmar';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(data);
  }

  return (
    <Link href={`/partidas/${partida.id}`} className="block">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:scale-[1.01] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{partida.competicao.nome}</span>
          <span className="text-sm text-zinc-500">{formatarData(partida.dataHora)}</span>
        </div>

        <div className="flex items-center justify-between px-6 py-8">
          {}
          <div className="flex flex-1 flex-col items-center gap-3">
            <Image 
              src={getLogoPath(partida.equipeCasa.nome)} 
              alt={partida.equipeCasa.nome}
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <span className="text-center text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">{partida.equipeCasa.nome}</span>
          </div>

          {}
          <div className="mx-4 flex w-32 flex-col items-center justify-center sm:mx-8">
            {isEncerrada ? (
              <div className="flex items-center gap-3 text-3xl font-black text-zinc-900 dark:text-zinc-50">
                <span>{partida.golsCasa ?? 0}</span>
                <span className="text-zinc-300 dark:text-zinc-700">-</span>
                <span>{partida.golsVisitante ?? 0}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-2xl font-bold text-zinc-400 dark:text-zinc-600">
                <span>-</span>
                <span className="text-zinc-300 dark:text-zinc-700">x</span>
                <span>-</span>
              </div>
            )}
            <span className={`mt-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${isEncerrada ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
              {partida.status}
            </span>
          </div>

          {}
          <div className="flex flex-1 flex-col items-center gap-3">
            <Image 
              src={getLogoPath(partida.equipeVisitante.nome)} 
              alt={partida.equipeVisitante.nome}
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <span className="text-center text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">{partida.equipeVisitante.nome}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}