import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ArbitrosService } from './arbitros.service';
import { Arbitro } from './entities/arbitro.entity';
import { MediaArbitro } from './entities/media-arbitro.entity';

@Resolver(() => Arbitro)
export class ArbitrosResolver {
  constructor(private readonly arbitrosService: ArbitrosService) {}

  @Query(() => [Arbitro], { name: 'arbitros' })
  findAll() {
    return this.arbitrosService.findAll();
  }

  @Query(() => [Arbitro], { name: 'arbitrosAtivos' })
  findAtivos() {
    return this.arbitrosService.findAtivos();
  }

  @Query(() => Arbitro, { name: 'arbitro', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.arbitrosService.findOne(id);
  }

  @Query(() => MediaArbitro, { name: 'mediaArbitro', nullable: true })
  mediaEstatisticas(@Args('id', { type: () => Int }) id: number) {
    return this.arbitrosService.mediaEstatisticas(id);
  }
}
