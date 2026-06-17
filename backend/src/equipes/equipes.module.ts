import { Module } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { EquipesResolver } from './equipes.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [EquipesService, EquipesResolver, PrismaService],
  exports: [EquipesService], 
})
export class EquipesModule {}
