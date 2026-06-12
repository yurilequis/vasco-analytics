import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidasResolver } from './partidas.resolver';

@Module({
  providers: [PartidasService, PartidasResolver],
  exports: [PartidasService],
})
export class PartidasModule {}
