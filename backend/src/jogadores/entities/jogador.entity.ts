import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Jogador {
  @Field(() => Int)
  id!: number;

  @Field()
  nomeCompleto!: string;

  @Field()
  nomePopular!: string;

  @Field({ nullable: true })
  nacionalidade?: string;

  @Field({ nullable: true })
  posicao?: string;

  @Field({ nullable: true })
  posicaoSecundaria?: string;

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
  ativo!: boolean;
}
