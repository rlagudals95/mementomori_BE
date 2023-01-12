import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  Dimensions,
  Price,
  Weight,
} from '@modules/common/models/product.model';
import { DeliverySpeed } from '../delivery.constant';

export class CalculateDeliveryFeeDto {
  @ApiProperty({ description: '배송 속도' })
  @IsEnum(DeliverySpeed)
  deliverySpeed: DeliverySpeed;

  @ApiProperty({ description: '대분류, 중분류, 소분류, 세분류' })
  @IsOptional()
  @IsArray()
  category?: string[];

  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '발송 국가 코드' })
  @IsNotEmpty()
  @IsString()
  @IsISO31661Alpha2()
  deliveryFrom: string;

  @ApiProperty({ description: '판매 플랫폼' })
  @IsNotEmpty()
  @IsString()
  platformDomainName: string;

  @ValidateNested()
  @Type(() => Weight)
  @IsOptional()
  weight?: Weight;

  @ValidateNested()
  @Type(() => Dimensions)
  @IsOptional()
  dimensions?: Dimensions;

  @ApiProperty({ description: '상품 원가' })
  @ValidateNested()
  @Type(() => Price)
  productPrice: Price;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class DeliveryFee {
  local: Price;
  international: Price;
  domestic: Price;
}

export class DeliveryFeeDto {
  deliveryFee: DeliveryFee;
  dutyAndTax: Price;
  commission: Price;
}
