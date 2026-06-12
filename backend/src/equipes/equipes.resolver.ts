import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EquipesService, AtualizarEquipeDados } from './equipes.service'; // Importamos a tipagem estrita
import { Equipe } from './entities/equipe.entity';

@Resolver(() => Equipe)
export class EquipesResolver {
  constructor(private readonly equipesService: EquipesService) {}

  @Query(() => [Equipe], { name: 'equipes' })
  async obterEquipes() {
    return this.equipesService.listarTodas();
  }

  @Query(() => Equipe, { name: 'equipe', nullable: true })
  async obterEquipePorId(@Args('id', { type: () => Int }) id: number) {
    return this.equipesService.buscarPorId(id);
  }

  @Mutation(() => Equipe, { name: 'atualizarEquipe' })
  async atualizarEquipe(
    @Args('id', { type: () => Int }) id: number,
    @Args('nome', { nullable: true }) nome?: string,
    @Args('nomeCurto', { nullable: true }) nomeCurto?: string,
    @Args('sigla', { nullable: true }) sigla?: string,
    @Args('cidade', { nullable: true }) cidade?: string,
    @Args('estado', { nullable: true }) estado?: string,
    @Args('pais', { nullable: true }) pais?: string,
    @Args('fundacao', { nullable: true }) fundacao?: string,
    @Args('escudoUrl', { nullable: true }) escudoUrl?: string,
  ) {
    // Construímos o objeto respeitando rigorosamente a interface AtualizarEquipeDados
    const dadosAtualizados: AtualizarEquipeDados = {
      nome,
      nomeCurto,
      sigla,
      cidade,
      estado,
      pais,
      fundacao,
      escudoUrl,
    };

    // O Prisma automaticamente ignora os campos que estiverem como 'undefined' neste objeto
    return this.equipesService.atualizarEquipe(id, dadosAtualizados);
  }

  @Mutation(() => Int, { name: 'sincronizarEscudosLocais' })
  async sincronizarEscudosLocais() {
    return this.equipesService.sincronizarEscudosLocais();
  }
}
