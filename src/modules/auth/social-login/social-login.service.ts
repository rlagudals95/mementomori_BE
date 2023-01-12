import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { NaverService } from './naver.service';
import { AppleService } from './apple.service';
import { SocialLoginUserInfo, LoginMethod } from './social-login.interface';
import { AxiosError } from 'axios';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SocialLoginService {
  constructor(
    private kakaoService: KakaoService,
    private naverService: NaverService,
    private appleService: AppleService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  public async login(
    loginMethod: LoginMethod,
    code: string,
  ): Promise<SocialLoginUserInfo> {
    try {
      let userInfo: SocialLoginUserInfo;
      switch (loginMethod) {
        case LoginMethod.KAKAO:
          userInfo = await this.kakaoService.login(code);
          break;
        case LoginMethod.NAVER:
          userInfo = await this.naverService.login(code);
          break;
        case LoginMethod.APPLE:
          userInfo = await this.appleService.login(code);
          break;
        default:
          throw new BadRequestException(`${loginMethod} is not handled`);
      }
      return userInfo;
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_BAD_REQUEST') {
        this.logger.error(`${loginMethod} login failed`, error);
        throw new BadRequestException(
          `${loginMethod} login failed with provided auth code`,
        );
      }
      throw error;
    }
  }

  public async mapCallbackPayload(
    loginMethod: LoginMethod,
    payload: any,
  ): Promise<SocialLoginUserInfo> {
    let userInfo: SocialLoginUserInfo;
    switch (loginMethod) {
      case LoginMethod.APPLE:
        userInfo = await this.appleService.mapCallbackPayload(payload);
        break;
      default:
        throw new Error(`${loginMethod} is not handled`);
    }
    return userInfo;
  }
}
