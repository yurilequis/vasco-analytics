import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PerfilFM {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  jogadorId?: number;

  // 1. ATRIBUTOS TÉCNICOS
  @Field(() => Int, { nullable: true })
  cabeceamento?: number;

  @Field(() => Int, { nullable: true })
  chutesLonge?: number;

  @Field(() => Int, { nullable: true })
  cobrancaFalta?: number;

  @Field(() => Int, { nullable: true })
  cruzamento?: number;

  @Field(() => Int, { nullable: true })
  desarme?: number;

  @Field(() => Int, { nullable: true })
  drible?: number;

  @Field(() => Int, { nullable: true })
  escanteios?: number;

  @Field(() => Int, { nullable: true })
  finalizacao?: number;

  @Field(() => Int, { nullable: true })
  laterais?: number;

  @Field(() => Int, { nullable: true })
  marcacao?: number;

  @Field(() => Int, { nullable: true })
  passe?: number;

  @Field(() => Int, { nullable: true })
  penaltis?: number;

  @Field(() => Int, { nullable: true })
  primeiroToque?: number;

  @Field(() => Int, { nullable: true })
  tecnica?: number;

  // 2. ATRIBUTOS MENTAIS
  @Field(() => Int, { nullable: true })
  agressividade?: number;

  @Field(() => Int, { nullable: true })
  antecipacao?: number;

  @Field(() => Int, { nullable: true })
  bravura?: number;

  @Field(() => Int, { nullable: true })
  compostura?: number;

  @Field(() => Int, { nullable: true })
  concentracao?: number;

  @Field(() => Int, { nullable: true })
  decisoes?: number;

  @Field(() => Int, { nullable: true })
  determinacao?: number;

  @Field(() => Int, { nullable: true })
  imprevisibilidade?: number;

  @Field(() => Int, { nullable: true })
  indiceTrabalho?: number;

  @Field(() => Int, { nullable: true })
  lideranca?: number;

  @Field(() => Int, { nullable: true })
  posicionamento?: number;

  @Field(() => Int, { nullable: true })
  semBola?: number;

  @Field(() => Int, { nullable: true })
  trabalhoEquipe?: number;

  @Field(() => Int, { nullable: true })
  visaoJogo?: number;

  // 3. ATRIBUTOS FÍSICOS
  @Field(() => Int, { nullable: true })
  aceleracao?: number;

  @Field(() => Int, { nullable: true })
  agilidade?: number;

  @Field(() => Int, { nullable: true })
  aptidaoNatural?: number;

  @Field(() => Int, { nullable: true })
  equilibrio?: number;

  @Field(() => Int, { nullable: true })
  forca?: number;

  @Field(() => Int, { nullable: true })
  impulsao?: number;

  @Field(() => Int, { nullable: true })
  resistencia?: number;

  @Field(() => Int, { nullable: true })
  velocidade?: number;

  // 4. ATRIBUTOS DE GOLEIRO
  @Field(() => Int, { nullable: true })
  alcanceAereo?: number;

  @Field(() => Int, { nullable: true })
  comandoArea?: number;

  @Field(() => Int, { nullable: true })
  comunicacao?: number;

  @Field(() => Int, { nullable: true })
  excentricidade?: number;

  @Field(() => Int, { nullable: true })
  jogoMaos?: number;

  @Field(() => Int, { nullable: true })
  lancamentos?: number;

  @Field(() => Int, { nullable: true })
  reflexos?: number;

  @Field(() => Int, { nullable: true })
  reposicao?: number;

  @Field(() => Int, { nullable: true })
  saidaGol?: number;

  @Field(() => Int, { nullable: true })
  socos?: number;

  @Field(() => Int, { nullable: true })
  umContraUm?: number;

  @Field(() => Date, { nullable: true })
  atualizadoEm?: Date;
}
