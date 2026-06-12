/**
 * Retorna uma classe de cor baseada na nota do jogador (estilo Sofascore/FM)
 * @param rating Nota de 0 a 10
 */
export function getRatingColor(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) return 'bg-slate-700 text-slate-300';

  if (rating >= 7.5) return 'bg-emerald-600 text-white'; // Excelente
  if (rating >= 6.5) return 'bg-amber-500 text-black';   // Bom/Médio
  return 'bg-rose-600 text-white';                      // Ruim
}

/**
 * Traduz o pe dominante para um formato amigável
 */
export function traduzirPe(pe: string | null | undefined): string {
  if (!pe) return 'Não informado';
  const p = pe.toLowerCase();
  if (p === 'direito') return 'Destro';
  if (p === 'esquerdo') return 'Canhoto';
  if (p === 'ambidestro') return 'Ambidestro';
  return pe;
}
