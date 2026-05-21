import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { PartidasService } from './partidas.service';
import { Partida } from './entities/partida.entity';

@Resolver(() => Partida)
export class PartidasResolver {
  constructor(private readonly partidasService: PartidasService) {}

  @Query(() => [Partida], { name: 'partidas' })
  findAll() {
    return this.partidasService.findAll();
  }

  @Query(() => Partida, { name: 'partida', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.partidasService.findOne(id);
  }

  @Query(() => [Partida], { name: 'partidasPorEquipe' })
  findByEquipe(@Args('equipeId', { type: () => Int }) equipeId: number) {
    return this.partidasService.findByEquipe(equipeId);
  }
}
