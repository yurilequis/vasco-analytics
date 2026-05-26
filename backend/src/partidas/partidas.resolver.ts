import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { Partida } from './entities/partida.entity';
import { PartidasService } from './partidas.service';
import { PrismaService } from '../prisma/prisma.service'; // Verifique se este caminho está correto no seu projeto

@Resolver(() => Partida)
export class PartidasResolver {
  constructor(
    private readonly partidasService: PartidasService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Partida], { name: 'partidas' })
  findAll() {
    return this.partidasService.findAll();
  }

  // O decorador deve ficar logo acima da função
  @ResolveField('estatisticasEquipes', () => [Object], { nullable: true })
  async estatisticasEquipes(@Parent() partida: Partida) {
    const { id } = partida;
    return this.prisma.db.estatisticaEquipe.findMany({
      where: { partidaId: id },
    });
  }
}
