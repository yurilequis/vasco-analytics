import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JogadoresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.db.jogador.findMany({
      orderBy: { nomePopular: 'asc' },
    });
  }

  findAtivos() {
    return this.prisma.db.jogador.findMany({
      where: { ativo: true },
      orderBy: { nomePopular: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.db.jogador.findUnique({
      where: { id },
    });
  }
}
