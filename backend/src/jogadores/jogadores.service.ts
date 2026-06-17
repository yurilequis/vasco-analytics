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


export interface AtualizarJogadorInput {
  nomeCompleto?: string; 
  numeroCamisa?: number | null;
  alturaCm?: number | null;
  posicao?: string; 
  posicaoSecundaria?: string | null;
  funcoes?: string | null;
  peDominante?: string | null;
  categoria?: string;
  emprestado?: boolean;
  tipoContrato?: string;
  clubeEmprestimo?: string | null;
  ativo?: boolean;
  nomePopular?: string; 
  fotoUrl?: string | null;
  biografia?: string | null;
  equipe?: { connect?: { id: number }; disconnect?: boolean };
  dataNascimento?: string | Date | null;
}


function normalizarPosicaoFM(posicaoBruta: string): string {
  if (!posicaoBruta) return 'Desconhecida';
  const pos = posicaoBruta.toUpperCase().trim();

  
  if (pos.includes('GR') || pos === 'GOLEIRO') return 'Goleiro';
  if (pos.includes('D (C)') || pos.includes('DC') || pos === 'ZAGUEIRO')
    return 'Zagueiro';

  
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

  
  
  if (pos.includes('MDC') || pos === 'MD' || pos === 'VOLANTE')
    return 'Volante';
  if (pos.includes('M (C)') || pos.includes('MC') || pos === 'MEIA CENTRAL')
    return 'Meia Central';

  
  
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

  
  if (pos.includes('ED') || pos === 'PONTA DIREITA') return 'Ponta Direita';
  if (pos.includes('EE') || pos === 'PONTA ESQUERDA') return 'Ponta Esquerda';
  if (pos.includes('PL') || pos.includes('A (C)') || pos === 'CENTROAVANTE')
    return 'Centroavante';

  return posicaoBruta; 
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
          ativo: true,
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
          ativo: true,
          nomeCompleto: nome,
          nomePopular: nome,
          nomeOriginal: nome,
          posicao: posicaoNormalizada,
          equipeId: equipe.id,
          alturaCm,
          peDominante,
          dataNascimento: dataNascObj,
          fotoUrl, 
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
    
    const { dataNascimento, ...restoDosDados } = dados;

    
    let dataNascimentoProcessada: Date | null | undefined = undefined;

    if (dataNascimento === null || dataNascimento === '') {
      dataNascimentoProcessada = null;
    } else if (dataNascimento !== undefined) {
      const dataConvertida = new Date(dataNascimento);

      
      if (!isNaN(dataConvertida.getTime())) {
        dataNascimentoProcessada = dataConvertida;
      } else {
        dataNascimentoProcessada = null; 
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
