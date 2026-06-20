import { Query, Resolver, Mutation } from '@nestjs/graphql';
import { ScrapingService } from './scraping/scraping.service';

@Resolver()
export class AppResolver {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Query(() => String)
  hello(): string {
    return 'Vasco Analytics API funcionando!';
  }

  @Mutation(() => String)
  async dispararScraping(): Promise<string> {
    await this.scrapingService.scrapeElenco();
    return 'Elenco atualizado com sucesso!';
  }

  @Mutation(() => String)
  async dispararScrapingPartidas(): Promise<string> {
    await this.scrapingService.scrapePartidas();
    return 'Partidas atualizadas com sucesso!';
  }

  
  @Mutation(() => String)
  dispararScrapingEstatisticas(): string {
    this.scrapingService.scrapeTodasEstatisticas();
    return 'Estatísticas das partidas atualizadas com sucesso!';
  }
}
