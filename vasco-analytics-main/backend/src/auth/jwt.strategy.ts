import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';


export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface UsuarioValidado {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'CHAVE_SECRETA_VASCO_ANALYTICS_2026', 
    });
  }

  
  validate(payload: JwtPayload): UsuarioValidado {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
