import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';


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

    
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    if (!usuario.senha) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    
    const senhaValida = await bcrypt.compare(senhaLimpa, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    };
  }

  
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

  async registrar(nome: string, email: string, senhaLimpa: string): Promise<UsuarioAutenticado> {
    const emailNormalizado = email.toLowerCase().trim();
    
    const existe = await this.prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    if (existe) {
      throw new UnauthorizedException('E-mail já está em uso.');
    }

    const senhaHash = await this.hashSenha(senhaLimpa);
    
    const usuario = await this.prisma.usuario.create({
      data: {
        nome,
        email: emailNormalizado,
        senha: senhaHash,
        role: 'USER'
      }
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    };
  }

  async loginComGoogle(email: string, nome: string, googleId: string): Promise<UsuarioAutenticado> {
    const emailNormalizado = email.toLowerCase().trim();

    let usuario = await this.prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    if (usuario) {
      
      if (!usuario.googleId) {
        usuario = await this.prisma.usuario.update({
          where: { id: usuario.id },
          data: { googleId }
        });
      }
    } else {
      
      usuario = await this.prisma.usuario.create({
        data: {
          nome,
          email: emailNormalizado,
          googleId,
          role: 'USER'
        }
      });
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    };
  }
}
