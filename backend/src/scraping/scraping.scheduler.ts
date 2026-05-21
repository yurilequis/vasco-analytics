import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScrapingService } from './scraping.service';

@Injectable()
export class ScrapingScheduler {
  private readonly logger = new Logger(ScrapingScheduler.name);

  constructor(private readonly scrapingService: ScrapingService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async atualizarElenco(): Promise<void> {
    this.logger.log('Scheduler: atualizando elenco...');
    await this.scrapingService.scrapeElenco();
  }
}
