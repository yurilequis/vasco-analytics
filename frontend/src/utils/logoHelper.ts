export const getLogoPath = (nomeEquipe: string): string => {
  // Dicionário para resolver diferenças entre o nome do banco e o nome do arquivo
  const mapaNomes: Record<string, string> = {
    'Vasco da Gama': 'vasco',
    'Vasco': 'vasco',
    'Athletico': 'athletico-paranaense',
    'Atlético-MG': 'atletico-mineiro',
    'São Paulo': 'sao-paulo',
    'Red Bull Bragantino': 'rb-bragantino',
  };

  // 1. Tenta pegar do mapa, se não, normaliza o nome (ex: "Flamengo" -> "flamengo")
  const nomeNormalizado = mapaNomes[nomeEquipe] || nomeEquipe
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, '-');

  return `/logos/${nomeNormalizado}.png`;
};