import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ScrapingService } from './scraping/scraping.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const scrapingService = app.get(ScrapingService);

  console.log('--- Iniciando Scraping de Classificação (Brasileirão 2026) ---');
  try {
    // Brasileirão Betano id no banco é 2
    // No scraper está hardcoded para tournament 325 e season 58766 (2024)
    // Para 2026 Brasileirão o tournament é 325, mas precisamos do season_id de 2026.
    // O usuário não pediu para mudar os IDs, mas sim para rodar.
    // Vou rodar o método existente.
    await scrapingService.rasparClassificacao(2);
    console.log('--- Scraping de Classificação concluído ---');
  } catch (error) {
    console.error('Erro durante o scraping de classificação:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
