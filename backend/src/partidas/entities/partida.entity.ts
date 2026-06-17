import { ObjectType, Field, Int, Float } from '@nestjs/graphql';



@ObjectType()
export class EquipeSimples {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field({ nullable: true })
  escudoUrl?: string;
}

@ObjectType()
export class ClassificacaoEquipe {
  @Field(() => Int)
  posicao!: number;

  @Field(() => Int)
  pontos!: number;

  @Field(() => Int)
  jogos!: number;

  @Field(() => Int)
  vitorias!: number;

  @Field(() => Int)
  empates!: number;

  @Field(() => Int)
  derrotas!: number;

  @Field(() => Int)
  golsPro!: number;

  @Field(() => Int)
  golsContra!: number;

  @Field(() => Int)
  saldoGols!: number;

  @Field(() => EquipeSimples)
  equipe!: EquipeSimples;
}

@ObjectType()
export class CompeticaoSimples {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field(() => [ClassificacaoEquipe], { nullable: true })
  classificacao?: ClassificacaoEquipe[];
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
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nomePopular!: string;

  @Field(() => String, { nullable: true })
  posicao?: string;

  @Field(() => String, { nullable: true })
  posicaoSecundaria?: string;

  @Field(() => String, { nullable: true })
  funcoes?: string;

  @Field(() => String, { nullable: true })
  fotoUrl?: string;

  @Field(() => String, { nullable: true })
  peDominante?: string;

  @Field(() => Int, { nullable: true })
  numeroCamisa?: number;
}



@ObjectType()
export class Partida {
  @Field(() => Int)
  id!: number;

  
  @Field(() => Date)
  dataHora!: Date;

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

  
  @Field(() => Float, { nullable: true })
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

  
  @Field(() => Float, { nullable: true })
  posicaoMediaX?: number;

  @Field(() => Float, { nullable: true })
  posicaoMediaY?: number;

  @Field(() => String, { nullable: true })
  heatmapUrl?: string;

  @Field(() => Int)
  cartoesAmarelos!: number;

  @Field(() => Int)
  cartoesVermelhos!: number;

  @Field(() => JogadorSimples)
  jogador!: JogadorSimples;

  @Field(() => Partida, { nullable: true })
  partida?: Partida;
}

@ObjectType()
export class EstatisticaEquipe {
  @Field(() => Int)
  equipeId!: number;

  
  @Field(() => Float, { nullable: true })
  posseBola?: number;

  @Field(() => Float, { nullable: true })
  xG?: number;

  @Field(() => Int, { nullable: true })
  grandesChances?: number;

  @Field(() => Int, { nullable: true })
  chutes?: number;

  @Field(() => Int, { nullable: true })
  chutesGol?: number;

  @Field(() => Int, { nullable: true })
  chutesFora?: number;

  @Field(() => Int, { nullable: true })
  chutesNaTrave?: number;

  @Field(() => Int, { nullable: true })
  defesasGoleiro?: number;

  @Field(() => Int, { nullable: true })
  escanteios?: number;

  @Field(() => Int, { nullable: true })
  faltas?: number;

  @Field(() => Int, { nullable: true })
  impedimentos?: number;

  @Field(() => Int, { nullable: true })
  passesTentados?: number;

  @Field(() => Int, { nullable: true })
  passesCompletos?: number;

  @Field(() => Int, { nullable: true })
  cartoesAmarelos?: number;

  @Field(() => Int, { nullable: true })
  cartoesVermelhos?: number;

  @Field(() => String, { nullable: true })
  formacao?: string;
}
