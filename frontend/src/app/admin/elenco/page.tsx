import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
// 1. Limpamos a importação para remover o aviso do TypeScript
import AdminElencoClient from './AdminElencoClient';

const GET_ELENCO_ADMIN = `
  query ObterElencoAdmin($clube: String!) {
    jogadoresPorClube(clube: $clube) {
      id
      nomePopular
      nomeCompleto
      posicao
      posicaoSecundaria
      peDominante
      numeroCamisa
      categoria
      emprestado
      clubeEmprestimo
      ativo
      equipeId
      fotoUrl
      alturaCm
      dataNascimento
    }
  }
`;

const GET_EQUIPES = `
  query {
    equipes {
      id
      nome
      pais
      estado
    }
  }
`;

async function fetchDados() {
  const [resElenco, resEquipes] = await Promise.all([
    fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 2. CORREÇÃO CRÍTICA: Trocamos 'Vasco da Gama' por 'Vasco'
      body: JSON.stringify({ query: GET_ELENCO_ADMIN, variables: { clube: 'Vasco' } }),
      cache: 'no-store', 
    }),
    fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_EQUIPES }),
      cache: 'no-store', 
    })
  ]);

  const dadosElenco = await resElenco.json();
  const dadosEquipes = await resEquipes.json();

  if (dadosElenco.errors) {
    console.error("🚨 ERRO GRAPHQL NO ELENCO:", JSON.stringify(dadosElenco.errors, null, 2));
  }
  if (dadosEquipes.errors) {
    console.error("🚨 ERRO GRAPHQL NAS EQUIPES:", JSON.stringify(dadosEquipes.errors, null, 2));
  }

  return {
    jogadores: dadosElenco.data?.jogadoresPorClube || [],
    equipes: dadosEquipes.data?.equipes || [] 
  };
}

export default async function AdminElencoPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/admin/login");

  const { jogadores, equipes } = await fetchDados();

  return (
    <AdminElencoClient 
      jogadoresIniciais={jogadores} 
      equipesDisponiveis={equipes} 
      tokenJwt={session?.accessToken} 
    />
  );
}