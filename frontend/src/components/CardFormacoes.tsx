"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Edit3, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface EstatisticaJogador {
  id: number;
  equipeId: number;
  jogador: {
    id?: number;
    nomePopular: string;
    posicao: string;
    posicaoSecundaria?: string | null;
    funcoes?: string | null;
    fotoUrl?: string | null;
    peDominante?: string | null;
    numeroCamisa?: number | null;
  };
  numeroCamisa?: number | null;
  titular: boolean;
  notaDesempenho?: number | null;
  minutosJogados?: number | null;
  gols?: number | null;
  assistencias?: number | null;
  passesCompletos?: number | null;
  desarmes?: number | null;
  cartoesAmarelos?: number | null;
  cartoesVermelhos?: number | null;
  posicaoMediaX?: number | null;
  posicaoMediaY?: number | null;
  heatmapUrl?: string | null;
  posicaoPartida?: string | null;
}

interface Props {
  jogadores: EstatisticaJogador[];
  idCasa: number;
  idVisitante: number;
  nomeCasa: string;
  nomeVisitante: string;
  escudoCasa: string | null;
  escudoVisitante: string | null;
  treinadorCasa?: string | null;
  treinadorVisitante?: string | null;
  isAdmin?: boolean;
  partidaId?: number;
  formacaoCasa?: string | null;
  formacaoVisitante?: string | null;
}

