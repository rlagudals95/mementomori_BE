import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, Length, Matches } from 'class-validator';

export class ValidatePCCCDto {
  @ApiProperty({ description: '전화번호' })
  @IsNotEmpty()
  @IsMobilePhone()
  @Length(10, 11)
  phone: string;

  @ApiProperty({ description: '실명' })
  @IsNotEmpty()
  @Length(1, 12)
  name: string;

  @ApiProperty({ description: '개인통관고유부호' })
  @IsNotEmpty()
  @Matches(/^(p|P)[0-9]{12}$/)
  pccc: string;
}

export interface ValidatePCCCResult {
  ntceInfo: string;
  tCnt: string;
  persEcmQryRtnErrInfoVo: {
    errMsgCn: string;
  };
}
