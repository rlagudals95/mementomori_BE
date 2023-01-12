import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  Dimensions,
  Price,
  Weight,
} from '@modules/common/models/product.model';

export class OptionName {
  @IsNotEmpty()
  languageCode: string;
  @IsNotEmpty()
  value: string;
}

export class Option {
  @IsNotEmpty()
  id: string;

  @ValidateNested({ each: true })
  @Type(() => OptionName)
  @IsArray()
  @IsOptional()
  name?: OptionName[];

  @IsOptional()
  thumbnail?: string;

  @ValidateNested()
  @Type(() => Price)
  @IsOptional()
  price?: Price;

  @ValidateNested()
  @Type(() => Weight)
  @IsOptional()
  weight?: Weight;

  @ValidateNested()
  @Type(() => Dimensions)
  @IsOptional()
  dimensions?: Dimensions;
}
