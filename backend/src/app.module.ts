import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AppResolver } from './app.resolver';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ScrapingModule } from './scraping/scraping.module';
import { EstadiosModule } from './estadios/estadios.module';
import { ArbitrosModule } from './arbitros/arbitros.module';
import { PartidasModule } from './partidas/partidas.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    JogadoresModule,
    ScrapingModule,
    EstadiosModule,
    ArbitrosModule,
    PartidasModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
