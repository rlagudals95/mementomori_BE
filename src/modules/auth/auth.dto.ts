import { ApiProperty } from '@nestjs/swagger';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';
import { MarketingMethod } from '@modules/user/user.model';

export class SendSmsDto {
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;
}

export class VerifySmsDto {
  @IsNotEmpty()
  @Length(6, 6)
  @IsNumberString()
  verificationCode: string;
}

export class AgreementDto {
  @IsNotEmpty()
  marketingAgreedAt: number;

  @IsOptional()
  marketingAgreement?: MarketingMethod[];
}

export class LoginResultDto {
  @IsNotEmpty()
  registeredUser: boolean;

  @ApiProperty({
    description: 'registeredUser=true 인 경우(기 가입유저) 전송됨',
  })
  @IsOptional()
  accessToken?: string;
}

export interface SmsVerificationCache {
  phone: string;
  verificationCode: string;
}

export interface AppleCallbackAuthCache {
  registeredUser: boolean;
  userId: string;
}
