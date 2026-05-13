import { Module } from '@nestjs/common';
import { ArbitrosService } from './arbitros.service';
import { ArbitrosResolver } from './arbitros.resolver';

@Module({
  providers: [ArbitrosService, ArbitrosResolver],
})
export class ArbitrosModule {}