// Slot positions: x = vertical (0=top/goleiro, 100=atacante), y = horizontal (0=left, 100=right)
// For casa team: left is y, top is x
// For visitante team: left = 100-y, top = 100-x (mirror)
const FORMATIONS: Record<string, { x: number; y: number; tags: string[] }[]> = {
  "4-3-3": [
    { x: 8,  y: 50, tags: ['goleiro'] },
    { x: 28, y: 15, tags: ['lateral esquerdo', 'lateral esq', 'd (e)'] },
    { x: 25, y: 35, tags: ['zagueiro', 'd (c)', 'zagueiro central'] },
    { x: 25, y: 65, tags: ['zagueiro', 'd (c)', 'zagueiro central'] },
    { x: 28, y: 85, tags: ['lateral direito', 'lateral dir', 'd (d)'] },
    { x: 50, y: 25, tags: ['volante', 'primeiro volante', 'm (c)', 'meio-campista'] },
    { x: 47, y: 50, tags: ['volante', 'segundo volante', 'm (c)', 'meio-campista'] },
    { x: 50, y: 75, tags: ['volante', 'm (c)', 'meio-campista', 'meia'] },
    { x: 78, y: 18, tags: ['ponta esquerda', 'ponta esq', 'extremo', 'avançado interior'] },
    { x: 85, y: 50, tags: ['centroavante', 'atacante', 'falso 9', 'pl'] },
    { x: 78, y: 82, tags: ['ponta direita', 'ponta dir', 'extremo', 'avançado interior'] },
  ],
  "4-2-3-1": [
    { x: 8,  y: 50, tags: ['goleiro'] },
    { x: 28, y: 15, tags: ['lateral esquerdo', 'lateral esq', 'd (e)'] },
    { x: 25, y: 35, tags: ['zagueiro', 'd (c)'] },
    { x: 25, y: 65, tags: ['zagueiro', 'd (c)'] },
    { x: 28, y: 85, tags: ['lateral direito', 'lateral dir', 'd (d)'] },
    { x: 45, y: 35, tags: ['volante', 'primeiro volante', 'm (c)'] },
    { x: 45, y: 65, tags: ['volante', 'segundo volante', 'm (c)'] },
    { x: 68, y: 18, tags: ['ponta esquerda', 'ponta esq', 'meia esquerda', 'meia esq', 'm (e)'] },
    { x: 65, y: 50, tags: ['meia atacante', 'camisa 10', 'mo (', 'm (c)', 'meio-campista'] },
    { x: 68, y: 82, tags: ['ponta direita', 'ponta dir', 'meia direita', 'meia dir', 'm (d)'] },
    { x: 86, y: 50, tags: ['centroavante', 'atacante', 'pl'] },
  ],
  "4-4-2": [
    { x: 8,  y: 50, tags: ['goleiro'] },
    { x: 28, y: 15, tags: ['lateral esquerdo', 'lateral esq', 'd (e)'] },
    { x: 25, y: 35, tags: ['zagueiro', 'd (c)'] },
    { x: 25, y: 65, tags: ['zagueiro', 'd (c)'] },
    { x: 28, y: 85, tags: ['lateral direito', 'lateral dir', 'd (d)'] },
    { x: 55, y: 15, tags: ['meia esquerda', 'meia esq', 'm (e)', 'ponta esquerda'] },
    { x: 48, y: 38, tags: ['volante', 'm (c)', 'meio-campista'] },
    { x: 48, y: 62, tags: ['volante', 'm (c)', 'meio-campista'] },
    { x: 55, y: 85, tags: ['meia direita', 'meia dir', 'm (d)', 'ponta direita'] },
    { x: 82, y: 32, tags: ['centroavante', 'atacante', 'pl'] },
    { x: 82, y: 68, tags: ['centroavante', 'atacante', 'pl'] },
  ],
  "4-5-1": [
    { x: 8,  y: 50, tags: ['goleiro'] },
    { x: 28, y: 15, tags: ['lateral esquerdo', 'd (e)'] },
    { x: 25, y: 35, tags: ['zagueiro', 'd (c)'] },
    { x: 25, y: 65, tags: ['zagueiro', 'd (c)'] },
    { x: 28, y: 85, tags: ['lateral direito', 'd (d)'] },
    { x: 55, y: 15, tags: ['meia esquerda', 'm (e)', 'ponta esq'] },
    { x: 48, y: 35, tags: ['volante', 'm (c)'] },
    { x: 48, y: 65, tags: ['volante', 'm (c)'] },
    { x: 65, y: 50, tags: ['meia atacante', 'mo (', 'meio-campista'] },
    { x: 55, y: 85, tags: ['meia direita', 'm (d)', 'ponta dir'] },
    { x: 86, y: 50, tags: ['centroavante', 'atacante', 'pl'] },
  ],
  "3-5-2": [
    { x: 8,  y: 50, tags: ['goleiro'] },
    { x: 25, y: 22, tags: ['zagueiro', 'd (c)', 'lateral esquerdo'] },
    { x: 22, y: 50, tags: ['zagueiro', 'd (c)'] },
    { x: 25, y: 78, tags: ['zagueiro', 'd (c)', 'lateral direito'] },
    { x: 50, y: 12, tags: ['meia esquerda', 'lateral esquerdo', 'm (e)', 'ponta esquerda'] },
    { x: 45, y: 35, tags: ['volante', 'm (c)'] },
    { x: 45, y: 65, tags: ['volante', 'm (c)'] },
    { x: 65, y: 50, tags: ['meia atacante', 'mo ('] },
    { x: 50, y: 88, tags: ['meia direita', 'lateral direito', 'm (d)', 'ponta direita'] },
    { x: 82, y: 32, tags: ['centroavante', 'atacante', 'pl'] },
    { x: 82, y: 68, tags: ['centroavante', 'atacante', 'pl'] },
  ],
  "3-4-3": [
    { x: 8,  y: 50, tags: ['goleiro'] },
    { x: 25, y: 22, tags: ['zagueiro', 'd (c)', 'lateral esquerdo'] },
    { x: 22, y: 50, tags: ['zagueiro', 'd (c)'] },
    { x: 25, y: 78, tags: ['zagueiro', 'd (c)', 'lateral direito'] },
    { x: 50, y: 15, tags: ['meia esquerda', 'lateral esquerdo', 'm (e)'] },
    { x: 45, y: 35, tags: ['volante', 'm (c)'] },
    { x: 45, y: 65, tags: ['volante', 'm (c)'] },
    { x: 50, y: 85, tags: ['meia direita', 'lateral direito', 'm (d)'] },
    { x: 78, y: 18, tags: ['ponta esquerda', 'ponta esq'] },
    { x: 86, y: 50, tags: ['centroavante', 'atacante', 'pl'] },
    { x: 78, y: 82, tags: ['ponta direita', 'ponta dir'] },
  ],
  "5-3-2": [
    { x: 8,  y: 50, tags: ['goleiro'] },
    { x: 25, y: 12, tags: ['lateral esquerdo', 'd (e)'] },
    { x: 22, y: 30, tags: ['zagueiro', 'd (c)'] },
    { x: 20, y: 50, tags: ['zagueiro', 'd (c)'] },
    { x: 22, y: 70, tags: ['zagueiro', 'd (c)'] },
    { x: 25, y: 88, tags: ['lateral direito', 'd (d)'] },
    { x: 48, y: 32, tags: ['volante', 'm (c)'] },
    { x: 45, y: 50, tags: ['volante', 'm (c)'] },
    { x: 48, y: 68, tags: ['volante', 'm (c)'] },
    { x: 82, y: 32, tags: ['centroavante', 'atacante', 'pl'] },
    { x: 82, y: 68, tags: ['centroavante', 'atacante', 'pl'] },
  ],
};

