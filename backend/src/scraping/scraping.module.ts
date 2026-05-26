import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapingService } from './scraping.service';
import { ScrapingScheduler } from './scraping.scheduler';
import { ScrapingResolver } from './scraping.resolver';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    ScrapingService,
    ScrapingScheduler,
    ScrapingResolver,
    ScrapingResolver,
  ],
  exports: [ScrapingService],
})
export class ScrapingModule {}
