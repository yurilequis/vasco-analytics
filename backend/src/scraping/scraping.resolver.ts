import { Resolver, Mutation } from '@nestjs/graphql';
import { ScrapingService } from './scraping.service';

@Resolver()

export class ScrapingResolver {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Mutation(() => Boolean)
  async dispararScrapingPartidas() {
    await this.scrapingService.scrapePartidas();
    return true;
  }

  @Mutation(() => Boolean)
  async dispararScrapingElenco() {
    await this.scrapingService.scrapeElenco();
    return true;
  }

  @Mutation(() => Boolean)
  
  dispararScrapingEstatisticas() {
    this.scrapingService.scrapeTodasEstatisticas();
    return true;
  }

  @Mutation(() => Boolean)
  
  dispararScrapingDetalhes() {
    this.scrapingService.scrapeDetalhesPartidas();
    return true;
  }
}
