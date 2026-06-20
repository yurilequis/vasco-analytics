import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapingService } from './scraping.service';
import { ScrapingScheduler } from './scraping.scheduler';
import { ScrapingResolver } from './scraping.resolver';
import { PartidasModule } from '../partidas/partidas.module';

@Module({
  imports: [ScheduleModule.forRoot(), PartidasModule],
  providers: [ScrapingService, ScrapingScheduler, ScrapingResolver],
  exports: [ScrapingService],
})
export class ScrapingModule {}
