import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SocialLoginService } from './social-login/social-login.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { KakaoService } from './social-login/kakao.service';
import { NaverService } from './social-login/naver.service';
import { AppleService } from './social-login/apple.service';
import { AuthTempTokenRepository } from './auth-temp-token.repository';
import { SmsService } from './sms/sms.service';
import { AuthSmsVerificationRepository } from './auth-sms-verification.repository';
import { UserModule } from '@modules/user/user.module';
import { TempUserModule } from '@modules/temp-user/temp-user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`,
        },
      }),
    }),
    UserModule,
    TempUserModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    SocialLoginService,
    KakaoService,
    NaverService,
    AppleService,
    SmsService,
    AuthSmsVerificationRepository,
    AuthTempTokenRepository,
  ],
  exports: [AuthService, SocialLoginService],
})
export class AuthModule {}
