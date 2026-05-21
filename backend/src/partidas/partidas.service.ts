import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartidasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.db.partida.findMany({
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
