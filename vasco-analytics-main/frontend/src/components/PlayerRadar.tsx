"use client";

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PerfilFM {
  
  finalizacao?: number | null;
  passe?: number | null;
  drible?: number | null;
  tecnica?: number | null;
  cruzamento?: number | null;
  marcacao?: number | null;
  desarme?: number | null;
  
  aceleracao?: number | null;
  velocidade?: number | null;
  agilidade?: number | null;
  forca?: number | null;
  resistencia?: number | null;
  equilibrio?: number | null;
  
  decisoes?: number | null;
  visaoJogo?: number | null;
  compostura?: number | null;
  antecipacao?: number | null;
  trabalhoEquipe?: number | null;
  posicionamento?: number | null;
}

interface Props {
  fm: PerfilFM | null | undefined;
}

export default function PlayerRadar({ fm }: Props) {
  if (!fm) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-900/20 border border-slate-900 rounded-[40px] text-[10px] font-black uppercase text-slate-500 tracking-widest min-h-[260px]">
        Sem dados de Scout
      </div>
    );
  }

  
  const calculateAverage = (keys: (keyof PerfilFM)[]) => {
    let sum = 0;
    let count = 0;
    keys.forEach(k => {
      if (fm[k] !== null && fm[k] !== undefined) {
        sum += fm[k] as number;
        count++;
      }
    });
    return count > 0 ? sum / count : 10; 
  };

  const data = [
    { subject: 'ATAQUE', A: calculateAverage(['finalizacao', 'tecnica', 'drible']), fullMark: 20 },
    { subject: 'CRIAÇÃO', A: calculateAverage(['passe', 'visaoJogo', 'cruzamento']), fullMark: 20 },
    { subject: 'TÁTICA', A: calculateAverage(['decisoes', 'antecipacao', 'posicionamento', 'trabalhoEquipe']), fullMark: 20 },
    { subject: 'DEFESA', A: calculateAverage(['marcacao', 'desarme', 'posicionamento']), fullMark: 20 },
    { subject: 'FÍSICO', A: calculateAverage(['forca', 'resistencia', 'equilibrio']), fullMark: 20 },
    { subject: 'RITMO', A: calculateAverage(['aceleracao', 'velocidade', 'agilidade']), fullMark: 20 },
  ];

  return (
    <div className="w-full h-full min-h-[260px] flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} 
            itemStyle={{ color: '#ef4444' }}
            formatter={(value: any) => [value ? Number(value).toFixed(1) : '0.0', 'Score']}
          />
          <Radar 
            name="Atleta" 
            dataKey="A" 
            stroke="#ef4444" 
            strokeWidth={2}
            fill="#ef4444" 
            fillOpacity={0.3} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
