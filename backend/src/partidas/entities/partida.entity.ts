import { ObjectType, Field, Int } from '@nestjs/graphql';

// ── Entidades Auxiliares (Simplificadas para não precisarmos de outros arquivos) ──

@ObjectType()
export class CompeticaoSimples {
  @Field(() => String)
  nome!: string;
}

@ObjectType()
export class EquipeSimples {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;
}

@ObjectType()
export class EstadioSimples {
  @Field(() => String)
  nome!: string;
}

@ObjectType()
export class ArbitroSimples {
  @Field(() => String)
  nomePopular!: string;
}

@ObjectType()
export class TreinadorSimples {
  @Field(() => String)
  nome!: string;
}

@ObjectType()
export class JogadorSimples {
  @Field(() => String)
  nomePopular!: string;

  @Field(() => String, { nullable: true })
  posicao?: string;
}

// 👇 ATUALIZADO: Agora suporta quem fez o gol e para qual time
@ObjectType()
export class EventoPartida {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  minuto!: number;

  @Field(() => Int)
  minutoAcrescimo!: number;

  @Field(() => String)
  tipoEvento!: string;

  @Field(() => String, { nullable: true })
  descricao?: string;

  @Field(() => Int)
  equipeId!: number;

  @Field(() => JogadorSimples, { nullable: true })
  jogador?: JogadorSimples;
}

@ObjectType()
export class EstatisticaJogador {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  equipeId!: number;

  @Field(() => Boolean)
  titular!: boolean;

  @Field(() => String, { nullable: true })
  posicaoPartida?: string;

  @Field(() => Int, { nullable: true })
  numeroCamisa?: number;

  @Field(() => Number, { nullable: true })
  notaDesempenho?: number;

  @Field(() => Int)
  minutosJogados!: number;

  @Field(() => Int)
  gols!: number;

  @Field(() => Int)
  assistencias!: number;

  @Field(() => Int)
  passesCompletos!: number;

  @Field(() => Int)
  desarmes!: number;

  @Field(() => Number, { nullable: true })
  posicaoMediaX?: number;

  @Field(() => Number, { nullable: true })
  posicaoMediaY?: number;

  @Field(() => String, { nullable: true })
  heatmapUrl?: string;

  @Field(() => JogadorSimples)
  jogador!: JogadorSimples;
}

@ObjectType()
export class EstatisticaEquipe {
  @Field(() => Int)
  equipeId!: number;

  @Field(() => Number, { nullable: true })
  posseBola?: number;

  @Field(() => Int, { nullable: true })
  chutes?: number;

  @Field(() => Int, { nullable: true })
  passesCompletos?: number;
}

// ── Entidade Principal ──

@ObjectType()
export class Partida {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  dataHora!: string;

  @Field(() => String)
  status!: string;

  @Field(() => Int, { nullable: true })
  golsCasa?: number;

  @Field(() => Int, { nullable: true })
  golsVisitante?: number;

  @Field(() => Int, { nullable: true })
  golsPenaltisCasa?: number;

  @Field(() => Int, { nullable: true })
  golsPenaltisVisitante?: number;

  @Field(() => CompeticaoSimples)
  competicao!: CompeticaoSimples;

  @Field(() => EquipeSimples)
  equipeCasa!: EquipeSimples;

  @Field(() => EquipeSimples)
  equipeVisitante!: EquipeSimples;

  @Field(() => EstadioSimples, { nullable: true })
  estadio?: EstadioSimples;

  @Field(() => ArbitroSimples, { nullable: true })
  arbitro?: ArbitroSimples;

  @Field(() => TreinadorSimples, { nullable: true })
  treinadorCasa?: TreinadorSimples;

  @Field(() => TreinadorSimples, { nullable: true })
  treinadorVisitante?: TreinadorSimples;

  @Field(() => [EstatisticaEquipe], { nullable: true })
  estatisticasEquipes?: EstatisticaEquipe[];

  @Field(() => [EventoPartida], { nullable: true })
  eventos?: EventoPartida[];

  @Field(() => [EstatisticaJogador], { nullable: true })
  estatisticasJogadores?: EstatisticaJogador[];
}
