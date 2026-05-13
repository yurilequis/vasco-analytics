import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapingService } from './scraping.service';
import { ScrapingScheduler } from './scraping.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ScrapingService, ScrapingScheduler],
  exports: [ScrapingService],
})
export class ScrapingModule {}
