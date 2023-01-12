import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ScrapType } from './scrap.model';
import { Scrap } from './scrap.schema';

export class ScrapDto extends PartialType(Scrap) {}

export class CreateScrap {
  domain: string;
  type: ScrapType;
  url?: string;
}

export class GetScrapDto {
  @IsNotEmpty()
  @IsString()
  domain: string;

  @IsNotEmpty()
  @IsEnum(ScrapType)
  type: ScrapType;
}
