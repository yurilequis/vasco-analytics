import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AtualizarEscalacaoInput } from './dto/atualizar-escalacao.input';

// ── TIPAGENS PARA A INGESTÃO DE DADOS ──
export interface PartidaIngestao {
  event_id: number;
  campeonato: string;
  data_partida: string | null;
  mandante: string;
  visitante: string;
  gols_mandante: number | null;
  gols_visitante: number | null;
  status: string;
  rodada?: string | null;
}

export interface EscalacaoIngestao {
  sofascore_id: number;
  nome_popular: string;
  nome_completo: string;
  posicao_geral: string;
  numero_camisa: number;
  titular: boolean;
  minutos_jogados: number;
  nota: number | null;
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

export interface DetalhesPartidaIngestao {
  estadio?: string | null;
  arbitro?: string | null;
  escalacoes?: {
    mandante: EscalacaoIngestao[];
    visitante: EscalacaoIngestao[];
  };
  linha_do_tempo?: {
    is_mandante: boolean;
    minuto: number;
    acrescimo: number;
    tipo: string;
    descricao: string;
    jogador_principal_id: number | null; // ID do Sofascore de quem fez o evento
    jogador_secundario_id: number | null; // Assistência ou quem saiu
  }[];
  estatisticas_equipes?: {
    mandante: Record<string, any>;
    visitante: Record<string, any>;
  };
}

@Injectable()
export class PartidasService {
  private readonly logger = new Logger(PartidasService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly ALIAS_EQUIPES: Record<string, string> = {
    'athletico': 'athletico paranaense',
    'athletico-pr': 'athletico paranaense',
    'atletico mineiro': 'atletico-mg',
    'atletico-pr': 'athletico paranaense',
    'operario': 'operario-pr',
    'operario ferroviario': 'operario-pr',
    'paysandu sc': 'paysandu',
    'sport recife': 'sport',
    'vasco da gama': 'vasco',
  };

  private normalizarNomeTime(nome: string): string {
    let n = nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(
        /^(sc|fc|se|cr|clube|esporte|sociedade|associacao|gr|gremio)\s+/g,
        '',
      )
      .replace(/\s+(sc|fc|mg|rj|sp|rs|pr|ba|pa|sc)$/g, '')
      .replace(/-/g, ' ') // replace dashes with spaces to normalize "atletico-mg" to "atletico mg"
      .replace(/\s+/g, ' ')
      .trim();
    
    // Reverse lookup or direct lookup from ALIAS
    // First, check if the original name or basic normalized name matches an alias
    const basicNorm = n;
    if (this.ALIAS_EQUIPES[basicNorm]) {
       n = this.ALIAS_EQUIPES[basicNorm].replace(/-/g, ' ');
    }
    
    return n.trim();
  }

  private compararNomesInteligente(
    nomeSofascore: string,
    jogadorBanco: { nomePopular: string; nomeCompleto: string },
  ): boolean {
    const limpar = (n: string) =>
      n
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const sName = limpar(nomeSofascore);
    const bPop = limpar(jogadorBanco.nomePopular);
    const bFull = limpar(jogadorBanco.nomeCompleto);

    // Hardcoded Aliases (Traduções Específicas Sofascore -> Banco de Dados)
    if ((sName === 'j. silva' || sName === 'joao vitor silva') && bPop === 'mutano') {
      return true;
    }

    // 1. Match Exato ou Contém
    if (sName === bPop || sName === bFull || bFull.includes(sName)) {
      return true;
    }

    // 2. Lógica de Abreviação (ex: "L. Freitas" vs "Lucas Freitas")
    if (sName.includes('.')) {
      const partesSofa = sName.split(/\s+/);
      if (partesSofa.length >= 2) {
        const sobrenomeSofa = partesSofa[partesSofa.length - 1];
        const inicialSofa = partesSofa[0].replace('.', '');

        // Tenta match com nome popular
        const partesPop = bPop.split(/\s+/);
        const sobrenomePop = partesPop[partesPop.length - 1];
        const inicialPop = partesPop[0][0];

        if (sobrenomeSofa === sobrenomePop && inicialSofa === inicialPop) {
          return true;
        }

        // Tenta match com nome completo
        const partesFull = bFull.split(/\s+/);
        const sobrenomeFull = partesFull[partesFull.length - 1];
        const inicialFull = partesFull[0][0];

        if (sobrenomeSofa === sobrenomeFull && inicialSofa === inicialFull) {
          return true;
        }
      }
    }

    // 3. Match de sobrenome único se for muito específico
    if (
      !sName.includes(' ') &&
      (bPop.startsWith(sName) || bFull.startsWith(sName))
    ) {
      return true;
    }

    return false;
  }

  async findAll() {
    return await this.prisma.partida.findMany({
      orderBy: { dataHora: 'desc' },
      include: {
        competicao: {
          include: {
            classificacao: {
              include: { equipe: true },
              orderBy: { posicao: 'asc' },
            },
          },
        },
        equipeCasa: true,
        equipeVisitante: true,
        estadio: true,
        arbitro: true,
        treinadorCasa: true,
        treinadorVisitante: true,
        estatisticasEquipes: true,
        eventos: {
          orderBy: { minuto: 'asc' },
        },
        estatisticasJogadores: {
          include: { jogador: true },
        },
      },
    });
  }

  findByEquipe(equipeId: number) {
    return this.prisma.partida.findMany({
      where: {
        OR: [{ equipeCasaId: equipeId }, { equipeVisitanteId: equipeId }],
      },
      orderBy: { dataHora: 'desc' },
      include: {
        equipeCasa: true,
        equipeVisitante: true,
        estadio: true,
        arbitro: true,
        competicao: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.partida.findUnique({
      where: { id },
      include: {
        competicao: {
          include: {
            classificacao: {
              include: { equipe: true },
              orderBy: { posicao: 'asc' },
            },
          },
        },
        equipeCasa: true,
        equipeVisitante: true,
        estadio: true,
        arbitro: true,
        treinadorCasa: true,
        treinadorVisitante: true,
        estatisticasEquipes: true,
        eventos: { include: { jogador: true } },
        estatisticasJogadores: { include: { jogador: true } },
      },
    });
  }

  // --- O MOTOR DE INGESTÃO COM CRUZAMENTO DE DADOS ---

  async sincronizarPartidaCompleta(
    jogoBasico: PartidaIngestao,
    detalhes: DetalhesPartidaIngestao | null,
  ) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      this.logger.log(
        `Sincronizando partida: ${jogoBasico.mandante} x ${jogoBasico.visitante}`,
      );

      const competicao = await tx.competicao.upsert({
        where: {
          nome_temporada: { nome: jogoBasico.campeonato, temporada: '2026' },
        },
        update: {},
        create: { nome: jogoBasico.campeonato, temporada: '2026' },
      });

      // 🔥 LÓGICA DE UPSERT INTELIGENTE PARA EQUIPES
      const buscarOuCriarEquipe = async (nomeOriginal: string) => {
        const nomeNorm = this.normalizarNomeTime(nomeOriginal);
        const todasEquipes = await tx.equipe.findMany();
        const existe = todasEquipes.find(
          (e) => this.normalizarNomeTime(e.nome) === nomeNorm,
        );

        if (existe) return existe;

        return tx.equipe.create({
          data: {
            nome: nomeOriginal,
            nomeCurto: nomeOriginal.substring(0, 3).toUpperCase(),
          },
        });
      };

      const equipeCasa = await buscarOuCriarEquipe(jogoBasico.mandante);
      const equipeVisitante = await buscarOuCriarEquipe(jogoBasico.visitante);

      let estadioId = null;
      if (detalhes?.estadio) {
        const nomeEstadio = detalhes.estadio;
        // 1. Pergunta se existe
        let estadio = await tx.estadio.findFirst({
          where: { nome: nomeEstadio },
        });
        // 2. Se não existir, cria com segurança
        if (!estadio) {
          estadio = await tx.estadio.create({
            data: { nome: nomeEstadio, cidade: 'Desconhecida' },
          });
        }
        estadioId = estadio.id;
      }

      let arbitroId = null;
      if (detalhes?.arbitro) {
        const nomeArbitro = detalhes.arbitro;
        // 1. Pergunta se existe
        let arbitro = await tx.arbitro.findFirst({
          where: { nomePopular: nomeArbitro },
        });
        // 2. Se não existir, cria com segurança
        if (!arbitro) {
          arbitro = await tx.arbitro.create({
            data: { nomeCompleto: nomeArbitro, nomePopular: nomeArbitro },
          });
        }
        arbitroId = arbitro.id;
      }

      const dataHoraObj = this.parsarData(jogoBasico.data_partida);

      const partida = await tx.partida.upsert({
        where: {
          equipeCasaId_equipeVisitanteId_dataHora: {
            equipeCasaId: equipeCasa.id,
            equipeVisitanteId: equipeVisitante.id,
            dataHora: dataHoraObj,
          },
        },
        update: {
          golsCasa: jogoBasico.gols_mandante,
          golsVisitante: jogoBasico.gols_visitante,
          status: jogoBasico.status === 'Encerrada' ? 'encerrada' : 'agendada',
          estadioId: estadioId,
          arbitroId: arbitroId,
        },
        create: {
          competicaoId: competicao.id,
          equipeCasaId: equipeCasa.id,
          equipeVisitanteId: equipeVisitante.id,
          dataHora: dataHoraObj,
          golsCasa: jogoBasico.gols_mandante,
          golsVisitante: jogoBasico.gols_visitante,
          status: jogoBasico.status === 'Encerrada' ? 'encerrada' : 'agendada',
          eventId: jogoBasico.event_id,
          estadioId: estadioId,
          arbitroId: arbitroId,
        },
      });

      // Dicionário em memória: Sofascore ID -> Nosso Banco ID
      const mapaSofascoreDb = new Map<number, number>();

      if (detalhes?.escalacoes) {
        await this.processarElenco(
          tx,
          partida.id,
          equipeCasa.id,
          detalhes.escalacoes.mandante,
          mapaSofascoreDb,
          detalhes.linha_do_tempo,
        );
        await this.processarElenco(
          tx,
          partida.id,
          equipeVisitante.id,
          detalhes.escalacoes.visitante,
          mapaSofascoreDb,
          detalhes.linha_do_tempo,
        );
      }

      if (detalhes?.linha_do_tempo) {
        await tx.eventoPartida.deleteMany({ where: { partidaId: partida.id } });

        for (const ev of detalhes.linha_do_tempo) {
          const equipeEventoId = ev.is_mandante
            ? equipeCasa.id
            : equipeVisitante.id;

          // Agora os gols e cartões estarão linkados aos jogadores no banco!
          const jogadorIdDb = ev.jogador_principal_id
            ? mapaSofascoreDb.get(ev.jogador_principal_id) || null
            : null;
          const jogadorSecIdDb = ev.jogador_secundario_id
            ? mapaSofascoreDb.get(ev.jogador_secundario_id) || null
            : null;

          await tx.eventoPartida.create({
            data: {
              partidaId: partida.id,
              equipeId: equipeEventoId,
              minuto: ev.minuto,
              minutoAcrescimo: ev.acrescimo || 0,
              tipoEvento: ev.tipo,
              descricao: ev.descricao,
              jogadorId: jogadorIdDb,
              jogadorSecundarioId: jogadorSecIdDb,
            },
          });
        }
      }

      // 🔥 LÓGICA DE ESTATÍSTICAS DE EQUIPE
      if (detalhes?.estatisticas_equipes) {
        const { mandante, visitante } = detalhes.estatisticas_equipes;

        const processarStats = async (stats: Record<string, any>, equipeId: number) => {
          const parseStat = (val: any) => {
            if (typeof val === 'string' && val.includes('%')) {
              return parseFloat(val.replace('%', ''));
            }
            return parseInt(val) || 0;
          };

          await tx.estatisticaEquipe.upsert({
            where: { partidaId_equipeId: { partidaId: partida.id, equipeId } },
            update: {
              posseBola: parseStat(stats['Ball possession']),
              xG: parseFloat(stats['Expected goals']) || 0,
              grandesChances: parseStat(stats['Big chances']) || (parseStat(stats['Big chances scored']) + parseStat(stats['Big chances missed'])),
              chutes: parseStat(stats['Total shots']),
              chutesGol: parseStat(stats['Shots on target']),
              chutesFora: parseStat(stats['Shots off target']),
              chutesNaTrave: parseStat(stats['Hit woodwork']),
              defesasGoleiro: parseStat(stats['Goalkeeper saves']),
              escanteios: parseStat(stats['Corner kicks']),
              faltas: parseStat(stats['Fouls']),
              impedimentos: parseStat(stats['Offsides']),
              passesTentados: parseStat(stats['Total passes'] || stats['Passes']),
              passesCompletos: parseStat(stats['Accurate passes']),
              cartoesAmarelos: parseStat(stats['Yellow cards']),
              cartoesVermelhos: parseStat(stats['Red cards']),
            },
            create: {
              partidaId: partida.id,
              equipeId,
              posseBola: parseStat(stats['Ball possession']),
              xG: parseFloat(stats['Expected goals']) || 0,
              grandesChances: parseStat(stats['Big chances']) || (parseStat(stats['Big chances scored']) + parseStat(stats['Big chances missed'])),
              chutes: parseStat(stats['Total shots']),
              chutesGol: parseStat(stats['Shots on target']),
              chutesFora: parseStat(stats['Shots off target']),
              chutesNaTrave: parseStat(stats['Hit woodwork']),
              defesasGoleiro: parseStat(stats['Goalkeeper saves']),
              escanteios: parseStat(stats['Corner kicks']),
              faltas: parseStat(stats['Fouls']),
              impedimentos: parseStat(stats['Offsides']),
              passesTentados: parseStat(stats['Total passes'] || stats['Passes']),
              passesCompletos: parseStat(stats['Accurate passes']),
              cartoesAmarelos: parseStat(stats['Yellow cards']),
              cartoesVermelhos: parseStat(stats['Red cards']),
            },
          });
        };

        await processarStats(mandante, equipeCasa.id);
        await processarStats(visitante, equipeVisitante.id);
      }

      return partida;
    });
  }

  private async processarElenco(
    tx: Prisma.TransactionClient,
    partidaId: number,
    equipeId: number,
    escalacao: EscalacaoIngestao[],
    mapaSofascoreDb: Map<number, number>,
    linha_do_tempo?: DetalhesPartidaIngestao['linha_do_tempo'],
  ) {
    if (!escalacao || escalacao.length === 0) return;

    // 🔥 BUSCA JOGADORES NA EQUIPE ATUAL E TODOS PARA FALLBACK
    const jogadoresExistentes = await tx.jogador.findMany({
      where: { equipeId: equipeId },
    });
    
    const todosJogadores = await tx.jogador.findMany();

    for (const j of escalacao) {
      let jogadorLocal = jogadoresExistentes.find((dbPlayer) =>
        this.compararNomesInteligente(j.nome_popular, {
          nomePopular: dbPlayer.nomePopular,
          nomeCompleto: dbPlayer.nomeCompleto,
        }),
      );

      // Fallback forte: se não achar no time atual, busca em todos os times apenas se o nome COMPLETO for exato.
      // Isso evita duplicar jogadores que estão emprestados (ex: G. Estrella jogando por outro time)
      if (!jogadorLocal && j.nome_completo) {
         jogadorLocal = todosJogadores.find(dbPlayer => 
            dbPlayer.nomeCompleto.toLowerCase().trim() === j.nome_completo.toLowerCase().trim()
         );
         if (jogadorLocal) {
            this.logger.log(`Encontrado jogador de outra equipe via nome completo exato: ${j.nome_completo}. Reutilizando ID ${jogadorLocal.id}`);
         }
      }

      let jogadorIdFinal: number;

      if (!jogadorLocal) {
        this.logger.log(
          `Jogador ${j.nome_popular} não encontrado no banco. Ignorando criação (Equipe ID: ${equipeId}).`,
        );
        continue;
      } else {
        this.logger.log(
          `✅ Match Inteligente: ${j.nome_popular} -> ${jogadorLocal.nomePopular}`,
        );
        mapaSofascoreDb.set(j.sofascore_id, jogadorLocal.id);
        jogadorIdFinal = jogadorLocal.id;
      }

      const golsNaTimeline =
        linha_do_tempo?.filter(
          (ev) =>
            ev.tipo === 'GOAL' && ev.jogador_principal_id === j.sofascore_id,
        ).length || 0;

      const assistsNaTimeline =
        linha_do_tempo?.filter(
          (ev) =>
            ev.tipo === 'GOAL' && ev.jogador_secundario_id === j.sofascore_id,
        ).length || 0;

      const cartoesAmarelosTimeline =
        linha_do_tempo?.filter(
          (ev) =>
            ev.tipo === 'CARD' &&
            ev.jogador_principal_id === j.sofascore_id &&
            !(
              ev.descricao?.toUpperCase().includes('RED') ||
              ev.descricao?.toUpperCase().includes('VERMELHO')
            ),
        ).length || 0;

      const cartoesVermelhosTimeline =
        linha_do_tempo?.filter(
          (ev) =>
            ev.tipo === 'CARD' &&
            ev.jogador_principal_id === j.sofascore_id &&
            (ev.descricao?.toUpperCase().includes('RED') ||
              ev.descricao?.toUpperCase().includes('VERMELHO')),
        ).length || 0;

      const golsFinais = Math.max(j.gols || 0, golsNaTimeline);
      const assistsFinais = Math.max(j.assistencias || 0, assistsNaTimeline);

      await tx.estatisticaJogador.upsert({
        where: {
          partidaId_jogadorId: { partidaId, jogadorId: jogadorIdFinal },
        },
        update: {
          titular: j.titular,
          minutosJogados: j.minutos_jogados,
          notaDesempenho: j.nota,
          gols: golsFinais,
          assistencias: assistsFinais,
          cartoesAmarelos: cartoesAmarelosTimeline,
          cartoesVermelhos: cartoesVermelhosTimeline,
          chutes: j.chutes,
          chutesGol: j.chutes_gol,
          passesTentados: j.passes_tentados,
          passesCompletos: j.passes_completos,
          driblesTentados: j.dribles_tentados,
          driblesCompletos: j.dribles_completos,
          desarmes: j.desarmes,
          interceptacoes: j.interceptacoes,
          faltasCometidas: j.faltas_cometidas,
          faltasSofridas: j.faltas_sofridas,
          posicaoMediaX: j.posicao_media?.x || null,
          posicaoMediaY: j.posicao_media?.y || null,
          heatmapUrl: j.heatmap_url,
          // posicaoPartida is NOT reset on resync — only admin edits should change it
        },
        create: {
          partidaId: partidaId,
          jogadorId: jogadorIdFinal,
          equipeId: equipeId,
          titular: j.titular,
          minutosJogados: j.minutos_jogados,
          notaDesempenho: j.nota,
          gols: golsFinais,
          assistencias: assistsFinais,
          cartoesAmarelos: cartoesAmarelosTimeline,
          cartoesVermelhos: cartoesVermelhosTimeline,
          chutes: j.chutes,
          chutesGol: j.chutes_gol,
          passesTentados: j.passes_tentados,
          passesCompletos: j.passes_completos,
          driblesTentados: j.dribles_tentados,
          driblesCompletos: j.dribles_completos,
          desarmes: j.desarmes,
          interceptacoes: j.interceptacoes,
          faltasCometidas: j.faltas_cometidas,
          faltasSofridas: j.faltas_sofridas,
          posicaoMediaX: j.posicao_media?.x || null,
          posicaoMediaY: j.posicao_media?.y || null,
          heatmapUrl: j.heatmap_url,
          posicaoPartida: null, // will be set by admin when editing lineup
        },
      });
    }
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

  async atualizarEscalacao(input: AtualizarEscalacaoInput): Promise<void> {
    const { partidaId, formacaoCasa, formacaoVisitante, jogadores } = input;
    
    const updates: any[] = jogadores
      .filter((j) => j.estatisticaId > 0)
      .map((j) =>
        this.prisma.estatisticaJogador.update({
        where: { id: j.estatisticaId },
        data: {
          titular: j.titular,
          posicaoPartida: j.posicaoPartida || null,
          numeroCamisa: j.numeroCamisa || null,
        },
      }),
    );

    const partida = await this.prisma.partida.findUnique({ where: { id: partidaId } });

    if (partida) {
      if (formacaoCasa !== undefined) {
        updates.push(this.prisma.estatisticaEquipe.upsert({
          where: { partidaId_equipeId: { partidaId, equipeId: partida.equipeCasaId } },
          update: { formacao: formacaoCasa },
          create: {
            partidaId,
            equipeId: partida.equipeCasaId,
            formacao: formacaoCasa
          }
        }));
      }
      if (formacaoVisitante !== undefined) {
        updates.push(this.prisma.estatisticaEquipe.upsert({
          where: { partidaId_equipeId: { partidaId, equipeId: partida.equipeVisitanteId } },
          update: { formacao: formacaoVisitante },
          create: {
            partidaId,
            equipeId: partida.equipeVisitanteId,
            formacao: formacaoVisitante
          }
        }));
      }
    }

    await this.prisma.$transaction(updates);
  }
}

