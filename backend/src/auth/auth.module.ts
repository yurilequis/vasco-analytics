import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Registrando o motor do JWT e definindo as regras do "crachá"
    JwtModule.register({
      secret: 'CHAVE_SECRETA_VASCO_ANALYTICS_2026', // IMPORTANTE: Em produção, usaremos process.env.JWT_SECRET
      signOptions: { expiresIn: '7d' }, // O administrador precisará logar novamente a cada 7 dias
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    PrismaService, // Injetamos o Prisma para o AuthService conseguir bater no banco
    JwtStrategy,
  ],
  exports: [AuthService], // Exportamos caso outro módulo precise verificar permissões futuramente
})
export class AuthModule {}