const POS_ORDER: Record<string, number> = {
  "goleiro": 1,
  "zagueiro": 2,
  "lateral direito": 3,
  "lateral esquerdo": 4,
  "volante": 5,
  "meio-campista": 6,
  "meia atacante": 7,
  "ponta direita": 8,
  "ponta esquerda": 9,
  "centroavante": 10,
  "atacante": 11,
};

function gerarJogadoresMock(equipeId: number, isCasa: boolean): EstatisticaJogador[] {
  const mockNames = ["Goleiro", "Zagueiro Dir.", "Zagueiro Esq.", "Lateral Dir.", "Lateral Esq.", "Volante", "Meia Dir.", "Meia Esq.", "Ponta Dir.", "Ponta Esq.", "Centroavante"];
  const mockPositions = ["Goleiro", "Zagueiro", "Zagueiro", "Lateral Direito", "Lateral Esquerdo", "Volante", "Meio-Campista", "Meio-Campista", "Ponta Direita", "Ponta Esquerda", "Centroavante"];
  return Array.from({ length: 11 }).map((_, idx) => ({
    id: -100 - idx - (isCasa ? 0 : 20),
    equipeId,
    jogador: { id: -200 - idx, nomePopular: mockNames[idx], posicao: mockPositions[idx], fotoUrl: null },
    numeroCamisa: idx + 1, titular: true, notaDesempenho: null, minutosJogados: 0,
    gols: 0, assistencias: 0, passesCompletos: 0, desarmes: 0,
    posicaoMediaX: 0, posicaoMediaY: 0, cartoesAmarelos: 0, cartoesVermelhos: 0,
    posicaoPartida: idx.toString(),
  }));
}

/**
 * Maps starters to field positions.
 * Priority: saved posicaoPartida index (slot) → tag match → remaining fill.
 * Guarantees every slot gets exactly one player (if enough players exist).
 */
