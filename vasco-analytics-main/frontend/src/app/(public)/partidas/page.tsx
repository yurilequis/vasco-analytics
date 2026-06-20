import React from 'react';
import Link from 'next/link';
import { getLogoPath } from '@/utils/logoHelper';
import { 
  Trophy, 
  MapPin, 
  ChevronRight,
  Search,
  Filter,
  Zap
} from 'lucide-react';

import PartidasClient from './PartidasClient';

const GET_PARTIDAS = `
  query {
    partidas {
      id, dataHora, status, golsCasa, golsVisitante
      competicao { nome }
      equipeCasa { nome, escudoUrl }
      equipeVisitante { nome, escudoUrl }
      estadio { nome }
    }
  }
`;

async function fetchPartidas() {
  try {
    const resposta = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || (process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: GET_PARTIDAS }),
      cache: 'no-store',
    });
    const resultado = await resposta.json();
    return resultado.data?.partidas || [];
  } catch (e) {
    return [];
  }
}

export default async function PartidasPage() {
  const todas = await fetchPartidas();
  return <PartidasClient todas={todas} />;
}
