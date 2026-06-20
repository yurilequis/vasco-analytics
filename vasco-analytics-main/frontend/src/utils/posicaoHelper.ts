export function traduzirPosicao(posicaoBanco: string) {
  if (!posicaoBanco) return { nome: 'Desconhecido', peso: 99, setor: 'Outros' };
  
  const pos = posicaoBanco.trim();

  
  if (pos === 'Goleiro') return { nome: pos, peso: 1, setor: 'Goleiros' };
  if (pos === 'Zagueiro') return { nome: pos, peso: 2, setor: 'Defenses' };
  if (pos === 'Lateral Direito') return { nome: pos, peso: 3, setor: 'Defensores' };
  if (pos === 'Lateral Esquerdo') return { nome: pos, peso: 4, setor: 'Defensores' };
  if (pos === 'Volante') return { nome: pos, peso: 5, setor: 'Meio-campistas' };
  if (pos === 'Meia Central') return { nome: pos, peso: 6, setor: 'Meio-campistas' };
  if (pos === 'Meia Esquerda') return { nome: pos, peso: 7, setor: 'Meio-campistas' };
  if (pos === 'Meia Direita') return { nome: pos, peso: 8, setor: 'Meio-campistas' };
  if (pos === 'Meia Atacante') return { nome: pos, peso: 9, setor: 'Meio-campistas' };
  if (pos === 'Ponta Esquerda') return { nome: pos, peso: 10, setor: 'Atacantes' };
  if (pos === 'Ponta Direita') return { nome: pos, peso: 11, setor: 'Atacantes' };
  if (pos === 'Centroavante') return { nome: pos, peso: 12, setor: 'Atacantes' };

  return { nome: pos, peso: 99, setor: 'Outros' };
}

export const POSICOES_DISPONIVEIS = [
  "Goleiro", "Zagueiro", "Lateral Direito", "Lateral Esquerdo", 
  "Volante", "Meia Central", "Meia Direita", "Meia Esquerda", "Meia Atacante",
  "Ponta Direita", "Ponta Esquerda", "Centroavante"
];

export const FUNCOES_POR_POSICAO: Record<string, string[]> = {
  "Goleiro": ["Goleiro Tradicional", "Goleiro Linha"],
  "Zagueiro": ["Zagueiro Defensor", "Zagueiro Construtor", "Líbero"],
  "Lateral Direito": ["Lateral Defensivo", "Lateral Ofensivo", "Ala", "Lateral Invertido"],
  "Lateral Esquerdo": ["Lateral Defensivo", "Lateral Ofensivo", "Ala", "Lateral Invertido"],
  "Volante": ["Primeiro Volante", "Segundo Volante", "Construtor de Jogo Recuado", "Destruidor"],
  "Meia Central": ["Box-to-Box", "Carrilero", "Meia Central Defensivo", "Armador Avançado"],
  "Meia Direita": ["Meia Aberto", "Armador Aberto"],
  "Meia Esquerda": ["Meia Aberto", "Armador Aberto"],
  "Meia Atacante": ["Camisa 10 Clássico", "Trequartista", "Enganche", "Atacante Sombra"],
  "Ponta Direita": ["Extremo", "Avançado Interior", "Ponta Construtor"],
  "Ponta Esquerda": ["Extremo", "Avançado Interior", "Ponta Construtor"],
  "Centroavante": ["Falso 9", "Homem de Área", "Atacante de Referência", "Ponta de Lança"]
};