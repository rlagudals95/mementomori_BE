import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
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
import { DeliveryFee } from '@modules/delivery/fee/calculate-delivery-fee.dto';
import { Option } from './cart.model';
import { Cart } from './cart.schema';

export class CartDto extends PartialType(Cart) {}

export class CreateCart {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      '옵션구성까지 포함하여 상품을 식별할 수 있는 ID. ex) SKU, ASIN',
  })
  productId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @ValidateNested()
  @Type(() => DeliveryFee)
  @IsOptional()
  deliveryFee?: DeliveryFee;

  @ValidateNested()
  @Type(() => Price)
  price: Price;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  @ApiProperty({ description: '판매 국가 코드. ISO 3166-1 alpha-2' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '판매 플랫폼. ex) www.amazon.com' })
  platformDomainName: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: '품절 여부' })
  isSoldOut?: boolean;

  @ValidateNested()
  @Type(() => Weight)
  @IsNotEmpty()
  weight: Weight;

  @ValidateNested()
  @Type(() => Dimensions)
  @IsOptional()
  dimensions: Dimensions;

  @ValidateNested()
  @Type(() => Option)
  @IsOptional()
  option?: Option;
}

export class CreateCartDto extends OmitType(CreateCart, [
  'userId',
  'productId',
  'deliveryFee',
] as const) {}

export class UpdateCart extends PartialType(CreateCart) {}

export class UpdateCartDto extends OmitType(UpdateCart, [
  'userId',
  'productId',
  'deliveryFee',
] as const) {}
