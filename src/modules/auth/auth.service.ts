import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInfo, LoginResult } from './auth.interface';
import {
  LoginMethod,
  SocialLoginUserInfo,
} from './social-login/social-login.interface';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { AuthTempTokenRepository } from './auth-temp-token.repository';
import generateNoDashUUID from '@utils/uuid.util';
import { SocialLoginService } from './social-login/social-login.service';
import {
  AgreementDto,
  AppleCallbackAuthCache,
  LoginResultDto,
  SendSmsDto,
  SmsVerificationCache,
  VerifySmsDto,
} from './auth.dto';
import { SmsService } from './sms/sms.service';
import { AuthSmsVerificationRepository } from './auth-sms-verification.repository';
import { UserService } from '@modules/user/user.service';
import { TempUserDto } from '@modules/temp-user/temp-user.model';
import { TempUserService } from '@modules/temp-user/temp-user.service';
import { InvalidArgumentError } from '@modules/common/common.exception';

@Injectable()
export class AuthService {
  readonly userIdSeperator: string = '/';

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private tempUserService: TempUserService,
    private configService: ConfigService,
    private smsService: SmsService,
    private smsVerificationRepository: AuthSmsVerificationRepository,
    private socialLoginService: SocialLoginService,
    private authTempTokenRepository: AuthTempTokenRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  public async login(
    loginMethod: LoginMethod,
    code: string,
    token: string,
  ): Promise<LoginResult> {
    let userId: string;
    if (code) {
      const socialUserInfo = await this.socialLoginService.login(
        loginMethod,
        code,
      );

      userId = this.makeUserId(socialUserInfo.id, loginMethod);
      const user = await this.userService.getUser(userId);
      if (!user) {
        const tempToken = generateNoDashUUID(10);
        await this.createTempUser(socialUserInfo, loginMethod, tempToken);
        return {
          registeredUser: false,
          tempToken,
        };
      }
    } else {
      const cached = await this.authTempTokenRepository.get(token);
      if (!cached) {
        throw new BadRequestException('Invalid token');
      }
      const appleAuthResult = JSON.parse(cached) as AppleCallbackAuthCache;
      if (!appleAuthResult.registeredUser) {
        return {
          registeredUser: false,
          tempToken: token,
        };
      }
      userId = appleAuthResult.userId;
      const { loginMethod: parsedLoginMethod } = this.parseUserId(userId);
      if (loginMethod !== parsedLoginMethod) {
        throw new BadRequestException(
          `Token not matched with loginMethod=${loginMethod}`,
        );
      }
    }

    return {
      registeredUser: true,
      accessToken: await this.getAuthToken(userId),
    };
  }

  public async loginWithAgreement(
    tempToken: string,
    request: AgreementDto,
  ): Promise<LoginResultDto> {
    const tempUser = await this.tempUserService.getUser(tempToken);
    if (!tempUser) {
      throw new BadRequestException('The tempToken is invalid or expired');
    }

    if (!tempUser.phone) {
      throw new BadRequestException('Phone is not verified yet');
    }
    const userId = this.makeUserId(tempUser.id, tempUser.loginMethod);

    await this.userService.createUser({
      ...tempUser,
      id: userId,
      marketingAgreedAt: request.marketingAgreedAt,
      marketingAgreement: request.marketingAgreement ?? [],
    });

    await this.tempUserService.deleteUser(tempToken);

    return {
      registeredUser: true,
      accessToken: await this.getAuthToken(userId),
    };
  }

  public async getRedirectUrl(payload: any, loginMethod: LoginMethod) {
    if (loginMethod !== LoginMethod.APPLE) {
      throw new BadRequestException(`Invalid loginMethod=${loginMethod}`);
    }

    try {
      const socialUserInfo = await this.socialLoginService.mapCallbackPayload(
        loginMethod,
        payload,
      );

      const userId = this.makeUserId(socialUserInfo.id, loginMethod);
      const user = await this.userService.getUser(userId);
      let registeredUser = true;
      const token = generateNoDashUUID(10);
      if (!user) {
        registeredUser = false;
        await this.createTempUser(socialUserInfo, loginMethod, token);
      }

      const cache: AppleCallbackAuthCache = { registeredUser, userId };
      await this.authTempTokenRepository.set(token, JSON.stringify(cache));

      const feUrl = this.configService.get('FRONTEND_SITE_URL');
      const url = `${feUrl}/${loginMethod}/oauth/callback?token=${token}`;
      return { url };
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        throw new BadRequestException();
      }
      throw error;
    }
  }

  public async sendSms(tempToken: string, userId: string, request: SendSmsDto) {
    if (!userId && !tempToken) {
      throw new UnauthorizedException();
    }
    try {
      let smsVerificationKey = userId;
      if (!smsVerificationKey) {
        const tempUser = await this.tempUserService.getUser(tempToken);
        if (!tempUser) {
          throw new BadRequestException('The tempToken is invalid or expired');
        }
        smsVerificationKey = tempToken;
      }
      const verificationCode = this.smsService.makeRandomNumber(6);
      this.smsService.sendSms(
        request.phone,
        `[오후의 직구 OHzig] 인증번호: ${verificationCode}`,
      );
      const cacheObj: SmsVerificationCache = {
        phone: request.phone,
        verificationCode,
      };
      this.smsVerificationRepository.set(
        smsVerificationKey,
        JSON.stringify(cacheObj),
      );
    } catch (error) {
      throw error;
    }
  }

  private async getSmsVerificationInfo(
    key: string,
  ): Promise<SmsVerificationCache> {
    const cached = await this.smsVerificationRepository.get(key);
    if (!cached) {
      throw new BadRequestException('verification code not found');
    }
    return JSON.parse(cached) as SmsVerificationCache;
  }

  public async verifyCode(
    tempToken: string,
    userId: string,
    request: VerifySmsDto,
  ): Promise<boolean> {
    if (!userId && !tempToken) {
      throw new UnauthorizedException();
    }

    try {
      const cachedObj = await this.getSmsVerificationInfo(userId ?? tempToken);
      if (request.verificationCode === cachedObj.verificationCode) {
        if (tempToken) {
          const tempUser = await this.tempUserService.getUser(tempToken);
          tempUser.phone = cachedObj.phone;
          await this.tempUserService.updateUser(tempToken, tempUser);
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  public getJwtToken(payload: AuthInfo) {
    return this.jwtService.sign({
      userId: payload.userId,
    });
  }

  public makeUserId(id: string, loginMethod: LoginMethod): string {
    return `${id}${this.userIdSeperator}${loginMethod}`;
  }

  public parseUserId(userId: string): { id: string; loginMethod: string } {
    const [id, loginMethod] = userId.split(this.userIdSeperator);
    return { id, loginMethod };
  }

  public async createTempUser(
    userInfo: SocialLoginUserInfo,
    loginMethod: LoginMethod,
    token: string,
  ): Promise<TempUserDto> {
    try {
      return this.tempUserService.createUser({
        token,
        phone: userInfo?.phone,
        id: userInfo.id,
        loginMethod: loginMethod,
        email: userInfo?.email,
        name: userInfo?.name,
        ageRange: userInfo?.ageRange,
        gender: userInfo?.gender,
      });
    } catch (error) {
      this.logger.info(`temp user[${userInfo.id}] already exists: ${error}`);
    }
  }

  public async getAuthToken(userId: string) {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new NotFoundException();
    }
    // TODO: refresh Token
    return this.getJwtToken({ userId });
  }
}
