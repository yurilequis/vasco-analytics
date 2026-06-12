import {
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Parent,
  Int,
  Args,
} from '@nestjs/graphql';
import { Partida } from './entities/partida.entity';
import { PartidasService } from './partidas.service';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarEscalacaoInput } from './dto/atualizar-escalacao.input';

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
    return this.prisma.estatisticaEquipe.findMany({
      where: { partidaId: id },
    });
  }
  @Query(() => Partida, { name: 'partida', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.partidasService.findOne(id);
  }

  @Mutation(() => Boolean)
  async atualizarEscalacaoPartida(
    @Args('input', { type: () => AtualizarEscalacaoInput }) input: AtualizarEscalacaoInput,
  ): Promise<boolean> {
    await this.partidasService.atualizarEscalacao(input);
    return true;
  }
}
