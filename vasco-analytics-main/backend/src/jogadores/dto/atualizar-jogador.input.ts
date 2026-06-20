import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AtualizarJogadorInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  nomePopular?: string;

  @Field({ nullable: true })
  posicao?: string;

  @Field({ nullable: true })
  posicaoSecundaria?: string;

  @Field({ nullable: true })
  peDominante?: string;

  @Field(() => Int, { nullable: true })
  numeroCamisa?: number;

  @Field({ nullable: true })
  categoria?: string;

  @Field({ nullable: true })
  fotoUrl?: string;

  @Field(() => Int, { nullable: true })
  equipeId?: number; 
}
