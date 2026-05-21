import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { EstadiosService } from './estadios.service';
import { Estadio } from './entities/estadio.entity';

@Resolver(() => Estadio)
export class EstadiosResolver {
  constructor(private readonly estadiosService: EstadiosService) {}

  @Query(() => [Estadio], { name: 'estadios' })
  findAll() {
    return this.estadiosService.findAll();
  }

  @Query(() => Estadio, { name: 'estadio', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.estadiosService.findOne(id);
  }
}
