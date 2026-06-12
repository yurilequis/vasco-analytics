import { Module } from '@nestjs/common';
import { JogadoresService } from './jogadores.service';
import { JogadoresResolver } from './jogadores.resolver';
import { UploadController } from './jogadores.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EquipesModule } from '../equipes/equipes.module';

@Module({
  imports: [EquipesModule],
  providers: [JogadoresService, JogadoresResolver, PrismaService],
  controllers: [UploadController],
  exports: [JogadoresService],
})
export class JogadoresModule {}
