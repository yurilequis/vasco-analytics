import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstadiosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.db.estadio.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.db.estadio.findUnique({
      where: { id },
    });
  }
}
