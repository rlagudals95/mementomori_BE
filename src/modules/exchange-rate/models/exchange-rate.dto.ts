import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { toArray } from '@utils/cast.util';
import { IsISO4217 } from '@utils/iso4217.decorator';
import { DataSource } from './exchange-rate.constant';
import { ExchangeRatePair } from './exchange-rate.schema';

// https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C#tab1
export interface KoreaEximExchangeRate {
  result: number; // 1 : 성공, 2 : DATA코드 오류, 3 : 인증코드 오류, 4 : 일일제한횟수 마감
  cur_unit: string; // 통화코드
  ttb: string; // 전신환(송금) 받으실때
  tts: string; // 전신환(송금) 보내실때
  deal_bas_r: string; // 매매 기준율
  bkpr: string; // 장부가격
  yy_efee_r: string; // 년환가료율
  ten_dd_efee_r: string;
  kftc_bkpr: string; //서울외국환중개 장부가격
  kftc_deal_bas_r: string; // 서울외국환중개 매매기준율
  cur_nm: string; // 국가/통화명
}

export class CurrencyCode {
  @Transform(({ value }) => toArray(value))
  @IsOptional()
  @IsArray()
  @IsISO4217({ each: true })
  currencyCode?: string[];
}

export class ExchangeRateDto {
  currencyCode: string;
  exchangeRate: number;
  symbol: string;
}

export class CreateExchangeRate {
  yyyymmdd: string;
  dataSource: DataSource;
  exchangeRate: ExchangeRatePair[];
}

export class UpdateExchangeRate extends PartialType(CreateExchangeRate) {}
