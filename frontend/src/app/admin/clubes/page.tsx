import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminClubesClient from "./AdminClubesClient";

const GET_EQUIPES = `
  query {
    equipes {
      id
      nome
      nomeCurto
      sigla
      estado
      pais
      escudoUrl
    }
  }
`;

async function fetchEquipes(token?: string) {
  const resposta = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query: GET_EQUIPES }),
    cache: 'no-store',
  });
  
  const resultado = await resposta.json();
  
  if (resultado.errors) {
    console.error("Erro na consulta de equipas:", resultado.errors);
    return [];
  }
  
  return resultado.data?.equipes || [];
}

export default async function AdminClubesPage() {
  
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const equipes = await fetchEquipes(session?.access_token);

  return <AdminClubesClient equipesIniciais={equipes} tokenJwt={session?.access_token} />;
}