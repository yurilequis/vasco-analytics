import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PerfilFM } from './perfil-fm.entity';
import { EstatisticaJogador } from '../../partidas/entities/partida.entity';

@ObjectType()
export class Jogador {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  equipeId!: number;

  @Field()
  nomeCompleto!: string;

  @Field()
  nomePopular!: string;

  @Field({ nullable: true })
  nomeOriginal?: string;

  @Field({ nullable: true })
  dataNascimento?: Date;

  @Field({ nullable: true })
  nacionalidade?: string;

  @Field()
  categoria!: string;

  @Field({ nullable: true })
  posicao?: string;

  @Field({ nullable: true })
  posicaoSecundaria?: string;

  @Field({ nullable: true })
  funcoes?: string;

  @Field(() => Int, { nullable: true })
  numeroCamisa?: number;

  @Field({ nullable: true })
  peDominante?: string;

  @Field(() => Int, { nullable: true })
  alturaCm?: number;

  @Field(() => Float, { nullable: true })
  pesoKg?: number;

  @Field({ nullable: true })
  fotoUrl?: string;

  @Field()
  emprestado!: boolean;

  @Field()
  tipoContrato!: string;

  @Field({ nullable: true })
  clubeEmprestimo?: string;

  @Field()
  ativo!: boolean;

  @Field()
  criadoEm!: Date;

  @Field()
  atualizadoEm!: Date;

  @Field(() => PerfilFM, { nullable: true })
  perfilFM?: PerfilFM;

  @Field({ nullable: true })
  biografia?: string;

  @Field(() => [EstatisticaJogador], { nullable: true })
  estatisticas?: EstatisticaJogador[];
}
