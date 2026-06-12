import React from 'react';
import ElencoClient from './ElencoClient';

interface Jogador {
  id: number;
  nomePopular: string;
  posicao: string;
  numeroCamisa: number | null;
  nacionalidade: string | null;
}

// 1. Atualizamos a query para aceitar variáveis e chamar o endpoint correto
const GET_ELENCO = `
  query ObterElencoPorClube($clube: String!) {
    jogadoresPorClube(clube: $clube) {
      id
      nomePopular
      posicao
      numeroCamisa
      nacionalidade
      fotoUrl
      categoria
      emprestado
      alturaCm
      dataNascimento
      peDominante
    }
  }
`;

async function fetchElenco(): Promise<Jogador[]> {
  const resposta = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // 2. Injetamos o objeto "variables" definindo a busca pelo Vasco
    body: JSON.stringify({ 
      query: GET_ELENCO,
      variables: {
        clube: 'Vasco'
      }
    }),
    cache: 'no-store', 
  });

  const resultado = await resposta.json();

  if (resultado.errors) {
    console.error("❌ Erro reportado pelo GraphQL:", JSON.stringify(resultado.errors, null, 2));
    return [];
  }

  if (!resultado.data) {
    console.error("❌ Resposta inesperada:", resultado);
    return [];
  }

  // 3. Retornamos a propriedade correta da nossa nova query
  return resultado.data.jogadoresPorClube;
}

// O ecrã no lado do servidor vai apenas buscar os dados e enviá-los para o Cliente
export default async function ElencoPage() {
  const jogadores = await fetchElenco();

  return <ElencoClient jogadoresIniciais={jogadores} />;
}