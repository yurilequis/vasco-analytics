import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './entities/jogador.entity';

@Resolver(() => Jogador)
export class JogadoresResolver {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Query(() => [Jogador], { name: 'jogadores' })
  findAll() {
    return this.jogadoresService.findAll();
  }

  @Query(() => [Jogador], { name: 'jogadoresAtivos' })
  findAtivos() {
    return this.jogadoresService.findAtivos();
  }

  @Query(() => Jogador, { name: 'jogador', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.jogadoresService.findOne(id);
  }
}
