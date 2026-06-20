import {
  Resolver,
  ResolveField,
  Parent,
  Query,
  Args,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { JogadoresService, AtualizarJogadorInput } from './jogadores.service'; 
import { Jogador } from './entities/jogador.entity';
import { AtualizarPerfilFMInput } from './dto/perfil-fm.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Equipe } from '../equipes/entities/equipe.entity';
import { EquipesService } from '../equipes/equipes.service';
import { PrismaService } from '../prisma/prisma.service';
import { EstatisticaJogador } from '../partidas/entities/partida.entity';

@Resolver(() => Jogador)
export class JogadoresResolver {
  constructor(
    private readonly jogadoresService: JogadoresService,
    private readonly equipesService: EquipesService,
    private readonly prisma: PrismaService,
  ) {}

  @ResolveField(() => Equipe, { nullable: true })
  async equipe(@Parent() jogador: Jogador) {
    if (!jogador.equipeId) return null;

    return await this.equipesService.buscarPorId(jogador.equipeId);
  }

  @ResolveField(() => [EstatisticaJogador])
  async estatisticas(
    @Parent() jogador: Jogador,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return await this.prisma.estatisticaJogador.findMany({
      where: { jogadorId: jogador.id },
      take: take || 10,
      orderBy: { partida: { dataHora: 'desc' } },
      include: {
        partida: {
          include: {
            equipeCasa: true,
            equipeVisitante: true,
          },
        },
      },
    });
  }

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

  @Query(() => [Jogador], { name: 'jogadoresPorClube' })
  findPorClube(@Args('clube', { type: () => String }) clube: string) {
    return this.jogadoresService.findPorClube(clube);
  }

  @Query(() => [Equipe], { name: 'equipes' })
  async buscarTodasEquipes() {
    return this.jogadoresService.buscarEquipes();
  }

  @Mutation(() => Boolean)
  async importarMassaFM(
    @Args('nome', { type: () => String }) nome: string,
    @Args('clube', { type: () => String }) clube: string,
    @Args('posicao', { type: () => String }) posicao: string,
    @Args('dadosFM', { type: () => AtualizarPerfilFMInput }) dadosFM: AtualizarPerfilFMInput,
    @Args('alturaCm', { type: () => Int, nullable: true }) alturaCm?: number,
    @Args('dataNascimento', { type: () => String, nullable: true })
    dataNascimento?: string,
    @Args('peDominante', { type: () => String, nullable: true })
    peDominante?: string,
    @Args('fotoUrl', { type: () => String, nullable: true }) fotoUrl?: string,
  ): Promise<boolean> {
    const atributosLimpos = { ...dadosFM };

    delete atributosLimpos.jogadorId;

    await this.jogadoresService.importarJogadorCSV(
      nome,
      clube,
      posicao,
      atributosLimpos,
      alturaCm,
      dataNascimento,
      peDominante,
      fotoUrl,
    );
    return true;
  }

  @Mutation(() => Jogador)
  @UseGuards(GqlAuthGuard)
  async atualizarJogadorAdmin(
    @Args('id', { type: () => Int }) id: number,
    @Args('nomePopular', { type: () => String, nullable: true })
    nomePopular?: string,
    @Args('nomeCompleto', { type: () => String, nullable: true })
    nomeCompleto?: string,
    @Args('numeroCamisa', { type: () => Int, nullable: true })
    numeroCamisa?: number,
    @Args('posicao', { type: () => String, nullable: true }) posicao?: string,
    @Args('posicaoSecundaria', { type: () => String, nullable: true })
    posicaoSecundaria?: string,
    @Args('funcoes', { type: () => String, nullable: true })
    funcoes?: string,
    @Args('peDominante', { type: () => String, nullable: true })
    peDominante?: string,
    @Args('categoria', { type: () => String, nullable: true })
    categoria?: string,
    @Args('emprestado', { type: () => Boolean, nullable: true })
    emprestado?: boolean,
    @Args('tipoContrato', { type: () => String, nullable: true })
    tipoContrato?: string,
    @Args('clubeEmprestimo', { type: () => String, nullable: true })
    clubeEmprestimo?: string,
    @Args('ativo', { type: () => Boolean, nullable: true })
    ativo?: boolean,
    @Args('fotoUrl', { type: () => String, nullable: true }) fotoUrl?: string,
    @Args('equipeId', { type: () => Int, nullable: true })
    equipeId?: number | null,
    @Args('biografia', { type: () => String, nullable: true })
    biografia?: string,
    
    @Args('alturaCm', { type: () => Int, nullable: true }) alturaCm?: number,
    @Args('dataNascimento', { type: () => String, nullable: true })
    dataNascimento?: string,
  ) {
    
    const dadosParaAtualizar: AtualizarJogadorInput = {};

    
    if (nomePopular) dadosParaAtualizar.nomePopular = nomePopular;
    if (nomeCompleto) dadosParaAtualizar.nomeCompleto = nomeCompleto;
    if (posicao) dadosParaAtualizar.posicao = posicao;
    if (categoria) dadosParaAtualizar.categoria = categoria;

    
    if (numeroCamisa !== undefined)
      dadosParaAtualizar.numeroCamisa = numeroCamisa;
    if (posicaoSecundaria !== undefined)
      dadosParaAtualizar.posicaoSecundaria = posicaoSecundaria;
    if (funcoes !== undefined)
      dadosParaAtualizar.funcoes = funcoes;
    if (peDominante !== undefined) dadosParaAtualizar.peDominante = peDominante;
    if (emprestado !== undefined) dadosParaAtualizar.emprestado = emprestado;
    if (tipoContrato !== undefined) dadosParaAtualizar.tipoContrato = tipoContrato;
    if (clubeEmprestimo !== undefined) dadosParaAtualizar.clubeEmprestimo = clubeEmprestimo;
    if (ativo !== undefined) dadosParaAtualizar.ativo = ativo;
    if (fotoUrl !== undefined) dadosParaAtualizar.fotoUrl = fotoUrl;
    if (biografia !== undefined) dadosParaAtualizar.biografia = biografia;
    if (alturaCm !== undefined) dadosParaAtualizar.alturaCm = alturaCm;
    if (dataNascimento !== undefined)
      dadosParaAtualizar.dataNascimento = dataNascimento;

    
    if (equipeId !== undefined) {
      if (equipeId === null) {
        const jogadorAtual = await this.jogadoresService.findOne(id);
        if (jogadorAtual && jogadorAtual.equipeId) {
          dadosParaAtualizar.equipe = { disconnect: true };
        }
      } else {
        dadosParaAtualizar.equipe = { connect: { id: equipeId } };
      }
    }

    return this.jogadoresService.atualizarJogadorAdmin(id, dadosParaAtualizar);
  }
}
