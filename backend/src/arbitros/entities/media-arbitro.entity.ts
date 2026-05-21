import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class MediaArbitro {
  @Field(() => Int)
  partidasApitadas!: number;

  @Field(() => Float)
  mediaFaltas!: number;

  @Field(() => Float)
  mediaAmarelos!: number;

  @Field(() => Float)
  mediaVermelhos!: number;

  @Field(() => Float)
  mediaBola!: number;
}
