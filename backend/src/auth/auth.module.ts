import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    
    JwtModule.register({
      secret: 'CHAVE_SECRETA_VASCO_ANALYTICS_2026', 
      signOptions: { expiresIn: '7d' }, 
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    PrismaService, 
    JwtStrategy,
  ],
  exports: [AuthService], 
})
export class AuthModule {}
