import { Module } from '@nestjs/common';
import { EstadiosService } from './estadios.service';
import { EstadiosResolver } from './estadios.resolver';

@Module({
  providers: [EstadiosService, EstadiosResolver],
})
export class EstadiosModule {}
