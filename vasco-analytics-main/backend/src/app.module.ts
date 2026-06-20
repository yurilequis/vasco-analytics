import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Request } from 'express';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AppResolver } from './app.resolver';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ScrapingModule } from './scraping/scraping.module';
import { EstadiosModule } from './estadios/estadios.module';
import { ArbitrosModule } from './arbitros/arbitros.module';
import { PartidasModule } from './partidas/partidas.module';
import { AuthModule } from './auth/auth.module';
import { EquipesModule } from './equipes/equipes.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }: { req: Request }) => ({ req }),
      sortSchema: true,
      playground: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UploadModule,
    JogadoresModule,
    ScrapingModule,
    EstadiosModule,
    ArbitrosModule,
    PartidasModule,
    AuthModule,
    EquipesModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
