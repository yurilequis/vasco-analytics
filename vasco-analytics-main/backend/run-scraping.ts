import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ScrapingService } from './src/scraping/scraping.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const scrapingService = app.get(ScrapingService);
  
  console.log('Iniciando scrape de partidas...');
  await scrapingService.scrapePartidas();
  console.log('Partidas sincronizadas!');
  
  await app.close();
}
bootstrap();
