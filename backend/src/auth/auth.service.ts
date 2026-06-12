import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// ── CONTRATOS (INTERFACES) ─────────────────────────────
export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async hashSenha(senha: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(senha, saltRounds);
  }

  async validarUsuario(
    email: string,
    senhaLimpa: string,
  ): Promise<UsuarioAutenticado> {
    const emailNormalizado = email.toLowerCase().trim();

    // 1. Busca o usuário no banco
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    if (!usuario.senha) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 2. Compara a senha digitada com o hash protegido do banco
    const senhaValida = await bcrypt.compare(senhaLimpa, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 3. Mapeamento explícito (resolve o erro de variáveis nunca utilizadas)
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    };
  }

  // Gera o token (sem async, pois a operação é instantânea)
  gerarTokenLogin(usuario: UsuarioAutenticado) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }
}
