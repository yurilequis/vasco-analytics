import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ScrapingService } from './scraping/scraping.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const scrapingService = app.get(ScrapingService);

  console.log('--- Iniciando Scraping de Teste ---');
  try {
    await scrapingService.scrapePartidas();
    console.log('--- Scraping concluído com sucesso ---');
  } catch (error) {
    console.error('Erro durante o scraping:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
