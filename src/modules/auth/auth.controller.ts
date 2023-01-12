import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public, AuthGuardByCookie } from './jwt-auth.guard';
import { LoginMethod } from './social-login/social-login.interface';
import { AuthService } from './auth.service';
import {
  AgreementDto,
  LoginResultDto,
  SendSmsDto,
  VerifySmsDto,
} from './auth.dto';
import { Request, Response } from 'express';
import { TEMP_TOKEN_NAME } from '@modules/temp-user/temp-user.constant';
import { GetLoginedUser } from './jwt.strategy';
import { LoginedUser } from './auth.interface';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: '소셜 로그인으로 가입/로그인' })
  @ApiParam({ name: 'loginMethod', enum: LoginMethod })
  @ApiQuery({
    name: 'code',
    description: '인가코드',
    required: false,
  })
  @ApiQuery({
    name: 'token',
    description:
      'OAuth callback 방식으로 로그인한 경우(Apple)에 사용하는 token',
    required: false,
  })
  @Get('oauth/:loginMethod')
  async socialLogin(
    @Param('loginMethod') loginMethod: LoginMethod,
    @Query('code') code: string,
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResultDto> {
    if (!code && !token) {
      throw new BadRequestException();
    }
    try {
      const result = await this.authService.login(loginMethod, code, token);
      response.cookie(TEMP_TOKEN_NAME, result.tempToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        // maxAge: TEMP_USER_MAX_AGE_SECONDS,
      });

      return {
        registeredUser: result.registeredUser,
        accessToken: result?.accessToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error);
      }
      throw error;
    }
  }

  @Public()
  @Redirect('', 302)
  @ApiOperation({ summary: '소셜 로그인 callback' })
  @ApiParam({ name: 'loginMethod', enum: LoginMethod })
  @ApiBody({
    description: 'payload',
  })
  @Post('oauth/:loginMethod/callback')
  async socialLoginCallback(
    @Param('loginMethod') loginMethod: LoginMethod,
    @Body() payload: any,
  ) {
    return this.authService.getRedirectUrl(payload, loginMethod);
  }

  @AuthGuardByCookie(TEMP_TOKEN_NAME)
  @ApiOperation({ summary: 'SMS로 인증코드 전송' })
  @ApiBody({ type: SendSmsDto })
  @Post('sms/send')
  async sendSms(
    @Body() sendSmsDto: SendSmsDto,
    @Req() request: Request,
    @GetLoginedUser() loginedUser: LoginedUser,
  ): Promise<{ success: true }> {
    await this.authService.sendSms(
      request?.cookies[TEMP_TOKEN_NAME],
      loginedUser?.id,
      sendSmsDto,
    );
    return { success: true };
  }

  @AuthGuardByCookie(TEMP_TOKEN_NAME)
  @ApiOperation({
    summary: 'SMS 인증코드 확인',
    description: '인증에 성공하면 전화번호가 temp user에 update 됨',
  })
  @ApiBody({ type: VerifySmsDto })
  @Post('sms/verify')
  async verifySms(
    @Body() verifySmsDto: VerifySmsDto,
    @Req() request: Request,
    @GetLoginedUser() loginedUser: LoginedUser,
  ): Promise<{ success: boolean }> {
    return {
      success: await this.authService.verifyCode(
        request?.cookies[TEMP_TOKEN_NAME],
        loginedUser?.id,
        verifySmsDto,
      ),
    };
  }

  @Public()
  @ApiOperation({ summary: '약관 동의' })
  @ApiBody({ type: AgreementDto })
  @Post('agreement')
  async postAgreement(
    @Req() request: Request,
    @Body() agreementDto: AgreementDto,
  ): Promise<LoginResultDto> {
    return await this.authService.loginWithAgreement(
      request?.cookies[TEMP_TOKEN_NAME],
      agreementDto,
    );
  }
}
