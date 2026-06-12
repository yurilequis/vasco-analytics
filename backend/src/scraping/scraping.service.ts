import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import {
  PartidasService,
  PartidaIngestao,
  DetalhesPartidaIngestao,
} from '../partidas/partidas.service';

// ── CONTRATOS (INTERFACES DA API PYTHON) ──────────────

interface PartidaAPI {
  event_id: number;
  campeonato: string;
  data_partida: string | null;
  mandante: string;
  visitante: string;
  gols_mandante: number | null;
  gols_visitante: number | null;
  status: string;
  rodada: string | null;
}

interface RespostaPartidasAPI {
  dados: PartidaAPI[];
}

interface JogadorAPI {
  atleta_id: string;
  nome: string;
  posicao: string;
  camisa: string;
}

interface RespostaElencoAPI {
  dados: JogadorAPI[];
}

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  // private readonly API_VASCO_URL = 'http://127.0.0.1:8000/api/v1/vasco';

  constructor(
    private readonly prisma: PrismaService,
    private readonly partidasService: PartidasService,
  ) {}

  private async runPythonScraper(command: string, arg?: string): Promise<any> {
    // Aponta para o interpretador local do NestJS e o script sofascore.py
    const venvPath = path.join(process.cwd(), 'python_venv', 'Scripts', 'python.exe');
    const scriptPath = path.join(process.cwd(), 'src', 'scraping', 'python_scripts', 'sofascore.py');
    
    let execCmd = `"${venvPath}" "${scriptPath}" ${command}`;
    if (arg) {
      execCmd += ` ${arg}`;
    }

    try {
      const { stdout } = await execAsync(execCmd);
      return JSON.parse(stdout);
    } catch (error) {
      this.logger.error(`Erro ao executar scraper Python para ${command}`, error);
      throw error;
    }
  }

  async scrapePartidas(): Promise<void> {
    this.logger.log('Iniciando sincronização completa de partidas via Python local...');
    try {
      const respostaJogos = await this.runPythonScraper('jogos');

      if (respostaJogos.erro) {
         this.logger.error(respostaJogos.erro);
         return;
      }

      const jogos: PartidaIngestao[] = respostaJogos.dados;

      for (const jogo of jogos) {
        let detalhes: DetalhesPartidaIngestao | null = null;

        if (jogo.status === 'Encerrada' && jogo.event_id) {
          try {
            const respostaDetalhes = await this.runPythonScraper('detalhes', jogo.event_id.toString());
            if (!respostaDetalhes.erro) {
               detalhes = respostaDetalhes;
            } else {
               this.logger.warn(`Erro retornado do Python: ${respostaDetalhes.erro}`);
            }
          } catch {
            this.logger.warn(
              `Detalhes não disponíveis para o jogo ID ${jogo.event_id}`,
            );
          }
        }

        await this.partidasService.sincronizarPartidaCompleta(jogo, detalhes);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      this.logger.log('Sincronização de partidas concluída!');
    } catch (error) {
      this.logger.error('Erro ao sincronizar partidas', error);
    }
  }

  async scrapeElenco(): Promise<void> {
    try {
      this.logger.warn('scrapeElenco via Python ainda não migrado. Precisa do script para Elenco.');
      const equipe = await this.upsertEquipe('Vasco');
    } catch (error) {
      this.logger.error('Erro ao buscar elenco', error);
    }
  }

  // Métodos que apenas logam (não precisam ser async/await)
  scrapeTodasEstatisticas(): void {
    this.logger.log(
      'Sincronização de estatísticas delegada para scrapePartidas.',
    );
  }

  scrapeDetalhesPartidas(): void {
    this.logger.log('Sincronização de detalhes delegada para scrapePartidas.');
  }

  private async upsertEquipe(nome: string) {
    return this.prisma.equipe.upsert({
      where: { nome },
      update: {},
      create: { nome, nomeCurto: nome.substring(0, 3).toUpperCase() },
    });
  }

  async rasparClassificacao(competicaoId: number): Promise<void> {
    try {
      this.logger.log(`Buscando classificação para competicaoId=${competicaoId}`);
      // Torneio 325 (Brasileirão), Temporada 87678 (2026)
      const res = await this.runPythonScraper('classificacao 325 87678');
      if (!res || !res.dados) {
        this.logger.error('Nenhum dado de classificação retornado.');
        return;
      }

      const linhas = res.dados;
      for (const linha of linhas) {
        const equipe = await this.upsertEquipe(linha.equipe_nome);
        await this.prisma.classificacaoEquipe.upsert({
          where: {
            competicaoId_equipeId: {
              competicaoId: competicaoId,
              equipeId: equipe.id,
            },
          },
          update: {
            posicao: linha.posicao,
            pontos: linha.pontos,
            jogos: linha.jogos,
            vitorias: linha.vitorias,
            empates: linha.empates,
            derrotas: linha.derrotas,
            golsPro: linha.gols_pro,
            golsContra: linha.gols_contra,
            saldoGols: linha.saldo_gols,
          },
          create: {
            competicaoId: competicaoId,
            equipeId: equipe.id,
            posicao: linha.posicao,
            pontos: linha.pontos,
            jogos: linha.jogos,
            vitorias: linha.vitorias,
            empates: linha.empates,
            derrotas: linha.derrotas,
            golsPro: linha.gols_pro,
            golsContra: linha.gols_contra,
            saldoGols: linha.saldo_gols,
          },
        });
      }
      this.logger.log('Classificação atualizada com sucesso.');
    } catch (error) {
      this.logger.error('Erro ao raspar classificação', error);
    }
  }
}
