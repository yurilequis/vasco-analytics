export const getLogoPath = (nomeEquipe: string): string => {
  
  const mapaNomes: Record<string, string> = {
    'Vasco da Gama': 'vasco',
    'Vasco': 'vasco',
    'Athletico': 'athletico-paranaense',
    'Atlético-MG': 'atletico-mineiro',
    'São Paulo': 'sao-paulo',
    'Red Bull Bragantino': 'rb-bragantino',
  };

  
  const nomeNormalizado = mapaNomes[nomeEquipe] || nomeEquipe
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, '-');

  return `/logos/${nomeNormalizado}.png`;
};