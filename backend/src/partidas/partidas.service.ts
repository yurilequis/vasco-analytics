import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartidasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    // 1. Adicionado o await
    // 2. Adicionado o .db caso o seu Prisma esteja configurado assim (se der erro, remova o .db)
    return await this.prisma.db.partida.findMany({
      orderBy: { dataHora: 'desc' },
      include: {
        competicao: true,
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
          include: {
            jogador: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.db.partida.findUnique({
      where: { id },
      include: {
        equipeCasa: true,
        equipeVisitante: true,
        estadio: true,
        arbitro: true,
        competicao: true,
        eventos: true,
        estatisticasEquipes: true,
        estatisticasJogadores: {
          include: { jogador: true },
        },
      },
    });
  }

  findByEquipe(equipeId: number) {
    return this.prisma.db.partida.findMany({
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
}
