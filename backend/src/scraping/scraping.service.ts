import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

interface JogadorExtraido {
  nomePopular: string;
  nomeCompleto: string;
  posicao: string;
  numeroCamisa: number | null;
  nacionalidade: string | null;
  equipeId: number;
  ativo: boolean;
}

interface PartidaExtraida {
  dataHora: Date;
  equipeCasaNome: string;
  equipeVisitanteNome: string;
  golsCasa: number | null;
  golsVisitante: number | null;
  competicaoNome: string;
  status: string;
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  private readonly EQUIPE_ID = 1;
  private readonly VASCO_NOME = 'Vasco';
  private readonly URL_ELENCO =
    'https://www.transfermarkt.com.br/cr-vasco-da-gama/kader/verein/978/saison_id/2025';
  private readonly URL_RESULTADOS =
    'https://www.flashscore.com.br/equipe/vasco/2RABlYFn/resultados/';

  constructor(private readonly prisma: PrismaService) {}

  // ── Scraping do elenco (Transfermarkt) ────────────────
  async scrapeElenco(): Promise<void> {
    this.logger.log('Iniciando scraping do elenco do Vasco...');

    const { data } = await axios.get<string>(this.URL_ELENCO, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    const jogadores: JogadorExtraido[] = [];

    $('table.items tbody tr.odd, table.items tbody tr.even').each((_, row) => {
      const numeroCamisaText = $(row)
        .find('td.zentriert')
        .first()
        .text()
        .trim();
      const nomePopular = $(row).find('td.hauptlink a').first().text().trim();
      const posicaoText = $(row).find('td.hauptlink').next('td').text().trim();
      const nacionalidade =
        $(row).find('img.flagge').first().attr('title') ?? null;

      if (!nomePopular) return;

      const numeroCamisa = numeroCamisaText
        ? parseInt(numeroCamisaText, 10)
        : null;

      jogadores.push({
        nomePopular,
        nomeCompleto: nomePopular,
        posicao: this.normalizarPosicao(posicaoText),
        numeroCamisa: isNaN(numeroCamisa!) ? null : numeroCamisa,
        nacionalidade,
        equipeId: this.EQUIPE_ID,
        ativo: true,
      });
    });

    this.logger.log(`${jogadores.length} jogadores encontrados. Salvando...`);

    for (const jogador of jogadores) {
      await this.prisma.db.jogador.upsert({
        where: {
          nomePopular_equipeId: {
            nomePopular: jogador.nomePopular,
            equipeId: jogador.equipeId,
          },
        },
        update: {
          posicao: jogador.posicao,
          numeroCamisa: jogador.numeroCamisa,
          nacionalidade: jogador.nacionalidade,
          ativo: true,
        },
        create: jogador,
      });
    }

    this.logger.log('Elenco atualizado com sucesso!');
  }

  // ── Scraping de partidas (Flashscore + Puppeteer) ─────
  async scrapePartidas(): Promise<void> {
    this.logger.log('Iniciando scraping de partidas via Puppeteer...');

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--dns-prefetch-disable',
      ],
      executablePath: undefined, // usa o Chromium embutido
    });

    try {
      const page = await browser.newPage();

      // Simula um navegador real
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );

      await page.goto(this.URL_RESULTADOS, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Aguarda os resultados carregarem
      await page.waitForSelector('.event__match', { timeout: 15000 });

      const html = await page.content();
      const $ = cheerio.load(html);
      const partidas: PartidaExtraida[] = [];

      // Cada partida no Flashscore tem a classe event__match
      $('.event__match').each((_, el) => {
        const dataTexto = $(el)
          .prevAll('.event__header')
          .first()
          .find('.event__time')
          .text()
          .trim();

        const competicaoNome =
          $(el)
            .prevAll('.event__header')
            .first()
            .find('.event__title')
            .text()
            .trim() || 'Desconhecida';

        const timeCasa = $(el).find('.event__participant--home').text().trim();

        const timeVisitante = $(el)
          .find('.event__participant--away')
          .text()
          .trim();

        const placarCasaText = $(el).find('.event__score--home').text().trim();

        const placarVisitanteText = $(el)
          .find('.event__score--away')
          .text()
          .trim();

        if (!timeCasa || !timeVisitante) return;

        const golsCasa = placarCasaText ? parseInt(placarCasaText, 10) : null;
        const golsVisitante = placarVisitanteText
          ? parseInt(placarVisitanteText, 10)
          : null;

        partidas.push({
          dataHora: this.parsarData(dataTexto),
          equipeCasaNome: timeCasa,
          equipeVisitanteNome: timeVisitante,
          golsCasa: isNaN(golsCasa!) ? null : golsCasa,
          golsVisitante: isNaN(golsVisitante!) ? null : golsVisitante,
          competicaoNome,
          status: golsCasa !== null ? 'encerrada' : 'agendada',
        });
      });

      this.logger.log(`${partidas.length} partidas encontradas. Salvando...`);
      await this.salvarPartidas(partidas);
      this.logger.log('Partidas atualizadas com sucesso!');
    } finally {
      await browser.close();
    }
  }

  // ── Salvar partidas no banco ───────────────────────────
  private async salvarPartidas(partidas: PartidaExtraida[]): Promise<void> {
    for (const p of partidas) {
      // Garantir que a competição existe
      const competicao = await this.prisma.db.competicao.upsert({
        where: {
          nome_temporada: { nome: p.competicaoNome, temporada: '2025' },
        },
        update: {},
        create: { nome: p.competicaoNome, temporada: '2025' },
      });

      // Garantir que os times existem
      const equipeCasa = await this.upsertEquipe(p.equipeCasaNome);
      const equipeVisitante = await this.upsertEquipe(p.equipeVisitanteNome);

      // Salvar partida (sem duplicar)
      await this.prisma.db.partida.upsert({
        where: {
          equipeCasaId_equipeVisitanteId_dataHora: {
            equipeCasaId: equipeCasa.id,
            equipeVisitanteId: equipeVisitante.id,
            dataHora: p.dataHora,
          },
        },
        update: {
          golsCasa: p.golsCasa,
          golsVisitante: p.golsVisitante,
          status: p.status,
        },
        create: {
          competicaoId: competicao.id,
          equipeCasaId: equipeCasa.id,
          equipeVisitanteId: equipeVisitante.id,
          dataHora: p.dataHora,
          golsCasa: p.golsCasa,
          golsVisitante: p.golsVisitante,
          status: p.status,
        },
      });
    }
  }

  private async upsertEquipe(nome: string) {
    return this.prisma.db.equipe.upsert({
      where: { nome },
      update: {},
      create: {
        nome,
        nomeCurto: nome,
      },
    });
  }

  private parsarData(texto: string): Date {
    // Flashscore usa formato "DD.MM. HH:MM" ou "DD.MM.YYYY"
    try {
      const agora = new Date();
      const partes = texto.split(' ');
      const [dia, mes] = partes[0].replace('.', '').split('.');
      const [hora, minuto] = (partes[1] ?? '00:00').split(':');
      return new Date(
        agora.getFullYear(),
        parseInt(mes, 10) - 1,
        parseInt(dia, 10),
        parseInt(hora, 10),
        parseInt(minuto, 10),
      );
    } catch {
      return new Date();
    }
  }

  private normalizarPosicao(posicao: string): string {
    const mapa: Record<string, string> = {
      Goleiro: 'goleiro',
      Zagueiro: 'zagueiro',
      'Lateral Dir.': 'lateral',
      'Lateral Esq.': 'lateral',
      Volante: 'volante',
      'Meia Central': 'meia',
      'Meia Ofensivo': 'meia',
      Meia: 'meia',
      'Ponta Dir.': 'atacante',
      'Ponta Esq.': 'atacante',
      Centroavante: 'atacante',
      Atacante: 'atacante',
    };
    return mapa[posicao] ?? posicao.toLowerCase();
  }
}
