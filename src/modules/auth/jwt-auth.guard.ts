import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_TOKEN_AUTH_KEY = 'isTokenAuth';
export const AuthGuardByCookie = (tokenNameInCookie: string) =>
  SetMetadata(IS_TOKEN_AUTH_KEY, tokenNameInCookie);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const tokenNameInCookie = this.reflector.getAllAndOverride<string>(
      IS_TOKEN_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    const tokenExists = request?.cookies[tokenNameInCookie];
    if (tokenExists) {
      return true;
    }

    return super.canActivate(context);
  }
}
