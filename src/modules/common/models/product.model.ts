import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { LengthUnit, WeightUnit } from './product.constant';
import { IsISO4217 } from '@utils/iso4217.decorator';

export class Price {
  @IsNotEmpty()
  @IsISO4217()
  currencyCode: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class Weight {
  @IsNotEmpty()
  @IsEnum(WeightUnit)
  unit: WeightUnit;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}

// https://elementarymath.edc.org/resources/measurement-length-width-height-depth/
// https://www.smartick.com/blog/mathematics/measurements-and-data/dimensions-length-width-height/
export class Dimensions {
  @IsNotEmpty()
  unit: LengthUnit;

  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  depth: number;
}
