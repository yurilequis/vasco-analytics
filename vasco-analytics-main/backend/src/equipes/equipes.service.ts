import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

export interface AtualizarEquipeDados {
  nome?: string;
  nomeCurto?: string;
  sigla?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  fundacao?: string | Date; 
  escudoUrl?: string;
}

@Injectable()
export class EquipesService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodas() {
    return this.prisma.equipe.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.equipe.findUnique({
      where: { id },
    });
  }

  
  async atualizarEquipe(id: number, dados: AtualizarEquipeDados) {
    let dataFundacao = dados.fundacao;

    
    if (typeof dataFundacao === 'string') {
      dataFundacao = new Date(dataFundacao);
    }

    return this.prisma.equipe.update({
      where: { id },
      data: {
        ...dados,
        fundacao: dataFundacao,
      },
    });
  }

  async sincronizarEscudosLocais(): Promise<number> {
    let atualizados = 0;
    const logosDir = path.join(process.cwd(), '../frontend/public/logos');
    
    if (!fs.existsSync(logosDir)) {
      console.warn(`Diretório não encontrado: ${logosDir}`);
      return 0;
    }

    const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.png'));
    const equipes = await this.prisma.equipe.findMany();
    
    const normalizeName = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    for (const equipe of equipes) {
      const nomeNorm = normalizeName(equipe.nome);
      
      const eSlug = nomeNorm.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const eSlugCurto = equipe.nomeCurto ? normalizeName(equipe.nomeCurto).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : null;
      const primeiroNome = eSlug.split('-')[0];

      const matchedFile = files.find(f => {
        const fSlug = f.split('.')[0].toLowerCase(); 
        
        if (fSlug === eSlug) return true; 
        if (f.startsWith(`${eSlug}.`)) return true; 
        if (eSlugCurto && fSlug === eSlugCurto) return true; 
        
        
        
        if (primeiroNome.length > 4 && f.startsWith(`${primeiroNome}.`)) return true;

        return false;
      });

      if (matchedFile) {
         const newUrl = `/logos/${matchedFile}`;
         if (equipe.escudoUrl !== newUrl) {
           await this.prisma.equipe.update({ where: { id: equipe.id }, data: { escudoUrl: newUrl }});
           atualizados++;
         }
      }
    }
    
    return atualizados;
  }
}
