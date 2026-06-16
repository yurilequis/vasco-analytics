import {
  Resolver,
  Mutation,
  Args,
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// ── TIPAGENS DE RESPOSTA DO GRAPHQL ────────────────────────
@ObjectType()
export class UsuarioSessao {
  @Field(() => Int) id!: number;
  @Field() nome!: string;
  @Field() email!: string;
  @Field() role!: string;
}

@ObjectType()
export class AuthPayload {
  @Field() access_token!: string;
  @Field(() => UsuarioSessao) usuario!: UsuarioSessao;
}

// ── ROTAS (ENDPOINTS) ──────────────────────────────────────
@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => AuthPayload)
  async login(@Args('email') email: string, @Args('senha') senhaLimpa: string) {
    // Valida as credenciais e devolve o token JWT
    const usuario = await this.authService.validarUsuario(email, senhaLimpa);
    return this.authService.gerarTokenLogin(usuario);
  }

  // Mutação de Setup Inicial (Gatilho único)
  @Mutation(() => Boolean)
  async criarPrimeiroAdmin(@Args('senha') senhaLimpa: string) {
    // Trava de segurança rigorosa: se já existir 1 usuário, a função aborta.
    const count = await this.prisma.usuario.count();
    if (count > 0) return false;

    // Cria o seu perfil de administrador com a senha criptografada
    const senhaHash = await this.authService.hashSenha(senhaLimpa);
    await this.prisma.usuario.create({
      data: {
        nome: 'Yuri Gabriel',
        email: 'admin@vascoanalytics.com',
        senha: senhaHash,
        role: 'ADMIN',
      },
    });

    return true;
  }
  @Mutation(() => AuthPayload)
  async registrar(
    @Args('nome') nome: string,
    @Args('email') email: string,
    @Args('senha') senhaLimpa: string
  ) {
    const usuario = await this.authService.registrar(nome, email, senhaLimpa);
    return this.authService.gerarTokenLogin(usuario);
  }

  @Mutation(() => AuthPayload)
  async loginComGoogle(
    @Args('email') email: string,
    @Args('nome') nome: string,
    @Args('googleId') googleId: string
  ) {
    const usuario = await this.authService.loginComGoogle(email, nome, googleId);
    return this.authService.gerarTokenLogin(usuario);
  }
}
