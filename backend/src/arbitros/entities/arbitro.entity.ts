import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Arbitro {
  @Field(() => Int)
  id!: number;

  @Field()
  nomeCompleto!: string;

  @Field()
  nomePopular!: string;

  @Field({ nullable: true })
  nacionalidade?: string;

  @Field({ nullable: true })
  estado?: string;

  @Field({ nullable: true })
  fotoUrl?: string;

  @Field()
  ativo!: boolean;
}
