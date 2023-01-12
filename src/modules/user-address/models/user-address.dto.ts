import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsISO31661Alpha2,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { UserAddress } from './user-address.schema';

export class UserAddressDto extends PartialType(UserAddress) {}

export class CreateUserAddress {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  addressId: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsMobilePhone()
  recipientPhone?: string;

  @ApiProperty({ description: '국가 코드. ISO 3166-1 alpha-2' })
  @IsString()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  @IsPostalCode('KR')
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsNotEmpty()
  @IsString()
  address2: string;

  @IsOptional()
  @IsString()
  deliveryRequest?: string;
}

export class CreateUserAddressDto extends OmitType(CreateUserAddress, [
  'userId',
  'addressId',
] as const) {}

export class UpdateUserAddress extends PartialType(CreateUserAddress) {}

export class UpdateUserAddressDto extends OmitType(UpdateUserAddress, [
  'userId',
] as const) {}
