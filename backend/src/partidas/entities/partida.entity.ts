import { ObjectType, Field, Int } from '@nestjs/graphql';

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
}
