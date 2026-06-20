import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AtualizarEscalacaoJogadorInput {
  @Field(() => Int)
  estatisticaId!: number;

  @Field(() => Boolean)
  titular!: boolean;

  @Field(() => String, { nullable: true })
  posicaoPartida?: string;

  @Field(() => Int, { nullable: true })
  numeroCamisa?: number;
}

@InputType()
export class AtualizarEscalacaoInput {
  @Field(() => Int)
  partidaId!: number;

  @Field(() => String, { nullable: true })
  formacaoCasa?: string;

  @Field(() => String, { nullable: true })
  formacaoVisitante?: string;

  @Field(() => [AtualizarEscalacaoJogadorInput])
  jogadores!: AtualizarEscalacaoJogadorInput[];
}
