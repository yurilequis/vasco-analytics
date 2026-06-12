const axios = require('axios');

const GET_DETALHES_PARTIDA = `
  query GetPartidaDetalhes($id: Int!) {
    partida(id: $id) {
      id, status, dataHora, golsCasa, golsVisitante
      equipeCasa { id, nome }
      equipeVisitante { id, nome }
      estatisticasJogadores {
        id, equipeId, numeroCamisa, titular, notaDesempenho, minutosJogados, gols, assistencias, posicaoMediaX, posicaoMediaY
        jogador { nomePopular, posicao }
      }
    }
  }
`;

axios.post('http://localhost:3001/graphql', {
  query: GET_DETALHES_PARTIDA,
  variables: { id: 71 }
}).then(res => {
  const data = res.data.data;
  console.log("GraphQL Partida response:", data.partida.equipeCasa.nome, "vs", data.partida.equipeVisitante.nome);
  const casaPlayers = data.partida.estatisticasJogadores.filter(j => j.equipeId === data.partida.equipeCasa.id);
  console.log("CASA PLAYERS FROM GRAPHQL:", casaPlayers.map(j => ({
    name: j.jogador.nomePopular,
    titular: j.titular,
    x: j.posicaoMediaX,
    y: j.posicaoMediaY
  })));
}).catch(console.error);
