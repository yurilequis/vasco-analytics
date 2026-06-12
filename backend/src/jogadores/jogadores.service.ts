import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AtributosJogadorFM {
  cabeceamento?: number;
  chutesLonge?: number;
  cobrancaFalta?: number;
  cruzamento?: number;
  desarme?: number;
  drible?: number;
  escanteios?: number;
  finalizacao?: number;
  laterais?: number;
  marcacao?: number;
  passe?: number;
  penaltis?: number;
  primeiroToque?: number;
  tecnica?: number;
  agressividade?: number;
  antecipacao?: number;
  bravura?: number;
  compostura?: number;
  concentracao?: number;
  decisoes?: number;
  determinacao?: number;
  imprevisibilidade?: number;
  indiceTrabalho?: number;
  lideranca?: number;
  posicionamento?: number;
  semBola?: number;
  trabalhoEquipe?: number;
  visaoJogo?: number;
  aceleracao?: number;
  agilidade?: number;
  aptidaoNatural?: number;
  equilibrio?: number;
  forca?: number;
  impulsao?: number;
  resistencia?: number;
  velocidade?: number;
  alcanceAereo?: number;
  comandoArea?: number;
  comunicacao?: number;
  excentricidade?: number;
  jogoMaos?: number;
  lancamentos?: number;
  reflexos?: number;
  reposicao?: number;
  saidaGol?: number;
  socos?: number;
  umContraUm?: number;
}

// Interface estrita para blindar as atualizações e eliminar o 'any'
export interface AtualizarJogadorInput {
  nomeCompleto?: string; // <-- Removido o | null
  numeroCamisa?: number | null;
  alturaCm?: number | null;
  posicao?: string; // <-- Removido o | null
  posicaoSecundaria?: string | null;
  funcoes?: string | null;
  peDominante?: string | null;
  categoria?: string;
  emprestado?: boolean;
  tipoContrato?: string;
  clubeEmprestimo?: string | null;
  ativo?: boolean;
  nomePopular?: string; // <-- Removido o | null
  fotoUrl?: string | null;
  biografia?: string | null;
  equipe?: { connect?: { id: number }; disconnect?: boolean };
  dataNascimento?: string | Date | null;
}

// Motor de higienização de posições do Football Manager
function normalizarPosicaoFM(posicaoBruta: string): string {
  if (!posicaoBruta) return 'Desconhecida';
  const pos = posicaoBruta.toUpperCase().trim();

  // 1. Goleiros e Zagueiros
  if (pos.includes('GR') || pos === 'GOLEIRO') return 'Goleiro';
  if (pos.includes('D (C)') || pos.includes('DC') || pos === 'ZAGUEIRO')
    return 'Zagueiro';

  // 2. Laterais (Com os "monstrinhos" de versatilidade incluídos)
  if (
    pos.includes('D (D)') ||
    pos.includes('DA (D)') ||
    pos.includes('D/DA (D)') ||
    pos.includes('D (DE)') ||
    pos === 'DD' ||
    pos === 'LATERAL DIREITO'
  )
    return 'Lateral Direito';

  if (
    pos.includes('D (E)') ||
    pos.includes('DA (E)') ||
    pos.includes('D/DA (E)') ||
    pos.includes('D/DA/M (E)') ||
    pos.includes('D/DA/M/MO (E)') ||
    pos === 'DE' ||
    pos === 'LATERAL ESQUERDO'
  )
    return 'Lateral Esquerdo';

  // 3. Volantes e Meias Centrais
  // ✅ O "MD" isolado garante que o Volante seja detectado corretamente sem conflitar com alas.
  if (pos.includes('MDC') || pos === 'MD' || pos === 'VOLANTE')
    return 'Volante';
  if (pos.includes('M (C)') || pos.includes('MC') || pos === 'MEIA CENTRAL')
    return 'Meia Central';

  // 4. Meias Ofensivos e Extremos
  // ⚠️ A ordem dos IFs é vital aqui. As siglas compostas (MO) devem vir antes das simples.
  if (
    pos.includes('MO (DEC)') ||
    pos.includes('MO (DE)') ||
    pos.includes('MO (C)') ||
    pos === 'MEIA ATACANTE'
  )
    return 'Meia Atacante';

  if (pos.includes('MO (E)') || pos === 'MEIA ESQUERDA') return 'Meia Esquerda';
  if (
    pos.includes('MO (D)') ||
    pos.includes('M/MO (D)') ||
    pos === 'MEIA DIREITA'
  )
    return 'Meia Direita';

  // 5. Pontas e Atacantes
  if (pos.includes('ED') || pos === 'PONTA DIREITA') return 'Ponta Direita';
  if (pos.includes('EE') || pos === 'PONTA ESQUERDA') return 'Ponta Esquerda';
  if (pos.includes('PL') || pos.includes('A (C)') || pos === 'CENTROAVANTE')
    return 'Centroavante';

  return posicaoBruta; // Fallback: se o FM inventar uma sigla nova, ela passa reta para você ver no painel e nos avisar
}

