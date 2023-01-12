import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { IndexType } from 'dynamoose/dist/Schema';
import { LoginMethod } from '@modules/auth/social-login/social-login.interface';
import { Expose } from 'class-transformer';

export enum MarketingMethod {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
}

export const UserSchema = new Schema(
  {
    id: { type: String, hashKey: true },
    phone: {
      type: String,
      index: {
        name: 'phoneIndex',
        type: IndexType.global,
      },
    },
    loginMethod: {
      type: String,
      enum: Object.values(LoginMethod),
    },
    ageRange: String,
    name: String,
    gender: String, //TODO enum
    email: String,
    marketingAgreedAt: Number,
    marketingAgreement: {
      type: Array,
      schema: [
        {
          type: String,
          enum: Object.values(MarketingMethod),
        },
      ],
    },
    PCCC: String,
    PCCCValidated: Boolean,
    defaultAddressId: String,
  },
  {
    timestamps: true,
  },
);

export class User extends Item {
  @Expose()
  id: string;

  @Expose()
  phone: string;

  @Expose()
  loginMethod: LoginMethod;

  @Expose()
  email?: string;

  @Expose()
  name?: string;

  ageRange?: string;

  gender?: string;

  @Expose()
  marketingAgreedAt?: number;

  @Expose()
  marketingAgreement?: MarketingMethod[];

  @Expose()
  PCCC?: string;

  @Expose()
  PCCCValidated?: boolean;

  @Expose()
  defaultAddressId?: string;
}

export class UserDto extends PartialType(User) {}

export class CreateUser {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

  @IsNotEmpty()
  @IsMobilePhone()
  @Expose()
  phone: string;

  @IsNotEmpty()
  @IsEnum(LoginMethod)
  @Expose()
  loginMethod: LoginMethod;

  @IsEmail()
  @Expose()
  email?: string;

  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @Expose()
  ageRange?: string;

  @IsOptional()
  @IsString()
  @Expose()
  gender?: string;

  @IsOptional()
  @Expose()
  marketingAgreedAt?: number;

  @IsEnum(MarketingMethod, { each: true })
  @Expose()
  marketingAgreement?: MarketingMethod[];

  @ApiProperty({ description: '개인통관고유부호' })
  @IsNotEmpty()
  @Matches(/^(p|P)[0-9]{11,13}$/)
  @Expose()
  PCCC?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  PCCCValidated?: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  defaultAddressId?: string;
}

export class UpdateUser extends PartialType(
  OmitType(CreateUser, ['id'] as const),
) {}
