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

async function fetchEquipes() {
  const resposta = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  // Verificação rigorosa de segurança da sessão
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const equipes = await fetchEquipes();

  return <AdminClubesClient equipesIniciais={equipes} tokenJwt={session?.accessToken} />;
}