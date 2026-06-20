import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ScrapingService } from './scraping/scraping.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const scrapingService = app.get(ScrapingService);

  console.log('--- Iniciando Scraping de Classificação (Brasileirão 2026) ---');
  try {
    
    
    
    
    
    await scrapingService.rasparClassificacao(2);
    console.log('--- Scraping de Classificação concluído ---');
  } catch (error) {
    console.error('Erro durante o scraping de classificação:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
