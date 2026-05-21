import React from 'react';
import ElencoClient from './ElencoClient'; // Importamos o nosso novo componente!

interface Jogador {
  id: number;
  nomePopular: string;
  posicao: string;
  numeroCamisa: number | null;
  nacionalidade: string | null;
}

const GET_ELENCO = `
  query {
    jogadoresAtivos {
      id
      nomePopular
      posicao
      numeroCamisa
      nacionalidade
    }
  }
`;

async function fetchElenco(): Promise<Jogador[]> {
  const resposta = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: GET_ELENCO }),
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

  return resultado.data.jogadoresAtivos;
}

// O ecrã no lado do servidor vai apenas buscar os dados e enviá-los para o Cliente
export default async function ElencoPage() {
  const jogadores = await fetchElenco();

  return <ElencoClient jogadoresIniciais={jogadores} />;
}