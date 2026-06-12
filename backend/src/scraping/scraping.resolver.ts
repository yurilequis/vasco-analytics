import { Resolver, Mutation } from '@nestjs/graphql';
import { ScrapingService } from './scraping.service';

@Resolver()
// @UseGuards(GqlAuthGuard)
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
  // ✅ Removido o 'async'
  dispararScrapingEstatisticas() {
    this.scrapingService.scrapeTodasEstatisticas();
    return true;
  }

  @Mutation(() => Boolean)
  // ✅ Removido o 'async'
  dispararScrapingDetalhes() {
    this.scrapingService.scrapeDetalhesPartidas();
    return true;
  }
}