@Injectable()
export class JogadoresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.jogador.findMany({
      orderBy: { nomePopular: 'asc' },
    });
  }

  findAtivos() {
    return this.prisma.jogador.findMany({
      where: { ativo: true },
      orderBy: { nomePopular: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.jogador.findUnique({
      where: { id },
      include: {
        perfilFM: true,
      },
    });
  }

  findPorClube(nomeClube: string) {
    // Separamos o return do método findMany e removemos o .db
    return this.prisma.jogador.findMany({
      where: {
        ativo: true,
        equipe: {
          nome: {
            contains: nomeClube,
          },
        },
      },
      orderBy: { nomePopular: 'asc' },
    });
  }

  async importarJogadorCSV(
    nome: string,
    clube: string,
    posicao: string,
    atributosFM: AtributosJogadorFM,
    alturaCm?: number,
    dataNascimento?: string,
    peDominante?: string,
    fotoUrl?: string,
  ) {
    const posicaoNormalizada = normalizarPosicaoFM(posicao);

    const equipe = await this.prisma.equipe.upsert({
      where: { nome: clube },
      update: {},
      create: {
        nome: clube,
        nomeCurto: clube.substring(0, 3).toUpperCase(),
      },
    });

    const jogadorExistente = await this.prisma.jogador.findFirst({
      where: {
        equipeId: equipe.id,
        OR: [{ nomeOriginal: nome }, { nomePopular: nome }],
      },
    });

    let dataNascObj: Date | null = null;
    if (dataNascimento) {
      const [dia, mes, ano] = dataNascimento.split('/');
      if (dia && mes && ano) {
        dataNascObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
      }
    }

    let jogador;

    if (jogadorExistente) {
      jogador = await this.prisma.jogador.update({
        where: { id: jogadorExistente.id },
        data: {
          posicao: posicaoNormalizada,
          nomeOriginal: nome,
          alturaCm,
          peDominante,
          dataNascimento: dataNascObj,
          fotoUrl,
        },
      });
    } else {
      jogador = await this.prisma.jogador.create({
        data: {
          nomeCompleto: nome,
          nomePopular: nome,
          nomeOriginal: nome,
          posicao: posicaoNormalizada,
          equipeId: equipe.id,
          alturaCm,
          peDominante,
          dataNascimento: dataNascObj,
          fotoUrl, // <-- ADICIONADO: Agora a foto também salva em jogadores novos
        },
      });
    }

    if (atributosFM && Object.keys(atributosFM).length > 0) {
      await this.prisma.perfilFM.upsert({
        where: {
          jogadorId: jogador.id,
        },
        update: atributosFM,
        create: {
          ...atributosFM,
          jogadorId: jogador.id,
        },
      });
    }

    return jogador;
  }

  async atualizarJogadorAdmin(id: number, dados: AtualizarJogadorInput) {
    // Separa a data de nascimento do resto dos dados
    const { dataNascimento, ...restoDosDados } = dados;

    // Motor de conversão estrito e à prova de falhas
    let dataNascimentoProcessada: Date | null | undefined = undefined;

    if (dataNascimento === null || dataNascimento === '') {
      dataNascimentoProcessada = null;
    } else if (dataNascimento !== undefined) {
      const dataConvertida = new Date(dataNascimento);

      // Verifica matematicamente se a data gerada é válida
      if (!isNaN(dataConvertida.getTime())) {
        dataNascimentoProcessada = dataConvertida;
      } else {
        dataNascimentoProcessada = null; // Protege o Prisma de "Invalid Date"
      }
    }

    return this.prisma.jogador.update({
      where: { id },
      data: {
        ...restoDosDados,
        ...(dataNascimentoProcessada !== undefined && {
          dataNascimento: dataNascimentoProcessada,
        }),
      },
    });
  }

  async buscarEquipes() {
    return this.prisma.equipe.findMany({
      orderBy: { nome: 'asc' },
    });
  }
}
