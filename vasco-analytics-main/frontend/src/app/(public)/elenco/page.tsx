import React from 'react';
import ElencoClient from './ElencoClient';

interface Jogador {
  id: number;
  nomePopular: string;
  posicao: string;
  numeroCamisa: number | null;
  nacionalidade: string | null;
}


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
  const resposta = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    
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

  
  return resultado.data.jogadoresPorClube;
}


export default async function ElencoPage() {
  const jogadores = await fetchElenco();

  return <ElencoClient jogadoresIniciais={jogadores} />;
}