function getTacticalLayout(
  starters: EstatisticaJogador[],
  isCasa: boolean,
  formation: string,
): (EstatisticaJogador & { left: number; top: number })[] {
  const slots = FORMATIONS[formation] || FORMATIONS["4-3-3"];
  const numSlots = slots.length;

  // slotAssignment[slotIdx] = player
  const slotAssignment: (EstatisticaJogador | null)[] = new Array(numSlots).fill(null);
  const assignedPlayerIds = new Set<number>();

  // Pass 1: assign players that have a valid saved slot index
  starters.forEach(p => {
    if (p.posicaoPartida && /^\d+$/.test(p.posicaoPartida)) {
      const idx = parseInt(p.posicaoPartida, 10);
      if (idx >= 0 && idx < numSlots && slotAssignment[idx] === null && !assignedPlayerIds.has(p.id)) {
        slotAssignment[idx] = p;
        assignedPlayerIds.add(p.id);
      }
    }
  });

  // Pass 2: assign remaining players to empty slots by position tag match
  const remaining = starters.filter(p => !assignedPlayerIds.has(p.id));

  for (let slotIdx = 0; slotIdx < numSlots; slotIdx++) {
    if (slotAssignment[slotIdx] !== null) continue;
    const slot = slots[slotIdx];

    let bestIdx = -1;
    for (let i = 0; i < remaining.length; i++) {
      const pPos = (remaining[i].jogador.posicao || '').toLowerCase().trim();
      
      // Match direto de tags especificas primeiro (se pPos for detalhado)
      let matchesSlot = slot.tags.some(tag => pPos.includes(tag) || tag.includes(pPos));
      
      // Se não deu match e o jogador tem posição genérica (ou o contrário)
      if (!matchesSlot) {
        const isG = pPos === 'g' || pPos === 'gk' || pPos.includes('goleiro');
        const isD = pPos === 'd' || pPos.includes('zagueiro') || pPos.includes('lateral');
        const isM = pPos === 'm' || pPos.includes('meio') || pPos.includes('volante') || pPos.includes('meia');
        const isF = pPos === 'f' || pPos === 'a' || pPos.includes('atacante') || pPos.includes('centroavante') || pPos.includes('ponta');

        if (slot.tags.some(t => t.includes('goleiro')) && isG) matchesSlot = true;
        else if (slot.tags.some(t => t.includes('zagueiro') || t.includes('lateral')) && isD) matchesSlot = true;
        else if (slot.tags.some(t => t.includes('volante') || t.includes('meia') || t.includes('meio')) && isM) matchesSlot = true;
        else if (slot.tags.some(t => t.includes('centroavante') || t.includes('atacante') || t.includes('ponta') || t === 'pl') && isF) matchesSlot = true;
      }

      if (matchesSlot) {
        bestIdx = i;
        break;
      }
    }

    if (bestIdx === -1 && remaining.length > 0) bestIdx = 0;

    if (bestIdx !== -1) {
      const player = remaining.splice(bestIdx, 1)[0];
      slotAssignment[slotIdx] = { ...player, posicaoPartida: slotIdx.toString() };
      assignedPlayerIds.add(player.id);
    }
  }

  // Build result list with coordinates
  const result: (EstatisticaJogador & { left: number; top: number })[] = [];

  for (let slotIdx = 0; slotIdx < numSlots; slotIdx++) {
    const player = slotAssignment[slotIdx];
    if (!player) continue;
    const slot = slots[slotIdx];
    result.push({
      ...player,
      posicaoPartida: slotIdx.toString(),
      left: isCasa ? slot.y : 100 - slot.y,
      top:  isCasa ? slot.x : 100 - slot.x,
    });
  }

  // Any leftover (more than 11 starters) placed in center
  remaining.forEach(p => result.push({ ...p, left: 50, top: 50 }));

  return result;
}

function PlayerNode({
  j, left, top, getBadgeColor, isEditMode, onSwapPlayers,
}: {
  j: EstatisticaJogador;
  left: number;
  top: number;
  getBadgeColor: (n: number | null) => string;
  isEditMode?: boolean;
  onSwapPlayers?: (dragId: number, dropId: number) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const badgeColor = getBadgeColor(j.notaDesempenho ?? null);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.dataTransfer.setData('text/plain', j.id.toString());
  };
  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent) => {
    if (!isEditMode || !onSwapPlayers) return;
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (draggedId && draggedId !== j.id) onSwapPlayers(draggedId, j.id);
  };

  return (
    <div
      className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-500 ease-out ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ left: `${left}%`, top: `${top}%` }}
      draggable={isEditMode}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="relative w-10 h-10 rounded-full border-2 border-white/60 bg-slate-900 overflow-hidden shadow-lg">
        {j.jogador.fotoUrl && !imgError
          ? <img src={`${j.jogador.fotoUrl}?id=${j.jogador.id || j.id}`} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} onError={() => setImgError(true)} />
          : <div className="w-full h-full flex items-center justify-center bg-slate-800 text-[10px] font-black text-slate-500 pointer-events-none">{j.numeroCamisa || j.jogador.numeroCamisa || '-'}</div>
        }
        <div className={`absolute -bottom-0.5 -right-0.5 px-1 py-0 rounded text-[7px] font-black border border-black/20 ${badgeColor}`}>
          {j.notaDesempenho?.toFixed(1) || '-'}
        </div>
      </div>
      <span className="mt-1 text-[7px] font-black text-white uppercase tracking-tighter bg-black/60 px-1.5 py-0.5 rounded-full border border-white/5 backdrop-blur-md whitespace-nowrap group-hover:bg-accent transition-colors">
        {j.jogador.nomePopular}
      </span>
    </div>
  );
}

