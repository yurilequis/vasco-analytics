import { Module } from '@nestjs/common';
import { JogadoresService } from './jogadores.service';
import { JogadoresResolver } from './jogadores.resolver';

@Module({
  providers: [JogadoresService, JogadoresResolver],
})
export class JogadoresModule {}
