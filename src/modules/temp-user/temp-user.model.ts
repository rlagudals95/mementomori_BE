import { OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Schema } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { IndexType } from 'dynamoose/dist/Schema';
import { LoginMethod } from '@modules/auth/social-login/social-login.interface';

export const TempUserSchema = new Schema(
  {
    token: { type: String, hashKey: true },
    phone: {
      type: String,
      index: {
        name: 'phoneIndex',
        type: IndexType.global,
      },
    },
    id: String,
    loginMethod: {
      type: String,
      enum: Object.values(LoginMethod),
    },
    ageRange: String,
    name: String,
    gender: String,
    email: String,
  },
  {
    timestamps: true,
  },
);

export class TempUser extends Item {
  token: string;
  phone: string;
  id: string;
  loginMethod: LoginMethod;
  email?: string;
  name?: string;
  ageRange?: string;
  gender?: string;
}

export class TempUserDto {
  phone: string;
  id: string;
  loginMethod: LoginMethod;
  email?: string;
  name?: string;
}

export class CreateTempUser {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsEnum(LoginMethod)
  loginMethod: LoginMethod;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ageRange?: string;

  @IsOptional()
  @IsString()
  gender?: string;
}

export class UpdateTempUser extends PartialType(
  OmitType(CreateTempUser, ['token', 'phone'] as const),
) {}

export function toDto(user: TempUser): TempUserDto {
  if (!user) {
    return undefined;
  }
  return {
    phone: user.phone,
    id: user.id,
    loginMethod: user.loginMethod,
    email: user.email,
    name: user.name,
  };
}
