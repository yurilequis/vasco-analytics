import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

// ── CONTRATOS (INTERFACES) ─────────────────────────────

interface PartidaAPI {
  event_id: number;
  campeonato: string;
  data_partida: string | null;
  mandante: string;
  visitante: string;
  gols_mandante: number | null;
  gols_visitante: number | null;
  gols_penaltis_mandante?: number | null;
  gols_penaltis_visitante?: number | null;
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

interface DadosEstatisticasAPI {
  'Ball possession'?: { mandante?: string; visitante?: string };
  'Total shots'?: { mandante?: string; visitante?: string };
  Passes?: { mandante?: string; visitante?: string };
  'Accurate passes'?: { mandante?: string; visitante?: string };
}

interface RespostaEstatisticasAPI {
  dados: DadosEstatisticasAPI;
}

interface EscalacaoAPI {
  sofascore_id: number;
  nome_completo: string;
  nome_popular: string;
  posicao_geral: string;
  posicao_partida: string;
  titular: boolean;
  numero_camisa: number;
  nota: number | null;
  minutos_jogados: number;
  gols: number;
  assistencias: number;
  chutes: number;
  chutes_gol: number;
  passes_tentados: number;
  passes_completos: number;
  dribles_tentados: number;
  dribles_completos: number;
  desarmes: number;
  interceptacoes: number;
  faltas_cometidas: number;
  faltas_sofridas: number;
  posicao_media?: { x: number | null; y: number | null };
  heatmap_url: string;
}

interface IncidenteAPI {
  minuto: number;
  acrescimo: number;
  periodo: string;
  tipo: string;
  descricao: string;
  jogador_principal_id: number | null;
  jogador_secundario_id: number | null;
  is_mandante: boolean;
}

// Interface mantida: usada no método scrapeDetalhesPartidas abaixo
export interface DetalhesPartidaAPI {
  status_api: string;
  event_id: number;
  arbitro: string | null;
  estadio: string | null;
  treinador_mandante: string | null;
  treinador_visitante: string | null;
  linha_do_tempo: IncidenteAPI[];
  escalacoes: {
    mandante: EscalacaoAPI[];
    visitante: EscalacaoAPI[];
  };
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  private readonly API_VASCO_URL = 'http://127.0.0.1:8000/api/v1/vasco';

  constructor(private readonly prisma: PrismaService) {}

  async scrapePartidas(): Promise<void> {
    this.logger.log('Buscando partidas...');
    try {
      const resposta = await axios.get<RespostaPartidasAPI>(
        `${this.API_VASCO_URL}/jogos`,
      );

      for (const jogo of resposta.data.dados) {
        const mandanteNorm = this.normalizarNomeEquipe(jogo.mandante);
        const visitanteNorm = this.normalizarNomeEquipe(jogo.visitante);
        const campNorm = this.normalizarNomeCompeticao(jogo.campeonato);

        const equipeCasa = await this.upsertEquipe(mandanteNorm);
        const equipeVisitante = await this.upsertEquipe(visitanteNorm);
        const competicao = await this.upsertCompeticao(campNorm);
        const dataHora = this.parsarData(jogo.data_partida);
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
    } catch {
      this.logger.error('Erro ao sincronizar partidas');
    }
  }

  async scrapeElenco(): Promise<void> {
    try {
      const resposta = await axios.get<RespostaElencoAPI>(
        `${this.API_VASCO_URL}/elenco`,
      );
      const equipe = await this.upsertEquipe('Vasco');

      for (const jog of resposta.data.dados) {
        const camisa = jog.camisa !== 'S/N' ? parseInt(jog.camisa, 10) : null;
        await this.prisma.db.jogador.upsert({
          where: {
            nomePopular_equipeId: {
              nomePopular: jog.nome,
              equipeId: equipe.id,
            },
          },
          update: { posicao: jog.posicao, numeroCamisa: camisa, ativo: true },
          create: {
            equipeId: equipe.id,
            nomeCompleto: jog.nome,
            nomePopular: jog.nome,
            posicao: jog.posicao,
            numeroCamisa: camisa,
            ativo: true,
          },
        });
      }
    } catch {
      this.logger.error('Erro ao buscar elenco');
    }
  }

  async scrapeTodasEstatisticas(): Promise<void> {
    const partidas = await this.prisma.db.partida.findMany({
      where: { status: 'encerrada' },
    });

    for (const partida of partidas) {
      try {
        const resposta = await axios.get<RespostaEstatisticasAPI>(
          `${this.API_VASCO_URL}/jogos/${partida.id}/estatisticas`,
        );
        const stats = resposta.data.dados;
        await this.salvarEstatisticas(
          partida.id,
          partida.equipeCasaId,
          stats,
          'mandante',
        );
        await this.salvarEstatisticas(
          partida.id,
          partida.equipeVisitanteId,
          stats,
          'visitante',
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch {
        this.logger.warn(`Erro nas estatísticas para o jogo ${partida.id}`);
      }
    }
  }

  // Método que utiliza a interface DetalhesPartidaAPI
  async scrapeDetalhesPartidas(): Promise<void> {
    const partidas = await this.prisma.db.partida.findMany({
      where: { status: 'encerrada' },
    });
    for (const partida of partidas) {
      try {
        // Se o seu eventId estiver vindo da API Python, use-o aqui
        await axios.get<DetalhesPartidaAPI>(
          `${this.API_VASCO_URL}/jogos/${partida.id}/detalhes`,
        );
      } catch {
        this.logger.warn(`Detalhes não disponíveis para jogo ${partida.id}`);
      }
    }
  }

  // ── FUNÇÕES AUXILIARES ─────────────────────────────────
  private async salvarEstatisticas(
    partidaId: number,
    equipeId: number,
    stats: DadosEstatisticasAPI,
    tipo: 'mandante' | 'visitante',
  ): Promise<void> {
    const limpar = (val?: string) =>
      val ? parseFloat(val.replace('%', '')) : 0;
    const getVal = (key: keyof DadosEstatisticasAPI) => stats[key]?.[tipo];

    await this.prisma.db.estatisticaEquipe.upsert({
      where: { partidaId_equipeId: { partidaId, equipeId } },
      update: { posseBola: limpar(getVal('Ball possession')) },
      create: {
        partidaId,
        equipeId,
        posseBola: limpar(getVal('Ball possession')),
      },
    });
  }

  private normalizarNomeEquipe(nome: string): string {
    const dict: Record<string, string> = {
      'Vasco da Gama': 'Vasco',
      'CR Vasco da Gama': 'Vasco',
    };
    return dict[nome] || nome;
  }

  private normalizarNomeCompeticao(nome: string): string {
    if (nome.toLowerCase().includes('carioca')) return 'Campeonato Carioca';
    if (nome.toLowerCase().includes('brasileir'))
      return 'Campeonato Brasileiro';
    return nome;
  }

  private async upsertEquipe(nome: string) {
    return this.prisma.db.equipe.upsert({
      where: { nome },
      update: {},
      create: { nome, nomeCurto: nome },
    });
  }

  private async upsertCompeticao(nome: string) {
    return this.prisma.db.competicao.upsert({
      where: { nome_temporada: { nome, temporada: '2026' } },
      update: {},
      create: { nome, temporada: '2026' },
    });
  }

  private parsarData(dataString: string | null): Date {
    if (!dataString || dataString === 'A definir') return new Date();
    try {
      const [data, hora] = dataString.split(' ');
      const [dia, mes, ano] = data.split('/');
      const [h, m] = (hora || '00:00').split(':');
      return new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(h),
        Number(m),
      );
    } catch {
      return new Date();
    }
  }
}
