import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArbitrosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.arbitro.findMany({
      orderBy: { nomePopular: 'asc' },
    });
  }

  findAtivos() {
    return this.prisma.arbitro.findMany({
      where: { ativo: true },
      orderBy: { nomePopular: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.arbitro.findUnique({
      where: { id },
    });
  }

  async mediaEstatisticas(id: number) {
    const media = await this.prisma.estatisticaArbitro.aggregate({
      where: { arbitroId: id },
      _avg: {
        faltasMarcadas: true,
        cartoesAmarelos: true,
        cartoesVermelhos: true,
        tempoBola: true,
      },
      _count: { id: true },
    });

    return {
      partidasApitadas: media._count.id,
      mediaFaltas: media._avg.faltasMarcadas ?? 0,
      mediaAmarelos: media._avg.cartoesAmarelos ?? 0,
      mediaVermelhos: media._avg.cartoesVermelhos ?? 0,
      mediaBola: media._avg.tempoBola ?? 0,
    };
  }
}