export default function CardFormacoes({
  jogadores, idCasa, idVisitante, nomeCasa, nomeVisitante,
  escudoCasa, escudoVisitante, treinadorCasa, treinadorVisitante,
  isAdmin, partidaId, formacaoCasa, formacaoVisitante,
}: Props) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [timeSelecionado, setTimeSelecionado] = useState<'casa' | 'visitante'>('casa');
  const [draftJogadores, setDraftJogadores] = useState<EstatisticaJogador[]>(jogadores);
  const [draftFormacaoCasa, setDraftFormacaoCasa] = useState(formacaoCasa || "4-3-3");
  const [draftFormacaoVisitante, setDraftFormacaoVisitante] = useState(formacaoVisitante || "4-3-3");

  useEffect(() => {
    setDraftJogadores(jogadores);
    if (formacaoCasa) setDraftFormacaoCasa(formacaoCasa);
    if (formacaoVisitante) setDraftFormacaoVisitante(formacaoVisitante);
  }, [jogadores, formacaoCasa, formacaoVisitante]);

  const sortTitulares = (a: EstatisticaJogador, b: EstatisticaJogador) => {
    if (a.posicaoPartida && b.posicaoPartida && /^\d+$/.test(a.posicaoPartida) && /^\d+$/.test(b.posicaoPartida)) {
      return parseInt(a.posicaoPartida) - parseInt(b.posicaoPartida);
    }
    const getOrder = (pos: string) => {
      for (const [key, value] of Object.entries(POS_ORDER)) {
        if (pos.toLowerCase().includes(key)) return value;
      }
      return 99;
    };
    const orderA = getOrder(a.jogador.posicao), orderB = getOrder(b.jogador.posicao);
    if (orderA !== orderB) return orderA - orderB;
    return (a.numeroCamisa || 99) - (b.numeroCamisa || 99);
  };

  const currentFormacao = timeSelecionado === 'casa' ? draftFormacaoCasa : draftFormacaoVisitante;
  const idTime = timeSelecionado === 'casa' ? idCasa : idVisitante;

  const realTitulares = draftJogadores.filter(j => j.equipeId === idTime && j.titular);
  const startersToDisplay = realTitulares.length > 0
    ? realTitulares
    : gerarJogadoresMock(idTime, timeSelecionado === 'casa');

  const layout = getTacticalLayout(startersToDisplay, timeSelecionado === 'casa', currentFormacao);
  const reservas = draftJogadores.filter(j => j.equipeId === idTime && !j.titular)
    .sort((a, b) => a.jogador.nomePopular.localeCompare(b.jogador.nomePopular));

  // Swap slot positions between two players
  const handleSwapPlayers = (dragId: number, dropId: number) => {
    const dragLayout = layout.find(l => l.id === dragId);
    const dropLayout = layout.find(l => l.id === dropId);
    if (!dragLayout || !dropLayout) return;

    const dragSlot = dragLayout.posicaoPartida;
    const dropSlot = dropLayout.posicaoPartida;

    setDraftJogadores(prev => prev.map(j => {
      if (j.id === dragId) return { ...j, posicaoPartida: dropSlot };
      if (j.id === dropId) return { ...j, posicaoPartida: dragSlot };
      return j;
    }));
  };

  const handleDraftChange = (id: number, field: keyof EstatisticaJogador, value: any) => {
    setDraftJogadores(prev => prev.map(j => j.id === id ? { ...j, [field]: value } : j));
  };

  const handleSave = async () => {
    if (!partidaId) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      // Build final slot assignments from current layout
      const currentLayout = getTacticalLayout(startersToDisplay, timeSelecionado === 'casa', currentFormacao);
      const slotMap: Record<number, string> = {};
      currentLayout.forEach(l => { slotMap[l.id] = l.posicaoPartida || ''; });

      // Apply updated posicaoPartida from draftJogadores (includes swaps)
      const allJogadoresWithSlots = draftJogadores.map(dj => ({
        ...dj,
        posicaoPartida: dj.posicaoPartida ?? null,
      }));

      const input = {
        partidaId,
        formacaoCasa: draftFormacaoCasa,
        formacaoVisitante: draftFormacaoVisitante,
        jogadores: allJogadoresWithSlots
          .filter(j => j.id > 0)
          .map(j => ({
            estatisticaId: j.id,
            titular: j.titular,
            posicaoPartida: j.posicaoPartida || null,
            numeroCamisa: j.numeroCamisa || null,
          })),
      };

      const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation AtualizarEscalacao($input: AtualizarEscalacaoInput!) { atualizarEscalacaoPartida(input: $input) }`,
          variables: { input },
        }),
      });

      const data = await res.json();
      if (data.errors) {
        setSaveError(data.errors[0]?.message || 'Erro ao salvar');
      } else {
        setIsEditMode(false);
        router.refresh();
      }
    } catch (e: any) {
      setSaveError(e.message || 'Erro desconhecido');
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const getBadgeColor = (n: number | null) => {
    if (n === null) return 'bg-slate-800 text-slate-500';
    if (n >= 7.5) return 'bg-emerald-500 text-white';
    if (n >= 7.0) return 'bg-green-600 text-white';
    if (n >= 6.0) return 'bg-amber-500 text-black';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-stretch">
      {/* FIELD */}
      <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-[32px] p-4 shadow-inner relative min-h-[480px]">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-slate-800">
            <button
              onClick={() => setTimeSelecionado('casa')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeSelecionado === 'casa' ? 'bg-white text-black shadow-md' : 'text-slate-500 hover:text-white'}`}
            >
              {nomeCasa}
            </button>
            <button
              onClick={() => setTimeSelecionado('visitante')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeSelecionado === 'visitante' ? 'bg-white text-black shadow-md' : 'text-slate-500 hover:text-white'}`}
            >
              {nomeVisitante}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Esquema:</span>
            <select
              value={currentFormacao}
              onChange={(e) => {
                if (timeSelecionado === 'casa') setDraftFormacaoCasa(e.target.value);
                else setDraftFormacaoVisitante(e.target.value);
              }}
              className="bg-black border border-slate-800 text-white text-[9px] font-black uppercase rounded-lg px-2 py-1 outline-none"
            >
              {Object.keys(FORMATIONS).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Pitch */}
        <div className="relative h-[400px] w-full max-w-2xl mx-auto overflow-hidden rounded-[20px] border border-white/5 bg-gradient-to-br from-[#0c1410] to-black shadow-2xl">
          {/* Field markings */}
          <div className="absolute inset-4 border border-white/5 rounded-[12px] pointer-events-none" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 pointer-events-none" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/5 pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 pointer-events-none" />

          {layout.map(j => (
            <PlayerNode
              key={j.id}
              j={j}
              left={j.left}
              top={j.top}
              getBadgeColor={getBadgeColor}
              isEditMode={isEditMode}
              onSwapPlayers={handleSwapPlayers}
            />
          ))}
        </div>

        {isEditMode && (
          <p className="text-center text-[8px] text-slate-600 uppercase tracking-widest mt-3 font-black">
            Arraste jogadores para trocar posições
          </p>
        )}
      </div>

      {/* SIDEBAR */}
      <div className="lg:col-span-4 flex flex-col bg-slate-950 border border-slate-900 rounded-[32px] p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white truncate">Lista de Atletas</h3>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              {isEditMode
                ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setIsEditMode(false); setSaveError(null); setDraftJogadores(jogadores); }} className="p-1 text-slate-500 hover:text-white" disabled={isSaving}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1 text-[8px] font-black uppercase bg-accent text-white px-2 py-0.5 rounded shadow-lg disabled:opacity-50" disabled={isSaving}>
                      <Save className="w-2.5 h-2.5" />
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                )
                : (
                  <button onClick={() => setIsEditMode(true)} className="flex items-center gap-1 text-[8px] font-black uppercase text-accent hover:text-white border border-accent/30 px-2 py-0.5 rounded transition-colors">
                    <Edit3 className="w-2.5 h-2.5" /> Editar
                  </button>
                )
              }
            </div>
          )}
        </div>

        {saveError && (
          <div className="text-[8px] text-rose-400 font-bold bg-rose-950/50 border border-rose-800/50 rounded-lg px-3 py-2">
            ⚠ {saveError}
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                {(timeSelecionado === 'casa' ? escudoCasa : escudoVisitante) && (
                  <img src={(timeSelecionado === 'casa' ? escudoCasa : escudoVisitante) || ''} alt="" className="w-4 h-4 object-contain" />
                )}
                <h4 className="text-[9px] font-black text-white uppercase tracking-tight truncate">
                  {timeSelecionado === 'casa' ? nomeCasa : nomeVisitante}
                </h4>
              </div>
              <p className="text-[8px] font-bold text-slate-600 truncate max-w-[50%]">
                {(timeSelecionado === 'casa' ? treinadorCasa : treinadorVisitante) || 'Não Informado'}
              </p>
            </div>

            {/* Titulares */}
            <div className="space-y-1.5 flex-none">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 border-b border-slate-900/50 block pb-0.5">
                Titulares ({realTitulares.length}/11)
              </span>
              <div className="space-y-0.5">
                {realTitulares.sort(sortTitulares).map(j =>
                  isEditMode
                    ? (
                      <div key={j.id} className="flex items-center text-xs py-2 gap-3 border-b border-slate-900/50">
                        <span className="font-bold w-5 text-right text-slate-500">{j.numeroCamisa || j.jogador.numeroCamisa || '-'}</span>
                        <input
                          type="checkbox"
                          checked={j.titular}
                          onChange={(e) => handleDraftChange(j.id, 'titular', e.target.checked)}
                          className="accent-accent w-5 h-5 cursor-pointer shrink-0"
                        />
                        <input
                          type="number"
                          value={j.numeroCamisa || j.jogador.numeroCamisa || ''}
                          onChange={(e) => handleDraftChange(j.id, 'numeroCamisa', parseInt(e.target.value) || null)}
                          className="w-10 bg-slate-900 text-white font-mono text-sm text-center border border-slate-800 rounded shrink-0 p-1.5"
                        />
                        <span className="font-bold text-white truncate text-sm flex-1">{j.jogador.nomePopular}</span>
                      </div>
                    )
                    : (
                      <div key={j.id} className="flex items-center justify-between text-[10px] py-0.5 hover:bg-slate-900/30 rounded px-1 transition-colors group">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono font-bold text-[9px] text-slate-600 w-3 text-right shrink-0">{j.numeroCamisa || j.jogador.numeroCamisa || '-'}</span>
                          <span className="font-bold text-white truncate text-slate-400 group-hover:text-white transition-colors">{j.jogador.nomePopular}</span>
                        </div>
                        {j.notaDesempenho != null && (
                          <span className="font-mono text-[8px] font-black text-slate-500 shrink-0 bg-slate-900 px-1 rounded">
                            {j.notaDesempenho.toFixed(1)}
                          </span>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Reservas */}
            {reservas.length > 0 && (
              <div className="space-y-1.5 flex-1 min-h-0 flex flex-col pt-2 border-t border-slate-900">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 block">
                  Reservas ({reservas.length})
                </span>
                <div className="space-y-0.5 overflow-y-auto pr-1 custom-scrollbar">
                  {reservas.map(j =>
                    isEditMode
                      ? (
                        <div key={j.id} className="flex items-center text-xs py-2 gap-3 border-b border-slate-900/50 opacity-50">
                          <span className="font-bold w-5 text-right text-slate-500">{j.numeroCamisa || j.jogador.numeroCamisa || '-'}</span>
                          <input
                            type="checkbox"
                            checked={j.titular}
                            onChange={(e) => handleDraftChange(j.id, 'titular', e.target.checked)}
                            className="accent-accent w-5 h-5 cursor-pointer shrink-0"
                          />
                          <input
                            type="number"
                            value={j.numeroCamisa || j.jogador.numeroCamisa || ''}
                            onChange={(e) => handleDraftChange(j.id, 'numeroCamisa', parseInt(e.target.value) || null)}
                            className="w-10 bg-slate-900 text-white font-mono text-sm text-center border border-slate-800 rounded shrink-0 p-1.5"
                          />
                          <span className="font-bold text-slate-500 truncate text-sm flex-1">{j.jogador.nomePopular}</span>
                        </div>
                      )
                      : (
                        <div key={j.id} className="flex items-center justify-between text-[10px] py-0.5 hover:bg-slate-900/30 rounded px-1 transition-colors">
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono font-bold text-[8px] text-slate-700 w-3 text-right shrink-0">{j.numeroCamisa || j.jogador.numeroCamisa || '-'}</span>
                            <span className="font-bold text-slate-500 truncate">{j.jogador.nomePopular}</span>
                          </div>
                          {(j.minutosJogados ?? 0) > 0 && (
                            <span className="text-[8px] text-emerald-400 shrink-0 opacity-50" title={`${j.minutosJogados} minutos`}>🔄</span>
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
