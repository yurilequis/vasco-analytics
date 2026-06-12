import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Equipe {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;

  @Field()
  nomeCurto?: string;

  @Field({ nullable: true })
  sigla?: string;

  @Field({ nullable: true })
  cidade?: string;

  @Field({ nullable: true })
  estado?: string;

  @Field({ nullable: true })
  pais?: string;

  @Field({ nullable: true })
  fundacao?: Date;

  @Field({ nullable: true })
  escudoUrl?: string;

  @Field()
  criadoEm!: Date;
}
