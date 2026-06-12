import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilita o CORS para permitir que o frontend (porta 3000) pegue os dados
  app.enableCors({
    origin: '*', // Permite todas as origens, mas em produção deve-se para o domínio do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Muda a porta do backend para 3001 para não brigar com o frontend
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 backend rodando na porta 3001`);
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});
