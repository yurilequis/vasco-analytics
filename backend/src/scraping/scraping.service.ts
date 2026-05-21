import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

// ── CONTRATOS (INTERFACES) ─────────────────────────────

interface PartidaAPI {
  campeonato: string;
  mandante: string;
  visitante: string;
  gols_mandante: number | null;
  gols_visitante: number | null;
  status: string;
  data_partida: string | null;
  rodada: string | null;
}

interface RespostaPartidasAPI {
  status_api: string;
  meta: any;
  dados: PartidaAPI[];
}

interface JogadorAPI {
  atleta_id: string;
  nome: string;
  posicao: string;
  camisa: string;
  idade: number | null;
}

interface RespostaElencoAPI {
  status_api: string;
  meta: any;
  dados: JogadorAPI[];
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  // Endereço onde a api-vasco-analytics (Python) está rodando
  private readonly API_VASCO_URL = 'http://127.0.0.1:8000/api/v1/vasco';

  constructor(private readonly prisma: PrismaService) {}

  // ── 1. Sincronizar Partidas ───────────────────────────
  async scrapePartidas(): Promise<void> {
    this.logger.log('Buscando partidas da api-vasco-analytics...');

    try {
      const resposta = await axios.get<RespostaPartidasAPI>(
        `${this.API_VASCO_URL}/jogos`,
      );
      const partidas = resposta.data.dados;

      for (const jogo of partidas) {
        const equipeCasa = await this.upsertEquipe(jogo.mandante);
        const equipeVisitante = await this.upsertEquipe(jogo.visitante);
        const competicao = await this.upsertCompeticao(jogo.campeonato);

        const dataHora = this.parsarData(jogo.data_partida);

        // Como o banco de dados está esperando apenas uma string simples,
        // passamos as palavras exatas em minúsculo.
        const statusMapeado =
          jogo.status === 'Encerrado' ? 'encerrada' : 'agendada';

        await this.prisma.db.partida.upsert({
          where: {
            equipeCasaId_equipeVisitanteId_dataHora: {
              equipeCasaId: equipeCasa.id,
              equipeVisitanteId: equipeVisitante.id,
              dataHora: dataHora,
            },
          },
          update: {
            golsCasa: jogo.gols_mandante,
            golsVisitante: jogo.gols_visitante,
            status: statusMapeado,
          },
          create: {
            competicaoId: competicao.id,
            equipeCasaId: equipeCasa.id,
            equipeVisitanteId: equipeVisitante.id,
            dataHora: dataHora,
            golsCasa: jogo.gols_mandante,
            golsVisitante: jogo.gols_visitante,
            status: statusMapeado,
            rodada: jogo.rodada ? parseInt(jogo.rodada, 10) : null,
          },
        });
      }
      this.logger.log(
        '✅ Partidas sincronizadas com sucesso no banco de dados!',
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `❌ Erro de conexão com a api-vasco-analytics: ${error.message}`,
        );
      } else if (error instanceof Error) {
        this.logger.error(`❌ Erro interno: ${error.message}`);
      } else {
        this.logger.error(
          '❌ Ocorreu um erro desconhecido ao tentar sincronizar as partidas.',
        );
      }
    }
  }

  // ── 2. Sincronizar Elenco ──────────────────────────────
  async scrapeElenco(): Promise<void> {
    this.logger.log('Buscando elenco da api-vasco-analytics...');

    try {
      const resposta = await axios.get<RespostaElencoAPI>(
        `${this.API_VASCO_URL}/elenco`,
      );
      const jogadores = resposta.data.dados;

      // Garante que o Vasco existe no banco para vincular a chave estrangeira (equipeId)
      const equipe = await this.upsertEquipe('Vasco');

      for (const jog of jogadores) {
        const numeroCamisa =
          jog.camisa !== 'S/N' ? parseInt(jog.camisa, 10) : null;

        await this.prisma.db.jogador.upsert({
          where: {
            nomePopular_equipeId: {
              nomePopular: jog.nome,
              equipeId: equipe.id,
            },
          },
          update: {
            posicao: jog.posicao,
            numeroCamisa: Number.isNaN(numeroCamisa) ? null : numeroCamisa,
            ativo: true,
          },
          create: {
            equipeId: equipe.id,
            nomeCompleto: jog.nome,
            nomePopular: jog.nome,
            posicao: jog.posicao,
            numeroCamisa: Number.isNaN(numeroCamisa) ? null : numeroCamisa,
            ativo: true,
          },
        });
      }
      this.logger.log('✅ Elenco sincronizado com sucesso no banco de dados!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `❌ Erro de conexão ao buscar elenco: ${error.message}`,
        );
      } else if (error instanceof Error) {
        this.logger.error(`❌ Erro interno: ${error.message}`);
      } else {
        this.logger.error(
          '❌ Ocorreu um erro desconhecido ao tentar sincronizar o elenco.',
        );
      }
    }
  }

  // ── 3. Funções Auxiliares (Ajudantes) ─────────────────

  private async upsertEquipe(nome: string) {
    return this.prisma.db.equipe.upsert({
      where: { nome: nome },
      update: {},
      create: { nome: nome, nomeCurto: nome },
    });
  }

  private async upsertCompeticao(nome: string) {
    return this.prisma.db.competicao.upsert({
      where: { nome_temporada: { nome: nome, temporada: '2026' } },
      update: {},
      create: { nome: nome, temporada: '2026' },
    });
  }

  private parsarData(dataString: string | null): Date {
    if (
      !dataString ||
      dataString === 'A definir' ||
      dataString === 'Data Desconhecida'
    ) {
      return new Date();
    }
    try {
      const [data, hora] = dataString.split(' ');
      const [dia, mes, ano] = data.split('/');
      const [horas, minutos] = (hora || '00:00').split(':');
      return new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(horas),
        Number(minutos),
      );
    } catch {
      return new Date();
    }
  }
}
