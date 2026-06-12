import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // Importamos a tipagem nativa da requisição

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  // Declaramos explicitamente que o retorno será um objeto Request
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);

    // Injetamos a tipagem no getContext para eliminar o 'any'
    return ctx.getContext<{ req: Request }>().req;
  }
}
