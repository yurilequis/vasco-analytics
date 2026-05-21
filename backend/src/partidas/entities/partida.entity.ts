import { ObjectType, Field, Int } from '@nestjs/graphql';

// 1. Ensinamos o GraphQL o que é uma Equipa
@ObjectType()
export class EquipeSimples {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;
}

// 2. Ensinamos o GraphQL o que é uma Competição
@ObjectType()
export class CompeticaoSimples {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;
}

// 3. Atualizamos a Partida para incluir os novos dados
@ObjectType()
export class Partida {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  competicaoId!: number;

  @Field(() => Int)
  equipeCasaId!: number;

  @Field(() => Int)
  equipeVisitanteId!: number;

  @Field(() => Int, { nullable: true })
  estadioId?: number;

  @Field(() => Int, { nullable: true })
  arbitroId?: number;

  @Field()
  dataHora!: Date;

  @Field(() => Int, { nullable: true })
  rodada?: number;

  @Field({ nullable: true })
  fase?: string;

  @Field(() => Int, { nullable: true })
  golsCasa?: number;

  @Field(() => Int, { nullable: true })
  golsVisitante?: number;

  @Field()
  status!: string;

  @Field(() => Int, { nullable: true })
  publico?: number;

  // 👇 RELACIONAMENTOS ADICIONADOS AQUI 👇
  @Field(() => EquipeSimples)
  equipeCasa!: EquipeSimples;

  @Field(() => EquipeSimples)
  equipeVisitante!: EquipeSimples;

  @Field(() => CompeticaoSimples)
  competicao!: CompeticaoSimples;
}
