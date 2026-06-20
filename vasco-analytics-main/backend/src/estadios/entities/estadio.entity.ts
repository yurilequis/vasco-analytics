import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Estadio {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;

  @Field({ nullable: true })
  nomePopular?: string;

  @Field()
  cidade!: string;

  @Field({ nullable: true })
  estado?: string;

  @Field()
  pais!: string;

  @Field(() => Int, { nullable: true })
  capacidade?: number;

  @Field({ nullable: true })
  proprietario?: string;

  @Field({ nullable: true })
  grama?: string;

  @Field({ nullable: true })
  fotoUrl?: string;
}
