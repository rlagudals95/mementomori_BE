import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { LoginedUser, MyJwtPayload } from './auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(playload: MyJwtPayload): LoginedUser {
    return { id: playload.userId };
  }
}

export const GetLoginedUser = createParamDecorator(
  (data, ctx: ExecutionContext): LoginedUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
