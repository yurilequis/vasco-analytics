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


@ObjectType()
export class UsuarioSessao {
  @Field(() => Int) id!: number;
  @Field(() => String) nome!: string;
  @Field(() => String) email!: string;
  @Field(() => String) role!: string;
}

@ObjectType()
export class AuthPayload {
  @Field(() => String) access_token!: string;
  @Field(() => UsuarioSessao) usuario!: UsuarioSessao;
}


@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('email', { type: () => String }) email: string, 
    @Args('senha', { type: () => String }) senhaLimpa: string
  ) {
    
    const usuario = await this.authService.validarUsuario(email, senhaLimpa);
    return this.authService.gerarTokenLogin(usuario);
  }

  
  @Mutation(() => Boolean)
  async criarPrimeiroAdmin(@Args('senha', { type: () => String }) senhaLimpa: string) {
    
    const count = await this.prisma.usuario.count();
    if (count > 0) return false;

    
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
    @Args('nome', { type: () => String }) nome: string,
    @Args('email', { type: () => String }) email: string,
    @Args('senha', { type: () => String }) senhaLimpa: string
  ) {
    const usuario = await this.authService.registrar(nome, email, senhaLimpa);
    return this.authService.gerarTokenLogin(usuario);
  }

  @Mutation(() => AuthPayload)
  async loginComGoogle(
    @Args('email', { type: () => String }) email: string,
    @Args('nome', { type: () => String }) nome: string,
    @Args('googleId', { type: () => String }) googleId: string
  ) {
    const usuario = await this.authService.loginComGoogle(email, nome, googleId);
    return this.authService.gerarTokenLogin(usuario);
  }
}
