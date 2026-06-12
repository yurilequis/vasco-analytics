export const GET_DETALHES_PARTIDA = `
  query GetPartidaDetalhes($id: Int!) {
    partida(id: $id) {
      id
      status
      golsCasa
      golsVisitante
      equipeCasa { nome }
      equipeVisitante { nome }
      competicao { nome }
      estadio { nome }
      arbitro { nomePopular }
      eventos {
        id
        minuto
        tipoEvento
        descricao
      }
      estatisticasEquipes {
        equipeId
        posseBola
        chutes
      }
    }
  }
`;